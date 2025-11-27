import path from "node:path";
import { PassThrough } from "node:stream";
import { type Job, Worker } from "bullmq";
import Docker from "dockerode";
import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";
import db from "./db";
import { testCases } from "./db/schema/test_cases";
const docker = new Docker();
import { eq } from "drizzle-orm";
import type { ITestCase } from "./types/main";

const SUPPORTED_LANGUAGES = {
	python: "python:3.13-alpine",
	javascript: "node:23-alpine",
}

const LANGUAGE_EXEC_MAP = {
	python: "python3 -u /app/solution.py < /app/input.txt",
	javascript: "node /app/solution.js < /app/input.txt"
}

async function runSubmission(job: Job) {
	const submissionId = uuidv4();
	console.log(`[${submissionId}] Starting submission processing for job ${job.id}`);

	try {
		const { problemId, language, code } = job.data;
		console.log(`[${submissionId}] Processing submission - Problem ID: ${problemId}, Language: ${language}`);

		// Emit progress: Starting
		await job.updateProgress({
			type: "status",
			status: "PENDING",
			message: "Starting submission processing...",
		});

		// Get the test cases from the database.
		console.log(`[${submissionId}] Fetching test cases from database for problem ${problemId}`);
		const testCaseRows = await db.select().from(testCases).where(eq(testCases.problemId, problemId)) as ITestCase[];
		console.log(`[${submissionId}] Found ${testCaseRows.length} test cases`);

		// Emit progress: Test cases found
		await job.updateProgress({
			type: "status",
			status: "PROCESSING",
			message: `Found ${testCaseRows.length} test cases`,
			totalTestCases: testCaseRows.length,
		});

		// Create a temporary working directory for the submission
		const workDir = path.resolve("temp", submissionId);
		console.log(`[${submissionId}] Creating working directory: ${workDir}`);
		await fs.ensureDir(workDir);

		// Emit progress: Preparing code
		await job.updateProgress({
			type: "status",
			status: "PROCESSING",
			message: "Preparing code for execution...",
		});

		// Write the code to the temporary working directory
		console.log(`[${submissionId}] Writing code to working directory`);
		switch (language) {
			case "python":
				await fs.writeFile(path.join(workDir, "solution.py"), code);
				console.log(`[${submissionId}] Python code written to solution.py`);
				break;
			case "javascript":
				await fs.writeFile(path.join(workDir, "solution.js"), code);
				console.log(`[${submissionId}] JavaScript code written to solution.js`);
				break;
			default:
				console.error(`[${submissionId}] Unsupported language: ${language}`);
				throw new Error(`Unsupported language: ${language}`);
		}

		// Get the image for the language.
		const image = SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES];

		if (!image) {
			console.error(`[${submissionId}] No Docker image found for language: ${language}`);
			throw new Error(`Unsupported language: ${language}`);
		}

		console.log(`[${submissionId}] Using Docker image: ${image}`);

		// Emit progress: Creating container
		await job.updateProgress({
			type: "status",
			status: "PROCESSING",
			message: "Creating Docker container...",
		});

		// Create a container for the submission.
		let container: Docker.Container | null = null;
		try {
			console.log(`[${submissionId}] Creating Docker container`);
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

			console.log(`[${submissionId}] Starting Docker container`);
			await container.start();

			// Emit progress: Container started
			await job.updateProgress({
				type: "status",
				status: "PROCESSING",
				message: "Container started, running test cases...",
			});

			// Run the test cases.
			console.log(`[${submissionId}] Running ${testCaseRows.length} test cases`);
			for (let i = 0; i < testCaseRows.length; i++) {
				const testCase = testCaseRows[i];
				if (!testCase) {
					throw new Error(`Test case ${i + 1} is undefined`);
				}
				const { stdin, stdout } = testCase;
				console.log(`[${submissionId}] Running test case ${i + 1}/${testCaseRows.length}`);

				// Emit progress: Running test case
				await job.updateProgress({
					type: "testCase",
					status: "PROCESSING",
					message: `Running test case ${i + 1}/${testCaseRows.length}...`,
					currentTestCase: i + 1,
					totalTestCases: testCaseRows.length,
				});

				const exec = await container.exec({
					Cmd: ["sh", "-c", LANGUAGE_EXEC_MAP[language as keyof typeof LANGUAGE_EXEC_MAP]],
					AttachStdout: true,
					AttachStderr: true,
				});

				// Write an input file to the container.
				console.log(`[${submissionId}] Writing input for test case ${i + 1}`);
				await fs.writeFile(path.join(workDir, "input.txt"), stdin);

				// Start the execution.
				console.log(`[${submissionId}] Executing test case ${i + 1}`);
				const stream = await exec.start({ Detach: false, Tty: false });

				let stdoutOutput = "";
				let stderrOutput = "";
				
				// Use dockerode's modem to demultiplex stdout and stderr
				const modem = (docker as any).modem;
				if (modem && modem.demuxStream) {
					// dockerode provides demuxStream utility
					const stdoutStream = new PassThrough();
					const stderrStream = new PassThrough();
					
					modem.demuxStream(stream, stdoutStream, stderrStream);
					
					stdoutStream.on("data", (chunk: Buffer) => {
						stdoutOutput += chunk.toString("utf-8");
					});
					
					stderrStream.on("data", (chunk: Buffer) => {
						stderrOutput += chunk.toString("utf-8");
					});
					
					await new Promise((resolve, reject) => {
						stream.on("end", resolve);
						stream.on("error", reject);
					});
				} else {
					// Fallback: manual parsing of Docker multiplexed stream
					stream.on("data", (chunk: Buffer) => {
						if (chunk.length >= 8) {
							// Docker multiplex format: [stream_type(1)][padding(3)][size(4)][data...]
							const streamType = chunk[0];
							const data = chunk.slice(8);
							
							if (streamType === 1) {
								stdoutOutput += data.toString("utf-8");
							} else if (streamType === 2) {
								stderrOutput += data.toString("utf-8");
							}
						} else {
							// Small chunk, likely just data
							stdoutOutput += chunk.toString("utf-8");
						}
					});

					await new Promise((resolve, reject) => {
						stream.on("end", resolve);
						stream.on("error", reject);
					});
				}

				// Log stderr if present for debugging
				if (stderrOutput.trim()) {
					console.log(`[${submissionId}] Test case ${i + 1} stderr: ${stderrOutput.trim()}`);
				}

				const actualOutput = stdoutOutput.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
				const expectedOutput = stdout.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
				
				// Debug: log actual bytes to see hidden characters
				console.log(`[${submissionId}] Test case ${i + 1} - Expected (${expectedOutput.length} chars): "${expectedOutput}"`);
				console.log(`[${submissionId}] Test case ${i + 1} - Got (${actualOutput.length} chars): "${actualOutput}"`);
				console.log(`[${submissionId}] Test case ${i + 1} - Expected bytes: [${Array.from(Buffer.from(expectedOutput)).join(',')}]`);
				console.log(`[${submissionId}] Test case ${i + 1} - Got bytes: [${Array.from(Buffer.from(actualOutput)).join(',')}]`);
				
				const isMatch = actualOutput === expectedOutput;
				console.log(`[${submissionId}] Test case ${i + 1} result: ${isMatch ? 'PASS' : 'FAIL'}`);

				// Emit progress: Test case result
				await job.updateProgress({
					type: "testCase",
					status: isMatch ? "PASSED" : "FAILED",
					message: `Test case ${i + 1} ${isMatch ? 'passed' : 'failed'}`,
					currentTestCase: i + 1,
					totalTestCases: testCaseRows.length,
					passed: isMatch,
					expected: expectedOutput,
					actual: actualOutput,
				});

				if (!isMatch) {
					console.error(`[${submissionId}] Test case ${i + 1} failed - Expected: "${expectedOutput}", Got: "${actualOutput}"`);
					
					// Emit progress: Submission failed
					await job.updateProgress({
						type: "status",
						status: "REJECTED",
						message: `Test case ${i + 1} failed`,
						error: `Expected: "${expectedOutput}", Got: "${actualOutput}"`,
					});
					
					throw new Error(`Test case failed: ${stdin} -> ${actualOutput} !== ${expectedOutput}`);
				}

				// Clean the output file.
				await fs.remove(path.join(workDir, "input.txt"));
				await fs.remove(path.join(workDir, "output.txt"));
			}

			console.log(`[${submissionId}] All test cases passed successfully`);

			// Emit progress: All tests passed
			await job.updateProgress({
				type: "status",
				status: "ACCEPTED",
				message: "All test cases passed!",
				totalTestCases: testCaseRows.length,
				passedTestCases: testCaseRows.length,
			});

			// Clean the working directory.
			console.log(`[${submissionId}] Cleaning up working directory`);
			await fs.remove(workDir);

			console.log(`[${submissionId}] Submission completed successfully`);
			return { 
				success: true,
				status: "ACCEPTED",
				message: "All test cases passed",
				totalTestCases: testCaseRows.length,
			};
		} catch (error) {
			console.error(`[${submissionId}] Container execution failed:`, error);
			
			// Emit progress: Error occurred
			try {
				await job.updateProgress({
					type: "status",
					status: "REJECTED",
					message: "Execution failed",
					error: error instanceof Error ? error.message : String(error),
				});
			} catch (progressError) {
				console.error(`[${submissionId}] Failed to update progress:`, progressError);
			}
			
			throw new Error(`Failed to create container: ${error}`);
		} finally {
			console.log(`[${submissionId}] Cleanup: Removing working directory`);
			await fs.remove(workDir);

			if (container) {
				console.log(`[${submissionId}] Cleanup: Stopping and removing container`);
				try {
					await container.stop();
					await container.remove();
				} catch (cleanupError) {
					console.error(`[${submissionId}] Error during container cleanup:`, cleanupError);
				}
			}
		}

	} catch (error) {
		console.error(`[${submissionId}] Submission processing failed:`, error);
		
		// Emit progress: Submission failed
		try {
			await job.updateProgress({
				type: "status",
				status: "REJECTED",
				message: "Submission processing failed",
				error: error instanceof Error ? error.message : String(error),
			});
		} catch (progressError) {
			console.error(`[${submissionId}] Failed to update progress:`, progressError);
		}
		
		throw new Error(`Failed to run submission: ${error}`);
	}
}

const worker = new Worker("submissions", runSubmission, {
	connection: {
		host: "localhost",
		port: 6379,
		password: "redis123",
	},
});

worker.on("completed", (job, result) => {
	console.log(`Job ${job.id} completed successfully`, result);
});

worker.on("failed", (job, error) => {
	console.error(`Job ${job?.id} failed`, error);
});