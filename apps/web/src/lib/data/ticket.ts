import client, { Prisma } from "@jjordy/data";
import { TICKET_SELECT_DATA } from "../constants";

export async function getTickets(where: Prisma.TicketWhereInput) {
  return client.ticket.findMany({
    where,
    select: TICKET_SELECT_DATA,
  });
}

export async function getTicketById(where: Prisma.TicketWhereInput) {
  return client.ticket.findFirst({
    where,
    select: TICKET_SELECT_DATA,
  });
}
