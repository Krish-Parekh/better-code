import type { CookieOptions } from "express";

export function createCookieOptions(
	overrides?: Partial<CookieOptions>,
): CookieOptions {
	const defaultOptions: CookieOptions = {
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		path: "/",
	};

	return {
		...defaultOptions,
		...overrides,
	};
}
