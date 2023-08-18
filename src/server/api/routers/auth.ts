import { loginSchema } from "~/schemas/auth";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const exists = await ctx.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const hashedPassword = await hash(password);

      const user = await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return {
        user,
        message: "User created",
      };
    }),
});
