import path from "node:path";
import Docker from "dockerode";
import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";

interface IRunSubmission {
	language: "python" | "javascript";
	code: string;
}

interface ITestCase {
	input: string;
	expectedOutput: string;
}

const imageLookup: Record<IRunSubmission["language"], string> = {
	python: "python:3.13-alpine",
	
	javascript: "node:23-alpine",
};


const runCommandLookup: Record<IRunSubmission["language"], string> = {
	python: "python3 -u /app/solution.py < /app/input.txt",
	javascript: "node /app/solution.js < /app/input.txt",
};

const docker = new Docker();

const testCases: ITestCase[] = [
	{ input: "2 7 11 15\n9", expectedOutput: "0 1" },
	{ input: "3 2 4\n6", expectedOutput: "1 2" },
	{ input: "1 2 3 4 5\n7", expectedOutput: "2 4" },
	{ input: "1 2 3 4 5\n10", expectedOutput: "" },
];

async function runSubmission({ language, code }: IRunSubmission) {
	const submissionId = uuidv4();
	const workDir = path.resolve("temp", submissionId);

	await fs.ensureDir(workDir);

	// Write solution file
	switch (language) {
		case "python":
			await fs.writeFile(path.join(workDir, "solution.py"), code);
			break;
		case "javascript":
			await fs.writeFile(path.join(workDir, "solution.js"), code);
			break;
		default:
			throw new Error(`Unsupported language: ${language}`);
	}

	const image = imageLookup[language];
	let container: Docker.Container | null = null;

	try {
		// Create container once
		console.log("Creating container");
		container = await docker.createContainer({
			Image: image,
			WorkingDir: "/app",
			Cmd: ["sleep", "infinity"], // Keep container running
			AttachStdout: true,
			AttachStderr: true,
			HostConfig: {
				Binds: [`${workDir}:/app`],
				Memory: 512 * 1024 * 1024, // 512MB limit
				NetworkMode: "none", // Security: disable network
			},
		});

		await container.start();
		console.log("Container started");

		// Run all test cases in the same container
		for (const testCase of testCases) {
			const { input, expectedOutput } = testCase;

			console.log(`\nTest case:`);
			console.log("Input:", input);
			console.log("Expected:", expectedOutput);

			// Write input file
			await fs.writeFile(path.join(workDir, "input.txt"), input);

			// Execute command in running container
			const exec = await container.exec({
				Cmd: ["sh", "-c", runCommandLookup[language]],
				AttachStdout: true,
				AttachStderr: true,
			});

			const stream = await exec.start({ Detach: false });

			// Collect output
			let output = "";
			stream.on("data", (chunk: Buffer) => {
				output += chunk.toString("utf-8");
			});

			await new Promise((resolve) => stream.on("end", resolve));

			// Clean output (remove Docker stream headers)
			const cleanOutput = output
				.replace(/[\x00-\x08]/g, "")
				.trim();

			console.log("Output:", cleanOutput);
			console.log("Match:", cleanOutput === expectedOutput ? "✓" : "✗");
		}
	} finally {
		// Cleanup
		if (container) {
			try {
				await container.stop({ t: 1 });
				await container.remove();
				console.log("\nContainer cleaned up");
			} catch (err) {
				console.error("Cleanup error:", err);
			}
		}
		await fs.remove(workDir);
	}
}
const submissionLookup: Record<string, string> = {
	"python": `
# Python - Two Sum
class Solution:
    def solve(self, nums, target):
        num_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in num_map:
                return [num_map[complement], i]
            num_map[num] = i
        return []

if __name__ == "__main__":
    import sys
    input_text = sys.stdin.read()
    
    lines = [line.strip() for line in input_text.splitlines() if line.strip()]
    
    nums = [int(x) for x in lines[0].split()]
    target = int(lines[1])
    
    ans = Solution().solve(nums, target)
    print(" ".join(map(str, ans)))
	`,
	"javascript": `
// JavaScript - Two Sum
class Solution {
	solve(nums, target) {
		for (let i = 0; i < nums.length; i++) {
			for (let j = i + 1; j < nums.length; j++) {
				if (nums[i] + nums[j] === target) {
					return [i, j];
				}
			}
		}
		return [];
	}
}

const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim();
const lines = input.split("\\n");
const nums = lines[0].trim().split(" ").map(Number);
const target = Number(lines[1]);
const ans = new Solution().solve(nums, target);
console.log(ans.join(" "));
	`,
}


async function main() {
	for (const language in submissionLookup) {
		console.log(language);
		console.log(submissionLookup[language]);
		console.log("--------------------------------");
		await runSubmission({
			language,
			code: submissionLookup[language],
		});
	}
}
main();

