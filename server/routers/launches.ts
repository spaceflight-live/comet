import { createRouter } from 'server/createRouter';
import { z } from 'zod';

export default createRouter()
  .query('getLaunch', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
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
    input: z
      .object({
        limit: z.number().max(100).min(1),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.launch.findMany({
        orderBy: { net: 'asc' },
        take: input ? input.limit : 15,
        select: { id: true },
        where: { net: { gte: new Date() } },
      });
    },
  });
