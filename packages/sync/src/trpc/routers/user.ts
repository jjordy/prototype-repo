import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import client, { Prisma } from "@jjordy/data";
import { createPasswordHash, signToken, validPassword } from "../../auth";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  name: true,
  phone_number: true,
  address_1: true,
  address_2: true,
  city: true,
  state: true,
  zip_code: true,
  created_at: true,
  updated_at: true,
});

export const userRouter = router({
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
      const items = await client.user.findMany({
        select: defaultUserSelect,
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
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const u = await client.user.findUnique({
        where: { id: ctx.user?.sub || id },
        select: defaultUserSelect,
      });
      if (!u) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No post with id '${id}'`,
        });
      }
      return u;
    }),
  update: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        phone_number: z.string().optional(),
        address_1: z.string().optional().nullish(),
        address_2: z.string().optional().nullish(),
        city: z.string().optional().nullish(),
        state: z.string().optional().nullish(),
        zip_code: z.string().optional().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must be authorized to make this request",
        });
      }
      const post = await client.user.update({
        data: input,
        where: { id: ctx.user.sub },
        select: defaultUserSelect,
      });
      return post;
    }),
  signin: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await client.user.findFirst({
        where: { email: input.email },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Unable to find user with email ${input.email}`,
        });
      }
      if (!validPassword(input.password, user.hash, user.salt)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Unable to find user with email ${input.email}`,
        });
      }
      const token = signToken(
        { email: user.email, name: user.name, sub: user.id },
        //@ts-expect-error
        process.env.JWT_SECRET
      );
      return { token };
    }),
  signup: publicProcedure
    .input(
      z
        .object({
          name: z.string(),
          email: z.string(),
          password: z.string(),
          confirm_password: z.string(),
          phone_number: z.string(),
        })
        .refine((obj) => obj.confirm_password === obj.password)
    )
    .mutation(async ({ input }) => {
      const { password, confirm_password, ...rest } = input;
      const { salt, hash } = createPasswordHash(password);
      const user = await client.user.create({
        data: { ...rest, salt, hash },
      });
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to create user with email ${input.email}`,
        });
      }
      const token = signToken(
        { email: user.email, name: user.name, sub: user.id },
        //@ts-expect-error
        process.env.JWT_SECRET
      );
      return { token };
    }),
});
