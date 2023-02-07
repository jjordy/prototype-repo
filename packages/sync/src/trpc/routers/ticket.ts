import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import client, { Prisma } from "@jjordy/data";

const defaultTicketSelect = Prisma.validator<Prisma.TicketSelect>()({
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
});

export const ticketRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
        id: z.number().optional(),
        NOT: z
          .array(z.object({ assignee: z.object({ id: z.number() }) }))
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50;
      const { cursor, id, NOT } = input;
      const where = { id, NOT };

      const items = await client.ticket.findMany({
        select: defaultTicketSelect,
        take: limit + 1,
        where,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          created_at: "desc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }
      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;
      const ticket = await client.ticket.findUnique({
        where: { id },
        select: defaultTicketSelect,
      });
      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No post with id '${id}'`,
        });
      }
      return ticket;
    }),
  add: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(32),
        author_id: z.number(),
        content: z.any(),
        status: z.enum(["TODO", "IN_PROGRESS", "BLOCKED", "DONE"]),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "BLOCKER"]),
        assignee_id: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const post = await client.ticket.create({
        data: input,
        select: defaultTicketSelect,
      });
      return post;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        author_id: z.number().optional(),
        content: z.any().optional(),
        status: z.enum(["TODO", "IN_PROGRESS", "BLOCKED", "DONE"]).optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "BLOCKER"]).optional(),
        assignee_id: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const comment = await client.ticket.update({
        data: input,
        where: { id: input.id },
        select: defaultTicketSelect,
      });
      return comment;
    }),
});
