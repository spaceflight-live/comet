import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { LandingModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/landings/{id}',
        summary: 'Get Landing by ID',
        tags: ['Landings'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: LandingModel,
    resolve: async ({ ctx, input: { id } }) => {
      const landing = await ctx.prisma.landing.findFirst({
        where: { id },
      });

      if (!landing)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Landing not found`,
        });

      return landing;
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/landings',
        summary: 'Get Landing IDs',
        tags: ['Landings'],
        description: `Fields that are filterable \`${[
          'attempt',
          'success',
          'launcher_id',
          'location_id',
          'launch_id',
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
        'attempt',
        'success',
        'launcher_id',
        'location_id',
        'launch_id',
      ] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      landings: z.string().or(LandingModel).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const landings = await ctx.prisma.landing.findMany({
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
      });

      let nextCursor: string | null = null;
      if (landings.length > (limit ?? 15)) {
        const nextItem = landings.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        landings: extend ? landings : landings.map(({ id }) => id),
        nextCursor,
      };
    },
  });
