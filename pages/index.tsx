import { useQuery } from '@apollo/client';
import { UPCOMING_LAUNCHES } from 'components/Hero';
import { getLayoutWithHero } from 'components/layout';
import { ApolloWithState, createClient } from 'lib/apollo';
import { useOrbiter } from 'lib/orbiter';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
const HomePage = () => {
  const { listen, unlisten, events } = useOrbiter();
  const [updates, setUpdates] = useState<string>('');

  const { error, data, loading } = useQuery(UPCOMING_LAUNCHES, {
    variables: { limit: 1 },
    fetchPolicy: typeof window == 'undefined' ? 'cache-only' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });
  if (loading) return <div></div>;
  if (error) return <p>{error.toString()}</p>;

  useEffect(() => () => unlisten([`update.launch.${data.launches[0].id}`]), [unlisten]);
  useEffect(() => {
    listen([`update.launch.${data.launches[0].id}`]);
    events.on(`update.launch.${data.launches[0].id}`, (data) => {
      setUpdates(JSON.stringify(data));
    });
  }, []);

  return <h2>Last Update: {updates}</h2>;
};

export const getStaticProps: GetStaticProps = async function () {
  const client = createClient();

  await client.query({
    query: UPCOMING_LAUNCHES,
    variables: { limit: 1 },
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
