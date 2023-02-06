import client, { Prisma } from "@jjordy/data";
import { USER_SELECT_DATA } from "../constants";

export async function getUsers(where: Prisma.UserWhereInput) {
  return client.user.findMany({
    where,
    select: USER_SELECT_DATA,
  });
}

export async function getUserById(where: Prisma.UserWhereInput) {
  return client.user.findFirst({
    where,
    select: USER_SELECT_DATA,
  });
}

export type User = Prisma.PromiseReturnType<typeof getUserById>;
