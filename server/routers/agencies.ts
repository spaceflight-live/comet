import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { AgencyModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/agencies/{id}',
        summary: 'Get Agency by ID',
        tags: ['Agencies'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: AgencyModel,
    resolve: async ({ ctx, input: { id } }) => {
      const agency = await ctx.prisma.agency.findFirst({
        where: { id },
      });

      if (!agency)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Agency not found`,
        });

      return agency;
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/agencies',
        summary: 'Get Agency IDs',
        tags: ['Agencies'],
        description: `Fields that are filterable \`${[
          'name',
          'type',
          'countries',
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
      filters: createFilterZod(['name', 'type', 'countries'] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      agencies: z.string().or(AgencyModel).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const agencies = await ctx.prisma.agency.findMany({
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
        orderBy: { founded: 'desc' },
      });

      let nextCursor: string | null = null;
      if (agencies.length > (limit ?? 15)) {
        const nextItem = agencies.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        agencies: extend ? agencies : agencies.map(({ id }) => id),
        nextCursor,
      };
    },
  });
