// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { storeRouter } from "./stores";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("stores.", storeRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
