import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import _get from "lodash/get";
import { type DesignToken } from "style-dictionary/types/DesignToken";
import { buildTokens } from "~/utils/build-file";
import { getErrorOutput, getTokenOutput } from "~/utils/get-output";
import { getDbRowById } from "~/utils/get-db-row-by-id";
import { SaveTokenInputSchema, TokensSchema } from "~/schemas/server";
import { sdBuildFolder } from "~/constants";
import { removeFiles } from "~/utils/remove-file";
import { prisma } from "~/server/db";
import {
  type TransformTokenResponse,
  type SaveTokenResponse,
} from "~/types/server";

export const getTokens = createTRPCRouter({
  transformToken: publicProcedure
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
              removeFiles(buildPath);
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
  getTokens: publicProcedure.query(async () => {
    const rows = await prisma.imports.findMany();
    if (rows) {
      return rows;
    }
    return [];
  }),
  saveToken: publicProcedure
    .input(SaveTokenInputSchema)
    .mutation(({ input }): SaveTokenResponse | null => {
      if (input.token) {
        try {
          const token = input.token;
          prisma.transforms
            .create({
              data: {
                platforms: {
                  create: token.platforms.map((platform) => {
                    return {
                      name: platform.name,
                      formats: {
                        create: platform.formats,
                      },
                    };
                  }),
                },
                version: "0.0.1",
              },
            })
            .then(async (transform) => {
              await prisma.imports.update({
                where: {
                  id: input.id,
                },
                data: {
                  transforms: {
                    connect: {
                      id: transform.id,
                    },
                  },
                },
              });
            })
            .catch((error) => {
              console.error(error);
            });
          return {
            success: true,
          };
        } catch (error) {
          console.error(error);
          return {
            success: false,
          };
        }
      }
      return null;
    }),
  removeToken: publicProcedure
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
