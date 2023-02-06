/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import client, { Prisma } from "@jjordy/data";

/**
 * Default selector for Ticket.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

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

export const postRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ input }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */

      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await client.ticket.findMany({
        select: defaultTicketSelect,
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
        where: {},
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
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      console.log("HELLO HELLO I WAS INDEED CALLED", id);
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
});
