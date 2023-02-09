export type RouterInput = inferRouterInputs<AppRouter>;
import { Prisma } from "@/lib/client";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server/dist/core";
import { AppRouter } from "./trpc";

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type Ticket = RouterOutput["ticket"]["byId"];
export type User = RouterOutput["user"]["byId"];
export type Comment = RouterOutput["comment"]["byId"];
export type JsonValue = Prisma.JsonValue;
