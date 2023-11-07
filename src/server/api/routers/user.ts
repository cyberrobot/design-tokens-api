import { passwordResetSchema, userDetailsSchema } from "~/schemas/auth";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { hash, verify } from "argon2";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(userDetailsSchema)
    .mutation(async ({ ctx, input }) => {
      const userRecord = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user.id,
        },
      });

      if (userRecord?.email === input.email) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email is the same as before",
        });
      }

      const userToUpdate = await ctx.prisma.user.update({
        where: {
          id: ctx.session?.user.id,
        },
        data: {
          ...input,
        },
      });

      if (userToUpdate) {
        return {
          ...userToUpdate,
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
  updatePassword: protectedProcedure
    .input(passwordResetSchema)
    .mutation(async ({ ctx, input }) => {
      const { password, newPassword } = input;

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session?.user.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User not found",
        });
      }

      const passwordValid = await verify(user.password, password);

      if (!passwordValid) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Password is incorrect",
        });
      }

      const hashedPassword = await hash(newPassword);

      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: ctx.session?.user.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      if (updatedUser) {
        return {
          ...updatedUser,
        };
      }

      return null;
    }),
});
