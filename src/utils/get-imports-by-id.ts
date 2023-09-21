import { type User } from "next-auth";
import { prisma } from "~/server/db";

export const getImportsById = ({
  id,
  userId,
}: {
  id: string;
  userId?: User["id"];
}) => {
  return prisma.imports.findMany({
    where: {
      ...(userId && { userId }),
      id,
    },
  });
};
