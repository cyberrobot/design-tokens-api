import { prisma } from "~/server/db";

export const getDbRowById = (id: string) => {
  return prisma.import.findFirst({
    where: {
      id,
    },
  });
};
