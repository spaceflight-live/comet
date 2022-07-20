import { createContext } from '@server/context';
import { appRouter } from '@server/router';
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
