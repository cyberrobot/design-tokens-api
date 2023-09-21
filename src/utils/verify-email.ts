import { type User, type VerificationToken } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/db";

export const verifyEmail = async ({
  token,
}: {
  token: VerificationToken["token"];
}): Promise<User> => {
  const verificationRequestRow = await prisma.verificationToken.findFirst({
    where: {
      token,
    },
  });

  if (!verificationRequestRow) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Verification request not found",
    });
  }

  console.log("verificationRequestRow", verificationRequestRow);

  const user = await prisma.user.update({
    where: {
      email: verificationRequestRow.identifier,
    },
    data: {
      emailVerified: new Date(Date.now()),
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Unable to verify email",
    });
  }

  const deleteVerificationRequest = await prisma.verificationToken.delete({
    where: {
      token: verificationRequestRow.token,
    },
  });

  if (!deleteVerificationRequest) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Unable to delete verification request",
    });
  }

  return {
    ...user,
  };
};
