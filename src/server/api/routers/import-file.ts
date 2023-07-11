import { z } from "zod";
import { Octokit } from "octokit";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { type FileImport } from "@prisma/client";

export const importRouter = createTRPCRouter({
  file: publicProcedure
    .input(
      z.object({
        file: z.string(),
      })
    )
    .mutation(async ({ input }): Promise<FileImport> => {
      const fileImport = await prisma.fileImport.create({
        data: {
          file: input.file,
        },
      });

      return fileImport;
    }),
  github: publicProcedure
    .input(
      z.object({
        path: z.string(),
      })
    )
    .query(async ({ input }): Promise<FileImport | null> => {
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
        if (response.data && "content" in response.data) {
          const fileImport = await prisma.fileImport.create({
            data: {
              file: Buffer.from(response.data.content, "base64").toString(
                "utf-8"
              ),
            },
          });

          return fileImport;
        }

        return null;
      }
      return null;
    }),
});
