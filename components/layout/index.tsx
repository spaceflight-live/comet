import Head from 'next/head';
import { type FC, Fragment } from 'react';

import type { WithChildren } from '@type/next-page';

import { trpc } from '@lib/trpc';

import Hero from '@components/Hero';
import Footer from '@components/layout/footer';
import Header from '@components/layout/header';

const RootLayout: FC<WithChildren> = ({ children }) => {
  return (
    <Fragment>
      <Head>
        <title>Spaceflight Live</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>"
        />
        <meta
          name="keywords"
          content="Space, Spaceflight, Spaceflight Live, Next Space Flight, Rocket, Rocket Launch, Next Rocket Launch"
        />
        <meta
          name="description"
          content="Spaceflight Live is your home for all things space. They're rocket launches, it's not rocket science."
        />
        <meta name="author" content="Spaceflight Live" />
        <meta name="copyright" content="Spaceflight Live" />
        <meta name="rating" content="General" />
        <meta name="url" content="https://spaceflight.live" />
        <link
          rel="dns-prefetch"
          href="https://constellation.spaceflight.live/"
        />
      </Head>
      <div className="root font-inter text-white h-full w-full flex flex-col">
        {children}
      </div>
      <script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "2f789aeb9edb498d8215033226fcd145"}'
      ></script>
    </Fragment>
  );
};

const Layout: FC<WithChildren> = ({ children }) => {
  return (
    <Fragment>
      <Header />
      {children}
      <Footer />
    </Fragment>
  );
};

const LayoutWithHero: FC<WithChildren> = ({ children }) => {
  const { data } = trpc.useInfiniteQuery([
    'launches.getLaunches',
    { limit: 5, filters: ['net >= NOW()', 'status != TBD'].join(',') },
  ]);

  return (
    <Fragment>
      <div className="min-h-full flex flex-col flex-1">
        {data && data.pages && (
          <Hero
            launchId={data.pages[0].launches[0]}
            darker={false}
            next={true}
          />
        )}
        <Header />
      </div>
      {children}
      <Footer />
    </Fragment>
  );
};

export const getRootLayout = (page: JSX.Element): JSX.Element => (
  <RootLayout>{page}</RootLayout>
);
export const getDefaultLayout = (page: JSX.Element): JSX.Element =>
  getRootLayout(<Layout>{page}</Layout>);

export const getLayoutWithHero = (page: JSX.Element): JSX.Element =>
  getRootLayout(<LayoutWithHero>{page}</LayoutWithHero>);
