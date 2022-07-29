import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import {
  AgencyModel,
  LaunchModel,
  PadModel,
  LocationModel,
  SpacecraftModel,
  VehicleModel,
} from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

const LaunchModelExtended = LaunchModel.merge(
  z.object({
    agencies: AgencyModel.nullish(),
    vehicle: VehicleModel.nullish(),
    spacecraft: SpacecraftModel.nullish(),
    pad: PadModel.merge(
      z.object({ location: LocationModel.nullish() }),
    ).nullish(),
  }),
);

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/launches/{id}',
        summary: 'Get Launch by ID',
        tags: ['Launches'],
      },
    },
    input: z.object({
      id: z.string(),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: LaunchModelExtended,
    resolve: async ({ ctx, input: { id, extend } }) => {
      const launch = await ctx.prisma.launch.findFirst({
        include: extend
          ? {
              agencies: true,
              vehicle: true,
              spacecraft: true,
              pad: { include: { location: true } },
            }
          : undefined,
        where: { id },
      });

      if (!launch)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Launch not found`,
        });

      return launch;
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/launches',
        summary: 'Get Launch IDs',
        tags: ['Launches'],
        description: `Fields that are filterable \`${[
          'name',
          'net',
          'status',
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
      filters: createFilterZod(['name', 'net', 'status'] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      launches: z.string().or(LaunchModelExtended).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const launches = await ctx.prisma.launch.findMany({
        include: extend
          ? {
              agencies: true,
              vehicle: true,
              spacecraft: true,
              pad: { include: { location: true } },
            }
          : undefined,
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
        orderBy: { net: 'asc' },
      });

      let nextCursor: string | null = null;
      if (launches.length > (limit ?? 15)) {
        const nextItem = launches.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        launches: extend ? launches : launches.map(({ id }) => id),
        nextCursor,
      };
    },
  });
