import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { VehicleModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/vehicles/{id}',
        summary: 'Get Vehicle by ID',
        tags: ['Vehicles'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: VehicleModel,
    resolve: async ({ ctx, input: { id } }) => {
      const vehicle = await ctx.prisma.vehicle.findFirst({
        where: { id },
      });

      if (!vehicle)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Vehicle not found`,
        });

      return vehicle;
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/vehicles',
        summary: 'Get Vehicle IDs',
        tags: ['Vehicles'],
        description: `Fields that are filterable \`${['name']}\`
        `,
      },
    },
    input: z.object({
      limit: z.preprocess(
        (arg) => (typeof arg === 'string' ? parseInt(arg) : arg),
        z.number().max(100).min(1).default(20),
      ),
      cursor: z.string().optional(),
      filters: createFilterZod(['name'] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      vehicle: z.string().or(VehicleModel).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const vehicle = await ctx.prisma.vehicle.findMany({
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
      });

      let nextCursor: string | null = null;
      if (vehicle.length > (limit ?? 15)) {
        const nextItem = vehicle.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        vehicle: extend ? vehicle : vehicle.map(({ id }) => id),
        nextCursor,
      };
    },
  });
