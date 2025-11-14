import { Worker, Job } from "bullmq";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs-extra";
import Docker from "dockerode";

const docker = new Docker();

const testCases = [
    { input: "2 7 11 15\n9", expectedOutput: "0 1" },
    { input: "3 2 4\n6", expectedOutput: "1 2" },
    { input: "1 2 3 4 5\n7", expectedOutput: "2 4" },
    { input: "1 2 3 4 5\n10", expectedOutput: "" },
];

function stripDockerHeader(buffer: Buffer) {
    const output = buffer.toString('utf8');
    return output.replace(/[\x00-\x08\x0E-\x1F\x7F]|\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007/g, '').trim();
}

async function runSubmission(job: Job) {
    const { language, code } = job.data;
    const submissionId = uuidv4();
    const workDir = path.join("temp", submissionId);
    await fs.ensureDir(workDir);

    const codeFile = path.join(workDir, language === "python" ? "main.py" : "main.js");
    await fs.writeFile(codeFile, code);

    const image = language === "python" ? "python:3.11" : "node:22";
    const results = [];

    // Send initial progress - mark first test as running
    await job.updateProgress({ 
        current: 0, 
        total: testCases.length, 
        status: "starting",
        nextTestRunning: true
    });

    for (let i = 0; i < testCases.length; i++) {
        const { input, expectedOutput } = testCases[i]!;
        const inputFile = path.join(workDir, "input.txt");
        await fs.writeFile(inputFile, input);

        const runCommand =
            language === "python"
                ? "python3 -u /app/main.py < /app/input.txt"
                : "node /app/main.js < /app/input.txt";

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

            const waitResult = await container.wait();

            const logs = await container.logs({
                stdout: true,
                stderr: true,
                follow: false,
                timestamps: false,
                tail: 100,
            });

            
            const actualOutput = stripDockerHeader(logs).trim();
            
            // WA - Wrong Answer, AC - Accepted
            const status = actualOutput === expectedOutput ? "AC" : "WA";

            results.push({
                testCaseId: i + 1,
                status,
                actualOutput,
                expectedOutput,
            });

            // Send progress update after each test case with actual output
            await job.updateProgress({ 
                current: i + 1, 
                total: testCases.length, 
                status: "running",
                lastTestResult: status,
                actualOutput: actualOutput,
                expectedOutput: expectedOutput
            });

        } catch (error) {
            console.error(`Error running container for test case:`, error);
            results.push({
                testCaseId: i + 1,
                status: "RE",
                actualOutput: "",
                expectedOutput,
            });
            
            // Send progress even on error
            await job.updateProgress({ 
                current: i + 1, 
                total: testCases.length, 
                status: "running",
                lastTestResult: "RE",
                actualOutput: "",
                expectedOutput: expectedOutput
            });
            if (container) {
                try {
                    await container.remove({ force: true });
                } catch (cleanupError) {
                }
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
    }
});

worker.on("completed", (job, result) => {
    console.log(`Job ${job.id} completed successfully`, result);
});

worker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed`, error);
});
