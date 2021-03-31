import { STARTER_QUERY } from 'components/Hero';
import { getLayoutWithHero } from 'components/layout';
import { ApolloWithState, createClient } from 'lib/apollo';
import { GetStaticProps } from 'next';

const HomePage = () => {
  return <></>;
};

export const getStaticProps: GetStaticProps = async function () {
  const client = createClient();

  await client.query({
    query: STARTER_QUERY,
  });

  return {
    props: ApolloWithState(client, {
      heroOnly: true,
    }),
    revalidate: 1,
  };
};

HomePage.getLayout = getLayoutWithHero;
export default HomePage;
