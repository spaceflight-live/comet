import superjson from 'superjson';

import { createRouter } from '@server/createRouter';
import agenciesRouter from '@server/routers/agencies';
import astronautsRouter from '@server/routers/astronauts';
import landingLocationsRouter from '@server/routers/landingLocations';
import landingsRouter from '@server/routers/landings';
import launchersRouter from '@server/routers/launchers';
import launchesRouter from '@server/routers/launches';
import locationsRouter from '@server/routers/locations';
import notamRouter from '@server/routers/notams';
import padsRouter from '@server/routers/pads';
import spacecraftCrewRouter from '@server/routers/spacecraftCrews';
import spacecraftVehiclesRouter from '@server/routers/spacecraftVehicles';
import spacecraftRouter from '@server/routers/spacecrafts';
import vehiclesRouter from '@server/routers/vehicles';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('agencies.', agenciesRouter)
  .merge('astronauts.', astronautsRouter)
  .merge('landing-locations.', landingLocationsRouter)
  .merge('landings.', landingsRouter)
  .merge('launchers.', launchersRouter)
  .merge('launches.', launchesRouter)
  .merge('locations.', locationsRouter)
  .merge('notams.', notamRouter)
  .merge('pads.', padsRouter)
  .merge('spacecraft-crew.', spacecraftCrewRouter)
  .merge('spacecraft-vehicles.', spacecraftVehiclesRouter)
  .merge('spacecraft.', spacecraftRouter)
  .merge('vehicles.', vehiclesRouter);

export type AppRouter = typeof appRouter;
