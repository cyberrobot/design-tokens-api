import { signUpSchema } from "~/schemas/auth";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type User } from "@prisma/client";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(signUpSchema.optional())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session?.user.id,
        },
        data: {
          ...input,
        },
      });

      if (user) {
        return {
          ...user,
        };
      }

      return null;
    }),
  get: protectedProcedure.query(async ({ ctx }): Promise<User | null> => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session?.user.id,
      },
    });

    if (user) {
      return {
        ...user,
      };
    }

    return null;
  }),
});
