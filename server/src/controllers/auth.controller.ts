import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import jwt from "jsonwebtoken";
import db from "../db";
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

        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "2d" });

        response.cookie("accessToken", accessToken, createCookieOptions({
            expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour 
        }));
        response.cookie("refreshToken", refreshToken, createCookieOptions({
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days
        }));

        const payload: IResponse<unknown> = {
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        };
        return response.status(StatusCodes.OK).json(payload);
	} catch (error) {
		next(error);
	}
};
