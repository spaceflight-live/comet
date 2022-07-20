import { createRouter } from 'server/createRouter';
import { z } from 'zod';

export default createRouter()
  .query('getLaunch', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      return {
        launch: await ctx.prisma.launch.findFirst({
          where: { id },
          include: {
            vehicle: true,
            pad: { include: { location: true } },
          },
        }),
      };
    },
  })
  .query('getUpcoming', {
    input: z.object({
      limit: z.number().max(100).min(1),
      cursor: z.string().nullish(),
    }),
    async resolve({ ctx, input: { limit, cursor } }) {
      const launches = await ctx.prisma.launch.findMany({
        select: { id: true },
        take: (limit ?? 15) + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: { net: { gte: new Date() } },
        orderBy: { net: 'asc' },
      });

      let nextCursor: typeof cursor | null = null;
      if (launches.length > (limit ?? 15)) {
        const nextItem = launches.pop();
        nextCursor = nextItem?.id;
      }

      return {
        launches,
        nextCursor,
      };
    },
  });
