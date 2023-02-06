import client, { Prisma } from "@jjordy/data";
import { COMMENT_SELECT_DATA, TICKET_SELECT_DATA } from "../constants";

export async function getCommentsTicketById(where: Prisma.CommentWhereInput) {
  return client.comment.findFirst({
    where,
    select: COMMENT_SELECT_DATA,
  });
}

export type Comment = Prisma.PromiseReturnType<typeof getCommentsTicketById>;
