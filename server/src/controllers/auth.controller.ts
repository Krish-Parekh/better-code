import type { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import db from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema/users";
import bcrypt from "bcrypt";
import type { IResponse } from "../types/main";

const registerSchema = z.object({
    username: z.string().min(1).max(255),
    email: z.email().max(255),
    password: z.string().min(8).max(255),
});

export const register = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const registerBodyResult = registerSchema.safeParse(request.body);
        if (!registerBodyResult.success) {
            const payload: IResponse<unknown> = { status: StatusCodes.BAD_REQUEST, message: ReasonPhrases.BAD_REQUEST };
            return response.status(StatusCodes.BAD_REQUEST).json(payload);
        }

        const { username, email, password } = registerBodyResult.data;

        const user = await db.select().from(users).where(eq(users.email, email));
        if (user.length > 0) {
            const payload: IResponse<unknown> = { status: StatusCodes.BAD_REQUEST, message: "User already exists" };
            return response.status(StatusCodes.BAD_REQUEST).json(payload);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.insert(users).values({
            username,
            email,
            password: hashedPassword,
        });

        const payload: IResponse<unknown> = { status: StatusCodes.CREATED, message: ReasonPhrases.CREATED, data: newUser };
        return response.status(StatusCodes.CREATED).json(payload);
    } catch (error) {
        next(error);
    }
};