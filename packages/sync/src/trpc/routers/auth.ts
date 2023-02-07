import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import client, { Prisma } from "@jjordy/data";

const defaultAuthUserSelect = Prisma.validator<Prisma.UserSelect>()({
  name: true,
  email: true,
  id: true,
  phone_number: true,
});

export const authRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    if (!ctx?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }
    const user = await client.user.findUnique({
      where: { id: ctx?.user?.sub },
      select: defaultAuthUserSelect,
    });
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `No user with id '${ctx?.user?.sub}'`,
      });
    }
    return user;
  }),
});
