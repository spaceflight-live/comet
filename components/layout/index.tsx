import React, { Fragment, PropsWithChildren } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import { WithChildren } from 'types/next-page';

import Header from './header';
import Footer from './footer';
import Hero from 'components/Hero';

const RootLayout: React.FC<WithChildren> = ({ children }) => {
  return (
    <Fragment>
      <Head>
        <title>Spaceflight Live</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
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
        <link rel="dns-prefetch" href="https://constellation.spaceflight.live/" />
        <link rel="dns-prefetch" href="https://booster.spaceflight.live/" />
        <link rel="dns-prefetch" href="https://orbiter.spaceflight.live/" />
      </Head>
      <div className="root font-inter text-white">{children}</div>
      <script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "2f789aeb9edb498d8215033226fcd145"}'
      ></script>
    </Fragment>
  );
};

const Layout: React.FC<WithChildren> = ({ children }) => {
  return (
    <Fragment>
      <Header />
      <div className="mx-auto container text-black">{children}</div>
      <Footer />
    </Fragment>
  );
};

const LayoutWithHero: React.FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <Fragment>
      <div className="h-screen flex flex-col">
        <Hero {...children.props?.hero} />
        {children.props?.heroOnly ? <></> : <Header />}
      </div>
      {children.props?.heroOnly ? (
        <></>
      ) : (
        <>
          <div className="mx-auto container text-black">{children}</div>
          <Footer />
        </>
      )}
    </Fragment>
  );
};

export const getRootLayout = (page: JSX.Element): JSX.Element => <RootLayout>{page}</RootLayout>;
export const getDefaultLayout = (page: NextPage): JSX.Element => getRootLayout(<Layout>{page}</Layout>);
export const getLayoutWithHero = (page: NextPage): JSX.Element =>
  getRootLayout(<LayoutWithHero>{page}</LayoutWithHero>);
