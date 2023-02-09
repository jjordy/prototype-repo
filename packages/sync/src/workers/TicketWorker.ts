import { TicketJob } from "@/lib/createQueue";
import { Worker } from "bullmq";
import { client, Prisma } from "@/lib/client";

export const TicketWorker = new Worker<TicketJob>(
  "ticket",
  async (job) => {
    try {
      await client.ticket.create({
        data: job.data.input as Prisma.TicketCreateInput,
      });
    } catch (err) {
      console.log("TicketWorker Failure:", err);
    }
  },
  {
    connection: {
      password: process.env.REDIS_PASSWORD,
    },
  }
);

TicketWorker.on("completed", (job) => {
  console.log(`${job.id} has completed`);
});

TicketWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
