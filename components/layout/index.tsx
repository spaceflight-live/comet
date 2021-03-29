import React, { Fragment } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';

import Header from './header';
import Footer from './footer';
import Landing from '../Hero';

type WithChildren = { children: React.ReactNode };
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
      </Head>
      <div className="root font-inter text-white">{children}</div>
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

const LayoutWithHero: React.FC<WithChildren> = ({ children }) => {
  return (
    <Fragment>
      <div className="h-screen w-screen flex flex-col">
        <Landing />
        {/* <Header /> */}
      </div>
      <div className="mx-auto container text-black">{children}</div>
      {/* <Footer /> */}
    </Fragment>
  );
};

export const getRootLayout = (page: JSX.Element): JSX.Element => <RootLayout>{page}</RootLayout>;
export const getDefaultLayout = (page: NextPage): JSX.Element => getRootLayout(<Layout>{page}</Layout>);
export const getLayoutWithHero = (page: NextPage): JSX.Element =>
  getRootLayout(<LayoutWithHero>{page}</LayoutWithHero>);
