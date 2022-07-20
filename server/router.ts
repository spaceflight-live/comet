import { createRouter } from 'server/createRouter';
import superjson from 'superjson';
import launchesRouter from 'server/routers/launches';

export const appRouter = createRouter().transformer(superjson).merge('launches.', launchesRouter);

export type AppRouter = typeof appRouter;
