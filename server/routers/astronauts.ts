import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { AstronautModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/astronauts/{id}',
        summary: 'Get Astronaut by ID',
        tags: ['Astronauts'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: AstronautModel.merge(
      z.object({
        socials: z.record(z.string(), z.string()),
      }),
    ),
    resolve: async ({ ctx, input: { id } }) => {
      const astronaut = await ctx.prisma.astronaut.findFirst({
        where: { id },
      });

      if (!astronaut)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Astronaut not found`,
        });

      return {
        ...astronaut,
        // Thanks you Prisma.JsonValue......
        socials: astronaut.socials as Record<string, string>,
      };
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/astronauts',
        summary: 'Get Astronaut IDs',
        tags: ['Astronauts'],
        description: `Fields that are filterable \`${[
          'name',
          'type',
          'status',
          'agency_id',
          'dob',
          'dod',
          'nationality',
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
        'type',
        'status',
        'agency_id',
        'dob',
        'dod',
        'nationality',
      ] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      astronauts: z.string().or(AstronautModel).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const astronauts = await ctx.prisma.astronaut.findMany({
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
        orderBy: { dob: 'asc' },
      });

      let nextCursor: string | null = null;
      if (astronauts.length > (limit ?? 15)) {
        const nextItem = astronauts.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        astronauts: extend
          ? astronauts.map((astronaut) => {
              return {
                ...astronaut,
                socials: astronaut.socials as Record<string, string>,
              };
            })
          : astronauts.map(({ id }) => id),
        nextCursor,
      };
    },
  });
