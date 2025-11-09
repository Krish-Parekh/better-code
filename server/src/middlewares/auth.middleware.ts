import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

interface JwtPayload {
	id: string;
}

export function authMiddleware(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	const incomingAccessToken = request.cookies.accessToken;
	if (!incomingAccessToken) {
		return response.status(StatusCodes.UNAUTHORIZED).json({
			status: StatusCodes.UNAUTHORIZED,
			message: ReasonPhrases.UNAUTHORIZED,
		});
	}
	try {
		const decoded = jwt.verify(
			incomingAccessToken,
			process.env.ACCESS_TOKEN_SECRET!,
		) as JwtPayload;
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