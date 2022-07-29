import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { NotamModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

const NotamWithCoords = NotamModel.merge(
  z.object({
    coords: z.number().array().length(2).array(),
  }),
);

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/notams/{id}',
        summary: 'Get NOTAM by ID',
        tags: ['NOTAM (Notices to Airmen)'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: NotamWithCoords,
    resolve: async ({ ctx, input: { id } }) => {
      const notam = await ctx.prisma.notam.findFirst({
        where: { id },
      });

      if (!notam)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `NOTAM not found`,
        });

      return { ...notam, coords: notam.coords as [number, number][] };
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/notams',
        summary: 'Get NOTAM IDs',
        tags: ['NOTAM (Notices to Airmen)'],
        description: `Fields that are filterable \`${[
          'notam_id',
          'issued_at',
          'window_open',
          'window_close',
          'altitude_min',
          'altitude_max',
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
        'notam_id',
        'issued_at',
        'window_open',
        'window_close',
        'altitude_min',
        'altitude_max',
      ] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      notams: z.string().or(NotamWithCoords).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const notams = await ctx.prisma.notam.findMany({
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
        orderBy: { issued_at: 'desc' },
      });

      let nextCursor: string | null = null;
      if (notams.length > (limit ?? 15)) {
        const nextItem = notams.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        notams: extend
          ? notams.map((notam) => {
              return {
                ...notam,
                coords: notam.coords as [number, number][],
              };
            })
          : notams.map(({ id }) => id),
        nextCursor,
      };
    },
  });
