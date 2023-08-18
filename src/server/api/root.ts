import { importRouter } from "~/server/api/routers/import-file";
import { createTRPCRouter } from "~/server/api/trpc";
import { getTokens } from "./routers/tokens";
import { getTransforms } from "./routers/transforms";
import { authRouter } from "./routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  import: importRouter,
  tokens: getTokens,
  transforms: getTransforms,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
