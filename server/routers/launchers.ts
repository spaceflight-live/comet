import { z } from 'zod';

import { createFilterZod, whereFilter } from '@lib/filters';
import { LauncherModel } from '@lib/zod';

import { createRouter } from '@server/createRouter';
import { TRPCError } from '@trpc/server';

export default createRouter()
  .query('get', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/launchers/{id}',
        summary: 'Get Launcher by ID',
        tags: ['Launchers'],
      },
    },
    input: z.object({
      id: z.string(),
    }),
    output: LauncherModel,
    resolve: async ({ ctx, input: { id } }) => {
      const launcher = await ctx.prisma.launcher.findFirst({
        where: { id },
      });

      if (!launcher)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Launcher not found`,
        });

      return launcher;
    },
  })
  .query('list', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/launchers',
        summary: 'Get Launcher IDs',
        tags: ['Launchers'],
        description: `Fields that are filterable \`${[
          'role',
          'serial_number',
        ]}\``,
      },
    },
    input: z.object({
      limit: z.preprocess(
        (arg) => (typeof arg === 'string' ? parseInt(arg) : arg),
        z.number().max(100).min(1).default(20),
      ),
      cursor: z.string().optional(),
      filters: createFilterZod(['role', 'serial_number'] as const),
      extend: z.preprocess(
        (arg) => String(arg) === 'true',
        z.boolean().default(false),
      ),
    }),
    output: z.object({
      launchers: z.string().or(LauncherModel).array(),
      nextCursor: z.string().nullable(),
    }),
    resolve: async ({ ctx, input: { limit, cursor, filters, extend } }) => {
      const launchers = await ctx.prisma.launcher.findMany({
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereFilter(filters),
      });

      let nextCursor: string | null = null;
      if (launchers.length > (limit ?? 15)) {
        const nextItem = launchers.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        launchers: extend ? launchers : launchers.map(({ id }) => id),
        nextCursor,
      };
    },
  });
