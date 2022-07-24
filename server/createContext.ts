import { GetServerSidePropsContext } from 'next';

import prisma from '@lib/prisma';

import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

type CreateContextOptions =
  | CreateNextContextOptions
  | GetServerSidePropsContext;

export const createContext = async ({ req, res }: CreateContextOptions) => {
  return {
    prisma,
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
