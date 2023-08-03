import { prisma } from "~/server/db";

export const getDbRowById = (id: string) => {
  return prisma.imports.findFirst({
    where: {
      id,
    },
  });
};
