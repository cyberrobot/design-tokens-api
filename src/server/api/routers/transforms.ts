import prisma from "client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import {
  type TTransformRemoveResponse,
  type TImportTransform,
  type SaveTokenResponse,
} from "~/types/server";
import { SaveTokenInputSchema } from "~/schemas/server";
import { getRemoteUrlForFormat } from "~/utils/get-remote-url-for-format";

export const getTransforms = createTRPCRouter({
  getTransforms: protectedProcedure
    .input(
      z.object({
        importId: z.string(),
        count: z.number().optional(),
      })
    )
    .query(async ({ input }): Promise<TImportTransform[]> => {
      const rows = await prisma.transforms.findMany({
        ...(input.count && { take: input.count }),
        where: {
          importsId: input.importId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          platforms: {
            include: {
              formats: true,
            },
          },
        },
      });
      if (rows) {
        return rows;
      }
      return [];
    }),
  saveTransform: protectedProcedure
    .input(SaveTokenInputSchema)
    .mutation(async ({ input }): Promise<SaveTokenResponse | null> => {
      if (input.token) {
        try {
          const token = input.token;
          const transform = await prisma.transforms.create({
            data: {},
          });
          await prisma.transforms
            .update({
              where: {
                id: transform.id,
              },
              data: {
                platforms: {
                  create: await Promise.all(
                    token.platforms.map(async (platform) => {
                      return {
                        name: platform.name,
                        formats: {
                          create: await Promise.all(
                            platform.formats.map(async (format) => {
                              const url = await getRemoteUrlForFormat({
                                id: input.id,
                                version: transform.id,
                                format,
                              });
                              return {
                                ...format,
                                url,
                              } as typeof format;
                            })
                          ),
                        },
                      };
                    })
                  ),
                },
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
            transformId: transform.id,
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
  removeTransform: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }): Promise<TTransformRemoveResponse> => {
      try {
        await prisma.transforms.delete({
          where: {
            id: input.id,
          },
        });

        return { success: true };
      } catch (e) {
        return { success: false };
      }
    }),
});
