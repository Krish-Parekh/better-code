import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const twoSumMdx = await fs.readFile(
	path.join(__dirname, "two-sum.mdx"),
	"utf8",
);

export const maximumSubarraySumMdx = await fs.readFile(
	path.join(__dirname, "maximum-subarray-sum.mdx"),
	"utf8",
);

export const subarraySumMdx = await fs.readFile(
	path.join(__dirname, "subarray-sum.mdx"),
	"utf8",
);
