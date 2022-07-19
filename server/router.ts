import * as trpc from '@trpc/server';
import { Context } from 'server/context';

export const appRouter = trpc.router<Context>();

export type AppRouter = typeof appRouter;
