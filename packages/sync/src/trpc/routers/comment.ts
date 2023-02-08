import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { client, Prisma } from "@jjordy/data";

const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  content: true,
  created_at: true,
  updated_at: true,
  id: true,
  author: {
    select: {
      name: true,
    },
  },
});

export const commentRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
        id: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50;
      const { cursor, id } = input;
      const where = { id };
      const items = await client.comment.findMany({
        select: defaultCommentSelect,
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
      const comment = await client.comment.findUnique({
        where: { id },
        select: defaultCommentSelect,
      });
      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No post with id '${id}'`,
        });
      }
      return comment;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.object({ schema: z.object({}) }),
      })
    )
    .mutation(async ({ input }) => {
      const { id, content } = input;
      const comment = await client.comment.update({
        data: { content },
        where: { id },
        select: defaultCommentSelect,
      });
      return comment;
    }),
  create: publicProcedure
    .input(
      z.object({
        ticket_id: z.number(),
        author_id: z.number(),
        content: z.object({ schema: z.array(z.any()) }),
      })
    )
    .mutation(async ({ input }) => {
      const { content, ticket_id, author_id } = input;
      const comment = await client.comment.create({
        data: { content, ticket_id, author_id },
        select: defaultCommentSelect,
      });
      return comment;
    }),
});
