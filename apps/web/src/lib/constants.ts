import { Prisma } from "@jjordy/data";

export const TICKET_SELECT_DATA: Prisma.TicketSelect = {
  title: true,
  id: true,
  status: true,
  created_at: true,
  updated_at: true,
  comments: {
    select: {
      content: true,
      created_at: true,
      updated_at: true,
      id: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  },
  content: true,
  priority: true,
  assignee: {
    select: {
      name: true,
      id: true,
    },
  },
};
