import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { SpacecraftModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/spacecrafts/{id}',
        summary: 'Get Spacecraft by ID',
        tags: ['Spacecrafts'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: SpacecraftModel,
    resolve: async ({ ctx, input: { id } }) => {
      const spacecraft = await ctx.prisma.spacecraft.findFirst({
        where: { id },
      });

      if (!spacecraft)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Spacecraft not found`,
        });

      return spacecraft;
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/spacecrafts',
        summary: 'Get Spacecraft IDs',
        tags: ['Spacecrafts'],
        description: `Fields that are filterable \`${[
          'name',
          'serial_number',
          'status',
          'vehicle_id',
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
        'serial_number',
        'status',
        'vehicle_id',
      ] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      spacecrafts: z.string().or(SpacecraftModel).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const spacecrafts = await ctx.prisma.spacecraft.findMany({
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
        spacecrafts: extend ? spacecrafts : spacecrafts.map(({ id }) => id),
        nextCursor,
      };
    },
  });
