import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { SpacecraftVehicleModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/spacecraft-vehicles/{id}',
        summary: 'Get Spacecraft Vehicle by ID',
        tags: ['Spacecraft Vehicles'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: SpacecraftVehicleModel,
    resolve: async ({ ctx, input: { id } }) => {
      const spacecraft = await ctx.prisma.spacecraftVehicle.findFirst({
        where: { id },
      });

      if (!spacecraft)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Spacecraft Vehicle not found`,
        });

      return spacecraft;
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/spacecraft-vehicles',
        summary: 'Get Spacecraft Vehicle IDs',
        tags: ['Spacecraft Vehicles'],
        description: `Fields that are filterable \`${[
          'name',
          'agency',
          'human_rated',
          'role',
        ]}\``,
      },
    },
    input: z.object({
      limit: z.preprocess(
        (arg) => (typeof arg === 'string' ? parseInt(arg) : arg),
        z.number().max(100).min(1).default(20),
      ),
      cursor: z.string().optional(),
      filters: createFilterZod([
        'name',
        'agency',
        'human_rated',
        'role',
      ] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      spacecraftVehicles: z.string().or(SpacecraftVehicleModel).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const spacecrafts = await ctx.prisma.spacecraftVehicle.findMany({
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
      });

      let nextCursor: string | null = null;
      if (spacecrafts.length > (limit ?? 15)) {
        const nextItem = spacecrafts.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        spacecraftVehicles: extend
          ? spacecrafts
          : spacecrafts.map(({ id }) => id),
        nextCursor,
      };
    },
  });
