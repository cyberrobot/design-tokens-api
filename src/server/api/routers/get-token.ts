import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import _get from "lodash/get";
import { type DesignToken } from "style-dictionary/types/DesignToken";
import { buildFile } from "~/utils/build-file";
import { removeFile } from "~/utils/remove-file";
import { getResponse } from "~/utils/get-response";

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
          const objectByNamespace = _get(
            JSON.parse(row.file),
            input.namespace
          ) as DesignToken;
          if (objectByNamespace) {
            const outputDirectory = buildFile({
              token: objectByNamespace,
              id: input.id,
            });
            const response = getResponse({
              path: outputDirectory,
              namespace: input.namespace,
              id: input.id,
            });
            removeFile(outputDirectory);
            return response;
          }

          return JSON.stringify({
            error: `No token for namespace ${input.namespace} was found.`,
          });
        }
      }
      return null;
    }),
});
