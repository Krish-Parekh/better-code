import { Queue, QueueEvents } from "bullmq";

export const queueEvents = new QueueEvents("submissions", {
	connection: {
		host: "localhost",
		port: 6379,
		password: "redis123",
	},
});

export const submissionsQueue = new Queue("submissions", {
	connection: {
		host: "localhost",
		port: 6379,
		password: "redis123",
	},
});
