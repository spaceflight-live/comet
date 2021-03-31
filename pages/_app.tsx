import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

import App, { AppContext, AppProps } from 'next/app';

import { getDefaultLayout } from 'components/layout';
import { NextPageWithLayout } from 'types/next-page';
import { useApollo } from 'lib/apollo';
import { ApolloProvider } from '@apollo/client';

interface Props extends AppProps {
  Component: NextPageWithLayout;
}

const Comet = ({ Component, pageProps }: Props) => {
  const client = useApollo(pageProps);
  const getLayout = Component.getLayout || getDefaultLayout;

  return <ApolloProvider client={client}>{getLayout(<Component {...pageProps} />)}</ApolloProvider>;
};

Comet.getInitialProps = async (ctx: AppContext) => ({
  ...(await App.getInitialProps(ctx)),
});

export default Comet;
