/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from "../trpc";
import { postRouter } from "./ticket";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),
  ticket: postRouter,
});

export type AppRouter = typeof appRouter;
