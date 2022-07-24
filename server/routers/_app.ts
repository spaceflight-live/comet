import superjson from 'superjson';

import { createRouter } from '@server/createRouter';
import launchesRouter from '@server/routers/launches';
import vehiclesRouter from '@server/routers/vehicles';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('launches.', launchesRouter)
  .merge('vehicles.', vehiclesRouter);

export type AppRouter = typeof appRouter;
