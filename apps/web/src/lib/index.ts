import client from "@jjordy/data";
import type { Prisma } from "@jjordy/data";

export const getUser = async (where: Prisma.UserWhereUniqueInput) => {
  return client.user.findUnique({
    where,
    select: {
      owned_tickets: true,
      assigned_tickets: true,
      id: true,
      name: true,
      email: true,
    },
  });
};
