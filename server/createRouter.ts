import { OpenApiMeta } from 'trpc-openapi';

import { Context } from '@server/createContext';
import { router } from '@trpc/server';

export function createRouter() {
  return router<Context, OpenApiMeta>();
}
