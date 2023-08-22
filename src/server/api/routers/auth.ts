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

      if (!user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Unable to create user account",
        });
      }

      const account = await ctx.prisma.account.create({
        data: {
          userId: user.id,
          type: "credentials",
          provider: "credentials",
          providerAccountId: user.id,
        },
      });

      if (user && account) {
        return {
          user,
          message: "User created",
        };
      } else {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Unable to link account to created user profile",
        });
      }
    }),
});
