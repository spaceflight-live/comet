import { GetServerSidePropsContext } from 'next';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import prisma from 'utils/prisma';

type CreateContextOptions = trpcNext.CreateNextContextOptions | GetServerSidePropsContext;

export const createContext = async ({ req, res }: CreateContextOptions) => {
  return {
    prisma,
    req,
    res,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
