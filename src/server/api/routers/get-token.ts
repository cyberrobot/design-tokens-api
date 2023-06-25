import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import _get from "lodash/get";
import { type DesignToken } from "style-dictionary/types/DesignToken";
import { buildFile } from "~/utils/build-file";
import { removeFile } from "~/utils/remove-file";
import { getErrorOutput, getSuccessOutput } from "~/utils/get-output";

type Output = {
  id: string;
  output: string;
};

type Response = {
  id: string;
  output: Output[];
};

export const getToken = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
        namespace: z.array(z.string()),
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
          const response: Response = {
            id: input.id,
            output: [],
          };

          for (const namespace of input.namespace) {
            const objectByNamespace = _get(
              JSON.parse(row.file),
              namespace
            ) as DesignToken;
            if (objectByNamespace) {
              const outputDirectory = buildFile({
                token: objectByNamespace,
                id: input.id,
              });
              const successOutput = getSuccessOutput({
                path: outputDirectory,
                namespace: namespace,
                id: input.id,
              });
              if (successOutput) {
                removeFile(outputDirectory);
                response.output.push(successOutput);
              } else {
                const errorOutput = getErrorOutput({
                  namespace: namespace,
                  id: input.id,
                });
                response.output.push(errorOutput);
              }
            }
          }
          return response;
        }
      }
      return null;
    }),
});
