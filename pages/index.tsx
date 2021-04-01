import { STARTER_QUERY } from 'components/Hero';
import { getLayoutWithHero } from 'components/layout';
import { ApolloWithState, createClient } from 'lib/apollo';
import { useOrbiter } from 'lib/orbiter';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
const HomePage = () => {
  const { listen, unlisten, events } = useOrbiter();
  const [updates, setUpdates] = useState<string>('');

  useEffect(() => () => unlisten(['update.launch.yrqal8CCmm7']), [unlisten]);
  useEffect(() => {
    listen(['update.launch.yrqal8CCmm7']);
    events.on('update.launch.yrqal8CCmm7', (data) => {
      setUpdates(JSON.stringify(data));
    });
  }, []);

  return <h2>Last Update: {updates}</h2>;
};

export const getStaticProps: GetStaticProps = async function () {
  const client = createClient();

  await client.query({
    query: STARTER_QUERY,
  });

  return {
    props: ApolloWithState(client, {
      heroOnly: false,
    }),
    revalidate: 1,
  };
};

HomePage.getLayout = getLayoutWithHero;
export default HomePage;
