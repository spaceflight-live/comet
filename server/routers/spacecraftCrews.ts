import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { SpacecraftCrewModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/spacecraft-crews/{id}',
        summary: 'Get Spacecraft Crew by ID',
        tags: ['Spacecraft Crews'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: SpacecraftCrewModel,
    resolve: async ({ ctx, input: { id } }) => {
      const crew = await ctx.prisma.spacecraftCrew.findFirst({
        where: { id },
      });

      if (!crew)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Spacecraft Crew not found`,
        });

      return crew;
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/spacecraft-crews',
        summary: 'Get Spacecraft Crew IDs',
        tags: ['Spacecraft Crews'],
        description: `Fields that are filterable \`${[
          'name',
          'spacecraft_id',
        ]}\``,
      },
    },
    input: z.object({
      limit: z.preprocess(
        (arg) => (typeof arg === 'string' ? parseInt(arg) : arg),
        z.number().max(100).min(1).default(20),
      ),
      cursor: z.string().optional(),
      filters: createFilterZod(['name', 'spacecraft_id'] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      spacecraftCrews: z.string().or(SpacecraftCrewModel).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const crews = await ctx.prisma.spacecraftCrew.findMany({
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
      });

      let nextCursor: string | null = null;
      if (crews.length > (limit ?? 15)) {
        const nextItem = crews.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        spacecraftCrews: extend ? crews : crews.map(({ id }) => id),
        nextCursor,
      };
    },
  });
