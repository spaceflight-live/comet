import * as trpc from '@trpc/server';
import { Context } from 'server/context';

export const createRouter = trpc.router<Context>;
