import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import _get from "lodash/get";
import { type DesignToken } from "style-dictionary/types/DesignToken";
import { buildToken } from "~/utils/build-file";
import { removeFiles } from "~/utils/remove-file";
import { getErrorOutput, getOutput } from "~/utils/get-output";
import { getDbRowById } from "~/utils/get-db-row-by-id";

type Response = {
  id: string;
  output: Output[];
};

export type Output = {
  namespace: string;
  transforms?: Partial<Record<Transform, string>>;
  error?: string;
};

export type Transform = "scss" | "web";

const transforms = ["scss", "web"] as const;

export const getToken = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
        namespaces: z.array(z.string()),
        transforms: z.array(z.enum(transforms)),
      })
    )
    .query(async ({ input }) => {
      if (input.id && input.namespaces) {
        const buildPath = `build/${input.id}/`;
        const row = await getDbRowById(input.id);
        if (row) {
          const response: Response = {
            id: input.id,
            output: [],
          };

          for (const namespace of input.namespaces) {
            const rawToken = _get(
              JSON.parse(row.file),
              namespace
            ) as DesignToken;
            if (rawToken) {
              buildToken({
                token: rawToken,
                id: input.id,
                transforms: input.transforms,
                buildPath,
              });
              const output = getOutput({
                id: input.id,
                transforms: input.transforms,
                buildPath: buildPath,
                namespace,
              });
              response.output.push(output);
              removeFiles(buildPath);
            } else {
              const errorOutput = getErrorOutput({
                namespace: namespace,
                id: input.id,
              });
              response.output.push(errorOutput);
            }
          }
          return response;
        }
      }
      return null;
    }),
});
