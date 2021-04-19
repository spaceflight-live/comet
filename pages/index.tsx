import { useQuery } from '@apollo/client';
import Hero from 'components/Hero';
import { getLayoutWithHero } from 'components/layout';
import { ApolloWithState, cache, createClient } from 'lib/apollo';
import { useOrbiter } from 'lib/orbiter';
import { GetStaticProps } from 'next';
import { useEffect } from 'react';

import UPCOMING_LAUNCHES from '../queries/getUpcomingLaunches.graphql';

const HomePage = () => {
  const { listen, unlisten, events } = useOrbiter();

  const { error, data, loading } = useQuery<{ launches: Record<string, unknown>[] }>(UPCOMING_LAUNCHES, {
    variables: { limit: 5 },
    fetchPolicy: typeof window == 'undefined' ? 'cache-only' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });
  if (loading) return <div></div>;
  if (error) return <p>{error.toString()}</p>;
  const { launches } = data;

  const topics = launches.map(({ id }) => `update.launch.${id}`);

  useEffect(() => () => unlisten(topics), [unlisten]);
  useEffect(() => {
    listen(topics);
    topics.map((topic) =>
      events.on(topic, (data) => {
        delete data.last_updated;
        cache.modify({
          id: cache.identify(launches.find(({ id }) => id == topic.substr(topic.length - 11, 11))),
          fields: Object.assign(
            {},
            ...Object.keys(data).map((key) => {
              return {
                [key]() {
                  return data[key];
                },
              };
            }),
          ),
          broadcast: true,
        });
      }),
    );
  }, []);

  return (
    <div className="w-full">
      {launches.slice(1, launches.length).map((launch: any) => (
        <div className="xl:h-56 h-72" key={launch.id as string}>
          <Hero {...launch} next={false} darker={true} />
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async function () {
  const client = createClient();

  const { data } = await client.query({
    query: UPCOMING_LAUNCHES,
    variables: { limit: 5 },
  });

  return {
    props: ApolloWithState(client, {
      heroOnly: data.launches.length <= 1,
      hero: data.launches[0],
    }),
    revalidate: 1,
  };
};

HomePage.getLayout = getLayoutWithHero;
export default HomePage;
