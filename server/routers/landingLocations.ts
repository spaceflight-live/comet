import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { LandingLocationModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/landing-locations/{id}',
        summary: 'Get LandingLocation by ID',
        tags: ['Landing Locations'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: LandingLocationModel,
    resolve: async ({ ctx, input: { id } }) => {
      const landingLocation = await ctx.prisma.landingLocation.findFirst({
        where: { id },
      });

      if (!landingLocation)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `LandingLocation not found`,
        });

      return landingLocation;
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/landing-locations',
        summary: 'Get LandingLocation IDs',
        tags: ['Landing Locations'],
        description: `Fields that are filterable \`${[
          'name',
          'abbrev',
          'type',
          'location_id',
        ]}\`
        `,
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
        'abbrev',
        'type',
        'location_id',
      ] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      landingLocations: z.string().or(LandingLocationModel).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const landingLocations = await ctx.prisma.landingLocation.findMany({
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
      });

      let nextCursor: string | null = null;
      if (landingLocations.length > (limit ?? 15)) {
        const nextItem = landingLocations.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        landingLocations: extend
          ? landingLocations
          : landingLocations.map(({ id }) => id),
        nextCursor,
      };
    },
  });
