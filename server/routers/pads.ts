import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { PadModel, LocationModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/pads/{id}',
        summary: 'Get Pad by ID',
        tags: ['Pad'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: PadModel.merge(
      z.object({
        location: LocationModel.nullable(),
      }),
    ),
    resolve: async ({ ctx, input: { id } }) => {
      const pad = await ctx.prisma.pad.findFirst({
        include: { location: true },
        where: { id },
      });

      if (!pad)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Pad not found`,
        });

      return pad;
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/pads',
        summary: 'Get Pad IDs',
        tags: ['Pad'],
        description: `Fields that are filterable \`${['name', 'agency_id']}\``,
      },
    },
    input: z.object({
      limit: z.preprocess(
        (arg) => (typeof arg === 'string' ? parseInt(arg) : arg),
        z.number().max(100).min(1).default(20),
      ),
      cursor: z.string().optional(),
      filters: createFilterZod(['name', 'agency_id'] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      pads: z
        .string()
        .or(
          PadModel.merge(
            z.object({
              location: LocationModel.optional(),
            }),
          ),
        )
        .array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const pads = await ctx.prisma.pad.findMany({
        include: extend ? { location: true } : undefined,
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
      });

      let nextCursor: string | null = null;
      if (pads.length > (limit ?? 15)) {
        const nextItem = pads.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        pads: extend ? pads : pads.map(({ id }) => id),
        nextCursor,
      };
    },
  });
