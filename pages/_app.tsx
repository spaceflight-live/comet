import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

import App, { AppContext, AppProps } from 'next/app';

import { getDefaultLayout } from 'components/layout';
import { NextPageWithLayout } from 'types/next-page';

interface Props extends AppProps {
  Component: NextPageWithLayout;
}

const Comet = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout || getDefaultLayout;

  return getLayout(<Component {...pageProps} />);
};

Comet.getInitialProps = async (ctx: AppContext) => ({
  ...(await App.getInitialProps(ctx)),
});

export default Comet;
