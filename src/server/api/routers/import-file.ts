import { z } from "zod";
import { Octokit } from "octokit";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { type Imports } from "@prisma/client";
import { type ContentsRepoResponseData } from "~/types/client";

export const importRouter = createTRPCRouter({
  file: publicProcedure
    .input(
      z.object({
        file: z.string(),
      })
    )
    .mutation(({ input }): string => {
      return input.file;
    }),
  github: publicProcedure
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
  save: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        file: z.string(),
      })
    )
    .mutation(async ({ input }): Promise<Imports> => {
      const fileImport = await prisma.imports.create({
        data: {
          file: input.file,
          name: input.name,
          description: input.description,
        },
      });

      return fileImport;
    }),
});
