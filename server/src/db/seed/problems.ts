import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import {
    twoSumPythonCode,
    twoSumJavascriptCode,
    maximumSubarraySumPythonCode,
    maximumSubarraySumJavascriptCode,
    subarraySumEqualsKPythonCode,
    subarraySumEqualsKJavascriptCode
} from "../data/template";
import db from "..";
import { problems } from "../schema/problems";
import { sql } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const twoSumMdx = await fs.readFile(path.join(__dirname, "../data/two-sum.mdx"), "utf-8");
const maximumSubarraySumMdx = await fs.readFile(path.join(__dirname, "../data/maximum-subarray-sum.mdx"), "utf-8");
const subarraySumMdx = await fs.readFile(path.join(__dirname, "../data/subarray-sum.mdx"), "utf-8");

const data = [
    {
        title: "Two Sum",
        bodyMdx: twoSumMdx,
        metadata: {
            templates: {
                python: twoSumPythonCode,
                javascript: twoSumJavascriptCode,
            }
        }
    },
    {
        title: "Maximum Subarray Sum",
        bodyMdx: maximumSubarraySumMdx,
        metadata: {
            templates: {
                python: maximumSubarraySumPythonCode,
                javascript: maximumSubarraySumJavascriptCode,
            }
        }
    },
    {
        title: "Subarray Sum Equals K",
        bodyMdx: subarraySumMdx,
        metadata: {
            templates: {
                python: subarraySumEqualsKPythonCode,
                javascript: subarraySumEqualsKJavascriptCode,
            }
        }
    }
]


export default async function seedProblems() {
    try {
        console.log("Seeding problems...");
        for (const problem of data) {
        try {
            const result = await db.insert(problems).values(problem).onConflictDoUpdate({
                target: [problems.title],
                set: {
                    updatedAt: sql`now()`,
                },
            });
            console.log(`Seeded problem ${result.rowCount || 0}`);
        } catch (error) {
            console.error(`Error seeding problem ${problem.title}:`, error);
            throw error;
        }
        }
    } catch (error) {
        console.error(`Error seeding problems:`, error);
        throw error;
    }
}