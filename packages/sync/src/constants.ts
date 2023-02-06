import { Prisma } from "@jjordy/data";

export const COMMENT_SELECT_DATA: Prisma.CommentSelect = {
  content: true,
  created_at: true,
  updated_at: true,
  id: true,
  author: {
    select: {
      name: true,
    },
  },
};

export const TICKET_SELECT_DATA: Prisma.TicketSelect = {
  title: true,
  id: true,
  status: true,
  created_at: true,
  updated_at: true,
  comments: {
    select: COMMENT_SELECT_DATA,
    orderBy: {
      created_at: "desc",
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

export const USER_SELECT_DATA: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  phone_number: true,
  address_1: true,
  address_2: true,
  city: true,
  state: true,
  zip_code: true,
  // created_at: true,
  // updated_at: true,
};
