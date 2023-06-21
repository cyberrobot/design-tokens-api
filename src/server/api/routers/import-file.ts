import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { type FileImport, type Prisma } from "@prisma/client";

export const importRouter = createTRPCRouter({
  file: publicProcedure
    .input(
      z.object({
        file: z.string(),
      })
    )
    .mutation(async ({ input }): Promise<FileImport> => {
      const importObj: Prisma.FileImportCreateInput = {
        file: input.file,
      };
      const fileImport = await prisma.fileImport.create({
        data: importObj,
      });

      return fileImport;
    }),
});
