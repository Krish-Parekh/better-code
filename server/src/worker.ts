import { type Job, Worker } from "bullmq";
import Docker from "dockerode";
import { eq } from "drizzle-orm";
import fs from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import db from "./db";
import { testCases } from "./db/schema/test_cases";

const docker = new Docker();

function stripDockerHeader(buffer: Buffer) {
	const output = buffer.toString("utf8");
	return output
		.replace(
			/[\x00-\x08\x0E-\x1F\x7F]|\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007/g,
			"",
		)
		.trim();
}

async function runSubmission(job: Job) {
	const { problemId, language, code } = job.data;

	const submissionId = uuidv4();

	const workDir = path.join("temp", submissionId);
	await fs.ensureDir(workDir);

	const codeFile = path.join(
		workDir,
		language === "python" ? "main.py" : "main.js",
	);
	await fs.writeFile(codeFile, code);

	const image = language === "python" ? "python:3.11" : "node:22";
	const results = [];
	const tcs = await db
		.select()
		.from(testCases)
		.where(eq(testCases.problemId, problemId));

	await job.updateProgress({
		current: 0,
		total: tcs.length,
		status: "starting",
		nextTestRunning: true,
	});

	for (let i = 0; i < tcs.length; i++) {
		const { stdin, stdout } = tcs[i]!;

		const inputFile = path.join(workDir, "input.txt");
		await fs.writeFile(inputFile, stdin);

		const runCommand = "python3 -u /app/main.py < /app/input.txt";

		let container;

		try {
			container = await docker.createContainer({
				Image: image,
				Cmd: ["/bin/sh", "-c", runCommand],
				WorkingDir: "/app",
				HostConfig: {
					Binds: [`${path.resolve(workDir)}:/app`],
					Memory: 128 * 1024 * 1024,
					NanoCpus: 500000000,
					AutoRemove: true,
					NetworkMode: "none",
					SecurityOpt: ["seccomp=unconfined"],
					PidsLimit: 100,
				},
				Tty: false,
			});

			await container.start();

			await container.wait();

			const logs = await container.logs({
				stdout: true,
				stderr: true,
				follow: false,
				timestamps: false,
				tail: 100,
			});

			const actualOutput = stripDockerHeader(logs).trim();

			const status = actualOutput === stdout ? "AC" : "WA";

			results.push({
				testCaseId: i + 1,
				status,
				actualOutput,
				expectedOutput: stdout,
			});

			// Send progress update after each test case with actual output
			await job.updateProgress({
				current: i + 1,
				total: tcs.length,
				status: "running",
				lastTestResult: status,
				actualOutput: actualOutput,
				expectedOutput: stdout,
			});
		} catch (error) {
			console.error(`Error running submission: ${error}`);
			await job.updateProgress({
				current: i,
				total: tcs.length,
				status: "failed",
			});
		} finally {
			if (container) {
				await container.remove({ v: true, force: true });
			}
		}
	}

	try {
		await fs.remove(workDir);
	} catch (error) {
		console.error(`Error cleaning up work directory:`, error);
	}

	return results;
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
