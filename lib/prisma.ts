import { PrismaClient } from '@prisma/client';

declare const global: typeof globalThis & { prisma?: PrismaClient };

const prisma = global.prisma || new PrismaClient();

if (!global.prisma)
  prisma.$use(async (params, next) => {
    const before = Date.now();

    const result = await next(params);

    const after = Date.now();

    console.log(
      `Query ${params.model}.${params.action}(${JSON.stringify(
        params.args,
      )}) took ${after - before}ms`,
    );

    return result;
  });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
