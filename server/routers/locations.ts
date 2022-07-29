import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { LocationModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/locations/{id}',
        summary: 'Get Location by ID',
        tags: ['Locations'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: LocationModel,
    resolve: async ({ ctx, input: { id } }) => {
      const location = await ctx.prisma.location.findFirst({
        where: { id },
      });

      if (!location)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Location not found`,
        });

      return location;
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/locations',
        summary: 'Get Location IDs',
        tags: ['Locations'],
        description: `Fields that are filterable \`${['country', 'name']}\``,
      },
    },
    input: z.object({
      limit: z.preprocess(
        (arg) => (typeof arg === 'string' ? parseInt(arg) : arg),
        z.number().max(100).min(1).default(20),
      ),
      cursor: z.string().optional(),
      filters: createFilterZod(['country', 'name'] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      locations: z.string().or(LocationModel).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const locations = await ctx.prisma.location.findMany({
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
      });

      let nextCursor: string | null = null;
      if (locations.length > (limit ?? 15)) {
        const nextItem = locations.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        locations: extend ? locations : locations.map(({ id }) => id),
        nextCursor,
      };
    },
  });
