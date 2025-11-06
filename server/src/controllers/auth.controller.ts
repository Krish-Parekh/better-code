import bcrypt from "bcrypt";
import { and, eq, gt, isNull, lt } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { z } from "zod";
import db from "../db";
import { tokens } from "../db/schema/tokens";
import { users } from "../db/schema/users";
import type { IResponse } from "../types/main";
import { createCookieOptions } from "../utils/cookies";

const registerSchema = z.object({
    username: z.string().min(1).max(255),
    email: z.email().max(255),
    password: z.string().min(8).max(255),
});

const loginSchema = z.object({
    email: z.email().max(255),
    password: z.string().min(8).max(255),
});

export const register = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {

        const registerBodyResult = registerSchema.safeParse(request.body);
        if (!registerBodyResult.success) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.BAD_REQUEST,
                message: ReasonPhrases.BAD_REQUEST,
            };
            return response.status(StatusCodes.BAD_REQUEST).json(payload);
        }

        const { username, email, password } = registerBodyResult.data;

        const user = await db.select().from(users).where(eq(users.email, email));
        if (user.length > 0) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.BAD_REQUEST,
                message: "User already exists",
            };
            return response.status(StatusCodes.BAD_REQUEST).json(payload);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.insert(users).values({
            username,
            email,
            password: hashedPassword,
        });

        if (!result) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
            };
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(payload);
        }

        const payload: IResponse<unknown> = {
            status: StatusCodes.CREATED,
            message: ReasonPhrases.CREATED,
        };
        return response.status(StatusCodes.CREATED).json(payload);
    } catch (error) {
        next(error);
    }
};

export const login = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const loginBodyResult = loginSchema.safeParse(request.body);
        if (!loginBodyResult.success) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.BAD_REQUEST,
                message: ReasonPhrases.BAD_REQUEST,
            };
            return response.status(StatusCodes.BAD_REQUEST).json(payload);
        }

        const { email, password } = loginBodyResult.data;

        const userResult = await db
            .select()
            .from(users)
            .where(eq(users.email, email));
        if (userResult.length === 0 || !userResult[0]) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.BAD_REQUEST,
                message: "User not found",
            };
            return response.status(StatusCodes.BAD_REQUEST).json(payload);
        }

        const user = userResult[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.BAD_REQUEST,
                message: "Invalid password",
            };
            return response.status(StatusCodes.BAD_REQUEST).json(payload);
        }

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "1h" },
        );
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "2d" },
        );

        const accessTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        const refreshTokenExpiresAt = new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 2,
        ); // 2 days in milliseconds

        // by updating the revokedAt field, we revoke the old refresh token and prevent it from being used again
        await db
            .update(tokens)
            .set({ revokedAt: new Date() })
            .where(
                and(
                    eq(tokens.userId, user.id),
                    isNull(tokens.revokedAt),
                    gt(tokens.expiresAt, new Date()),
                ),
            );

        // insert the new refresh token, for the user ids get added 
        const result = await db.insert(tokens).values({
            userId: user.id,
            token: refreshToken,
            expiresAt: refreshTokenExpiresAt,
        });

        if (!result) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
            };
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(payload);
        }

        response.cookie(
            "accessToken",
            accessToken,
            createCookieOptions({
                expires: accessTokenExpiresAt,
            }),
        );
        response.cookie(
            "refreshToken",
            refreshToken,
            createCookieOptions({
                expires: refreshTokenExpiresAt,
            }),
        );

        const payload: IResponse<unknown> = {
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        };
        return response.status(StatusCodes.OK).json(payload);
    } catch (error) {
        next(error);
    }
};

export const refresh = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const incomingRefreshToken = request.cookies.refreshToken;
        if (!incomingRefreshToken) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.BAD_REQUEST,
                message: ReasonPhrases.BAD_REQUEST,
            };
            return response.status(StatusCodes.BAD_REQUEST).json(payload);
        }

        // verify the refresh token
        let decoded: jwt.JwtPayload;
        try {
            decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwt.JwtPayload;
        } catch (error) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.UNAUTHORIZED,
                message: ReasonPhrases.UNAUTHORIZED,
            };
            return response.status(StatusCodes.UNAUTHORIZED).json(payload);
        }

        const userId = (decoded as any).id;
        if (!userId) {
            return response.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusCodes.UNAUTHORIZED,
                message: "Malformed refresh token",
            } as IResponse<unknown>);
        }

        // Check for the exact tokens in our table
        const tokenRows = await db.select().from(tokens).where(and(eq(tokens.userId, userId), eq(tokens.token, incomingRefreshToken)));
        if (tokenRows.length === 0 || !tokenRows[0]) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.UNAUTHORIZED,
                message: ReasonPhrases.UNAUTHORIZED,
            };
            return response.status(StatusCodes.UNAUTHORIZED).json(payload);
        }

        const row = tokenRows[0];
        // if the token is not found, we return an unauthorized response
        if (!row) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.UNAUTHORIZED,
                message: ReasonPhrases.UNAUTHORIZED,
            };
            return response.status(StatusCodes.UNAUTHORIZED).json(payload);
        }

        // if the token is revoked, we return an unauthorized response
        if (row.revokedAt) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.UNAUTHORIZED,
                message: ReasonPhrases.UNAUTHORIZED,
            };
            return response.status(StatusCodes.UNAUTHORIZED).json(payload);
        }

        // if the token is expired, we return an unauthorized response
        if (row.expiresAt < new Date()) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.UNAUTHORIZED,
                message: ReasonPhrases.UNAUTHORIZED,
            };
            return response.status(StatusCodes.UNAUTHORIZED).json(payload);
        }

        // prepare new tokens
        const accessToken = jwt.sign(
            { id: userId },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "1h" },
        );
        const refreshToken = jwt.sign(
            { id: userId },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "2d" },
        );

        const accessTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        const refreshTokenExpiresAt = new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 2,
        ); // 2 days in milliseconds


        // but we need to update the revokedAt field, to the current date and time
        await db.update(tokens).set({ revokedAt: new Date() }).where(eq(tokens.id, row.id));
        
        // insert the new refresh token, for the user ids get added 
        const result = await db.insert(tokens).values({
            userId: userId,
            token: refreshToken,
            expiresAt: refreshTokenExpiresAt,
        });

        if (!result) {
            const payload: IResponse<unknown> = {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
            };
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(payload);
        }

        response.cookie(
            "accessToken",
            accessToken,
            createCookieOptions({
                expires: accessTokenExpiresAt,
            }),
        );
        response.cookie(
            "refreshToken",
            refreshToken,
            createCookieOptions({
                expires: refreshTokenExpiresAt,
            }),
        );

        const payload: IResponse<unknown> = {
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        };
        return response.status(StatusCodes.OK).json(payload);
    } catch (error) {
        next(error);
    }
};
