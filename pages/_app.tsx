import '../styles/globals.css';
import '../styles/globals.css';
import { TRPCClientErrorLike } from '@trpc/client';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { httpLink } from '@trpc/client/links/httpLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { splitLink } from '@trpc/client/links/splitLink';
import { withTRPC } from '@trpc/next';
import { Maybe } from '@trpc/server';
import { getDefaultLayout } from 'components/layout';
import { AppProps } from 'next/app';
import { AppRouter } from 'server/router';
import superjson from 'superjson';
import 'tailwindcss/tailwind.css';
import { NextPageWithLayout } from 'types/next-page';

interface Props extends AppProps {
  Component: NextPageWithLayout;
}

const App = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout || getDefaultLayout;
  return getLayout(<Component {...pageProps} />);
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    let url = `/api/trpc`;
    if (typeof window === 'undefined')
      url = `http://localhost:${process.env.PORT ?? 3000}${url}`;

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === 'development' &&
              opts.direction === 'up' &&
              opts.type !== 'subscription') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          condition: ({ context }) => context.skipBatch === true,
          true: httpLink({ url }),
          false: httpBatchLink({ url }),
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 120_000, // 2 minutes
            retry(failureCount, _err) {
              const err = _err as never as Maybe<
                TRPCClientErrorLike<AppRouter>
              >;
              const code = err?.data?.code;
              if (
                code === 'BAD_REQUEST' ||
                code === 'FORBIDDEN' ||
                code === 'UNAUTHORIZED' ||
                code === 'NOT_FOUND'
              )
                return false;
              const MAX_QUERY_RETRIES = 3;
              return failureCount < MAX_QUERY_RETRIES;
            },
          },
        },
      },
      transformer: superjson,
    };
  },
  ssr: true,
})(App);
