import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import _get from "lodash/get";
import { type DesignToken } from "style-dictionary/types/DesignToken";
import { buildTokens } from "~/utils/build-file";
import { getErrorOutput, getTokenOutput } from "~/utils/get-output";
import { getDbRowById } from "~/utils/get-db-row-by-id";
import { removeFiles } from "~/utils/remove-file";
import { TokensSchema } from "~/schemas/server";
import { type Response } from "~/types/server";

export const getToken = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
        tokens: TokensSchema,
      })
    )
    .query(async ({ input }) => {
      if (input.id && input.tokens) {
        console.log("Input", input);
        const buildPath = `sd-build/${input.id}/`;
        const row = await getDbRowById(input.id);
        if (row) {
          const response: Response = {
            id: input.id,
            tokens: [],
          };

          for (const token of input.tokens) {
            const rawToken = _get(
              JSON.parse(row.file),
              token.namespace
            ) as DesignToken;
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
});
