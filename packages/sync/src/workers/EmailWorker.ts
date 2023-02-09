import { Worker } from "bullmq";

export const EmailWorker = new Worker("email", async (job) => {
  console.log(job);
});
