import type { Request, Response, NextFunction } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
export function errorMiddleware(error: Error, _request: Request, response: Response, next: NextFunction) {
    console.error(error.stack);
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
}