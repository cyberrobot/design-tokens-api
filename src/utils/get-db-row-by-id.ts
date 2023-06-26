import { prisma } from "~/server/db";

export const getDbRowById = (id: string) => {
  return prisma.fileImport.findFirst({
    where: {
      id,
    },
  });
};
