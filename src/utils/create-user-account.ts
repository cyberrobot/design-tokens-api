import { type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/db";

export const createUserAccount = async ({ user }: { user: User }) => {
  const account = await prisma.account.create({
    data: {
      userId: user.id,
      type: "credentials",
      provider: "credentials",
      providerAccountId: user.id,
    },
  });

  if (account) {
    return {
      account,
      message: "User account created",
    };
  } else {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Unable to link account to created user profile",
    });
  }
};
