import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import _get from "lodash/get";

export const getToken = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
        namespace: z.string(),
        // transform: z.enum(['scss']),
      })
    )
    .query(async ({ input }) => {
      if (input.id && input.namespace) {
        const row = await prisma.fileImport.findFirst({
          where: {
            id: input.id,
          },
        });
        if (row) {
          const objectByNamespace = JSON.stringify(
            _get(JSON.parse(row.file), input.namespace) as Record<
              string,
              unknown
            >
          );

          if (objectByNamespace) {
            return objectByNamespace;
          }

          return JSON.stringify({
            error: `No token for namespace ${input.namespace} was found.`,
          });
        }
      }
      return null;
    }),
});
