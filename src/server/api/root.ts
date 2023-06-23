import { importRouter } from "~/server/api/routers/import-file";
import { createTRPCRouter } from "~/server/api/trpc";
import { getToken } from "./routers/get-token";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  import: importRouter,
  token: getToken,
});

// export type definition of API
export type AppRouter = typeof appRouter;
