import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

import { AppProps } from 'next/app';

import { getDefaultLayout } from 'components/layout';
import { NextPageWithLayout } from 'types/next-page';

import { withTRPC } from '@trpc/next';
import type { AppType } from 'next/dist/shared/lib/utils';
import superjson from 'superjson';
import '../styles/globals.css';
import { AppRouter } from 'server/router';

interface Props extends AppProps {
  Component: NextPageWithLayout;
}

const Comet: AppType = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout || getDefaultLayout;

  return getLayout(<Component {...pageProps} />);
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      links: [],
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60,
            refetchOnWindowFocus: false,
          },
        },
      },
      headers: () => {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            'x-ssr': '1',
          };
        }
        return {};
      },
    };
  },
  ssr: false,
})(Comet);
