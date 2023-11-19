import { z } from "zod";
import { Octokit } from "octokit";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { type Imports } from "@prisma/client";
import { type ContentsRepoResponseData } from "~/types/client";
import { ImportTokenSchema } from "~/schemas/server";

export const importRouter = createTRPCRouter({
  file: protectedProcedure
    .input(
      z.object({
        file: z.string(),
      })
    )
    .mutation(({ input }): string => {
      return input.file;
    }),
  github: protectedProcedure
    .input(
      z.object({
        path: z.string(),
      })
    )
    .mutation(async ({ input }): Promise<ContentsRepoResponseData | null> => {
      const { path } = input;
      const [repo, ...rest] = path.split("/");
      if (repo && rest) {
        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const response = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          {
            owner: process.env.GITHUB_OWNER || "",
            repo,
            path: rest.join("/"),
          }
        );
        if (response) {
          return response.data;
        }

        return null;
      }
      return null;
    }),
  save: protectedProcedure
    .input(ImportTokenSchema)
    .mutation(async ({ input, ctx }): Promise<Imports> => {
      const fileImport = await prisma.imports.create({
        data: {
          file: input.file,
          name: input.name,
          description: input.description,
          userId: ctx.session?.user.id,
        },
      });

      return fileImport;
    }),
});
