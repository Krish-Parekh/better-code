import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import type { IResponse } from "../types/main";

interface DecodedToken {
	id: string;
}
export function authMiddleware(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const accessToken = request.cookies.accessToken;
		if (!accessToken) {
			const payload: IResponse<unknown> = {
				status: StatusCodes.UNAUTHORIZED,
				message: ReasonPhrases.UNAUTHORIZED,
			};
			return response.status(StatusCodes.UNAUTHORIZED).json(payload);
		}
		const decoded = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET!,
		) as DecodedToken;
		const userId = decoded.id;
		if (!userId) {
			return response.status(StatusCodes.UNAUTHORIZED).json({
				status: StatusCodes.UNAUTHORIZED,
				message: ReasonPhrases.UNAUTHORIZED,
			});
		}
		request.userId = userId;
		next();
	} catch (error) {
		next(error);
	}
}
