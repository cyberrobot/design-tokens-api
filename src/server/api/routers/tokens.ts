import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import _get from "lodash/get";
import { type DesignToken } from "style-dictionary/types/DesignToken";
import { buildTokens } from "~/utils/build-file";
import { getErrorOutput, getTokenOutput } from "~/utils/get-output";
import { getDbRowById } from "~/utils/get-db-row-by-id";
import { TokensSchema } from "~/schemas/server";
import { sdBuildFolder } from "~/constants";
import { prisma } from "~/server/db";
import { type TransformTokenResponse } from "~/types/server";

export const getTokens = createTRPCRouter({
  transformImport: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        tokens: TokensSchema,
      })
    )
    .mutation(async ({ input }) => {
      if (input.id && input.tokens) {
        const buildPath = `${sdBuildFolder}${input.id}/`;
        const row = await getDbRowById(input.id);
        if (row) {
          const response: TransformTokenResponse = {
            id: input.id,
            tokens: [],
          };

          for (const token of input.tokens) {
            const rawToken = token.namespace
              ? (_get(JSON.parse(row.file), token.namespace) as DesignToken)
              : (JSON.parse(row.file) as DesignToken);
            if (rawToken) {
              buildTokens({
                token: rawToken,
                platforms: token.platforms,
                buildPath,
              });
              const output = getTokenOutput({
                token,
                buildPath: buildPath,
              });
              response.tokens.push(output);
            } else {
              const errorOutput = getErrorOutput({
                namespace: token.namespace,
              });
              response.tokens.push(errorOutput);
            }
          }
          return response;
        }
      }
      // TODO: Add input validation for non-tRPC requests
      return null;
    }),
  getImports: protectedProcedure.query(async ({ ctx }) => {
    const rows = await prisma.imports.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
    });
    if (rows) {
      return rows;
    }
    return [];
  }),

  removeImport: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.id) {
        try {
          await prisma.imports.delete({
            where: {
              id: input.id,
            },
          });
        } catch (error) {
          console.error(error);
        }
      }
    }),
});
