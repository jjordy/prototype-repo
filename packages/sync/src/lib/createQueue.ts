import { Queue } from "bullmq";
import { Prisma } from "@/lib/client";
export * from "@/workers/TicketWorker";

export type TicketJob = {
  input: Partial<Prisma.TicketCreateInput>;
};

export const ticketQueue = new Queue<TicketJob>("ticket", {
  connection: {
    password: process.env.REDIS_PASSWORD,
  },
});
