import type { CookieOptions } from "express";

export function createCookieOptions(
	overrides?: Partial<CookieOptions>,
): CookieOptions {
	const defaultOptions: CookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "prod",
		sameSite: "strict",
		path: "/",
	};

	return {
		...defaultOptions,
		...overrides,
	};
}
