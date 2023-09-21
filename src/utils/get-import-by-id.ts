import { type User } from "next-auth";
import { prisma } from "~/server/db";

export const getImportById = ({
  id,
  userId,
}: {
  id: string;
  userId?: User["id"];
}) => {
  return prisma.imports.findFirst({
    where: {
      ...(userId && { userId }),
      id,
    },
  });
};
