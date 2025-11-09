export interface IResponse<T> {
	status: number;
	message: string;
	data?: T;
}

declare module "express-serve-static-core" {
	interface Request {
		userId?: string;
	}
}
