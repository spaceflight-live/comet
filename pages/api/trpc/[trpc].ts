import { createContext } from '@server/createContext';
import { appRouter } from '@server/routers/_app';
import { createNextApiHandler } from '@trpc/server/adapters/next';

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR')
      console.error('Something went wrong', error);
  },
  batching: {
    enabled: true,
  },
});
