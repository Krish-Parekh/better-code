import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { IResponse } from "../types/main";
export function errorMiddleware(
	error: Error,
	_request: Request,
	response: Response,
	_next: NextFunction,
) {
	console.error(error.stack);
	const payload: IResponse<unknown> = {
		status: StatusCodes.INTERNAL_SERVER_ERROR,
		message: ReasonPhrases.INTERNAL_SERVER_ERROR,
	};
	return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(payload);
}
