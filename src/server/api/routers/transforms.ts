import prisma from "client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { type TImportTransform } from "~/types/server";

export const getTransforms = createTRPCRouter({
  getTransforms: publicProcedure
    .input(
      z.object({
        importId: z.string(),
        count: z.number().optional(),
      })
    )
    .query(async ({ input }): Promise<TImportTransform[]> => {
      const rows = await prisma.transforms.findMany({
        ...(input.count && { take: input.count }),
        where: {
          importsId: input.importId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          platforms: {
            include: {
              formats: true,
            },
          },
        },
      });
      if (rows) {
        return rows;
      }
      return [];
    }),
});
