/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { isAuthenticated, Token } from "../lib/auth";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
  user?: Token;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return { ..._opts };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  const {
    req: { cookies },
  } = opts;
  const user = isAuthenticated(opts);
  return await createContextInner({ user: user ? user : undefined });
}
