import { publicProcedure, router } from "../trpc";
import { authRouter } from "./auth";
import { commentRouter } from "./comment";
import { ticketRouter } from "./ticket";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  comment: commentRouter,
  healthcheck: publicProcedure.query(() => "yay!"),
  ticket: ticketRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
