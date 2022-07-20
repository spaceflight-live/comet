import { trpc } from '@lib/trpc';
import Hero from 'components/Hero';
import { getLayoutWithHero } from 'components/layout';

const HomePage = () => {
  const { isLoading, data } = trpc.useQuery([
    'launches.getUpcoming',
    { limit: 5 },
  ]);
  if (isLoading || !data) return <></>;

  return (
    <div className="w-full">
      {data.slice(1, data.length).map((launch) => (
        <div className="xl:h-56 h-72" key={launch.id}>
          <span className="absolute">{launch.id}</span>
          <Hero launchId={launch.id} next={false} darker={true} />
        </div>
      ))}
    </div>
  );
};

HomePage.getLayout = getLayoutWithHero;
export default HomePage;
