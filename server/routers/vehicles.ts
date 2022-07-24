import { z } from 'zod';

import { VehicleModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter().query('getVehicle', {
  meta: {
    openapi: {
      enabled: true,
      method: 'GET',
      path: '/vehicles/{id}',
      summary: 'Get Vehicle by ID',
      tag: 'Vehicles',
    },
  },
  input: z.object({
    id: z.string(),
  }),
  output: VehicleModel,
  resolve: async ({ ctx, input: { id } }) => {
    const vehicle = await ctx.prisma.vehicle.findFirst({ where: { id } });

    if (!vehicle)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vehicle not found`,
      });

    return vehicle;
  },
});
