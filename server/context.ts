import prisma from '@lib/prisma';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

type CreateContextOptions = trpcNext.CreateNextContextOptions;

export const createContext = async ({ req, res }: CreateContextOptions) => {
  return {
    prisma,
    req,
    res,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
