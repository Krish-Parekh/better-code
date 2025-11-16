import { fromNodeHeaders } from "better-auth/node";
import type { User } from "better-auth/types";
import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { IResponse } from "../types/main";
import { auth } from "../utils/auth";

export async function authMiddleware(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(request.headers),
		});
		if (!session) {
			const payload: IResponse<unknown> = {
				status: StatusCodes.UNAUTHORIZED,
				message: ReasonPhrases.UNAUTHORIZED,
			};
			return response.status(StatusCodes.UNAUTHORIZED).json(payload).end();
		}
		request.user = session?.user as User;
		next();
	} catch (error) {
		console.error(error);
		next(error);
	}
}
