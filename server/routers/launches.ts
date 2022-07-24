import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { LaunchModel, LocationModel, PadModel, VehicleModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('getLaunch', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/launches/{id}',
        summary: 'Get Launch by ID',
        tag: 'Launches',
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: LaunchModel.extend({
      vehicle: VehicleModel.nullable(),
      pad: PadModel.extend({ location: LocationModel.nullable() }).nullable(),
    }),
    resolve: async ({ ctx, input: { id } }) => {
      const launch = await ctx.prisma.launch.findFirst({
        include: {
          vehicle: true,
          pad: { include: { location: true } },
        },
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
  .query('getLaunches', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/launches',
        summary: 'Get Launch IDs',
        tag: 'Launches',
        description: `
Fields that are filterable \`${['name', 'net', 'status']}\`
        `,
      },
    },
    input: z.object({
      limit: z.preprocess((arg) => {
        if (typeof arg === 'string') return parseInt(arg);
        return arg;
      }, z.number().max(100).min(1).default(20)),
      cursor: z.string().optional(),

      filters: z
        .string()
        .transform((filter) => {
          const filters = filter
            .split(',')
            .map((s) => s.replace(/\s+/g, ' ').trim().split(' '));

          return filters.map(([field, operation, ...value]) =>
            z
              .object({
                field: z.enum(['name', 'net', 'status']),
                operation: z.enum(Operators).optional(),
                value: z
                  .string()
                  .or(z.number())
                  .transform((arg) => {
                    if (typeof arg == 'string' && arg.toUpperCase() == 'NOW()')
                      return new Date();

                    return arg;
                  }),
              })
              .parse({ field, operation, value: value.join(' ') }),
          );
        })
        .optional(),
    }),
    output: z.object({
      launches: z.string().array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters } }) => {
      const launches = (
        await ctx.prisma.launch.findMany({
          select: { id: true },
          take: (limit ?? 15) + 1,
          cursor: cursor ? { id: cursor } : undefined,
          where: Object.assign(
            {},
            ...(filters?.map(({ field, operation, value }) => ({
              [field]: {
                [OperatorPairs[operation as typeof Operators[number]]]: value,
              },
            })) || []),
          ),
          orderBy: { net: 'asc' },
        })
      ).map(({ id }) => id);

      let nextCursor: string | null = null;
      if (launches.length > (limit ?? 15)) {
        const nextItem = launches.pop();
        nextCursor = nextItem || null;
      }

      return {
        launches,
        nextCursor,
      };
    },
  });

const Operators = [
  'contains',
  'endsWith',
  'startsWith',
  '=',
  '==',
  'eq',
  '>',
  'gt',
  '>=',
  'gte',
  '<',
  'lt',
  '<=',
  'lte',
  '!=',
  'not',
] as const;

const OperatorPairs: Record<
  typeof Operators[number],
  keyof Prisma.DateTimeNullableFilter | keyof Prisma.StringFilter
> = {
  contains: 'contains',
  endsWith: 'endsWith',
  startsWith: 'startsWith',
  '=': 'equals',
  '==': 'equals',
  eq: 'equals',
  '>': 'gt',
  gt: 'gt',
  '>=': 'gte',
  gte: 'gte',
  '<': 'lt',
  lt: 'lt',
  '<=': 'lte',
  lte: 'lte',
  '!=': 'not',
  not: 'not',
};
