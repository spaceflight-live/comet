import { FC } from 'react';
import NextLaunch from './NextLaunch';
import Dynamic from 'next/dynamic';
import { useQuery } from '@apollo/client';
import Image from 'components/Image';
import UPCOMING_LAUNCHES from '../queries/getUpcomingLaunches.graphql';

const Countdown = Dynamic(() => import('./Countdown'), { ssr: false });

const Hero: FC = (hero?: any) => {
  // Load from client-side apollo if SSR hero
  if (!hero.darker) {
    const { error, data, loading } = useQuery<{ launches: Record<string, unknown>[] }>(UPCOMING_LAUNCHES, {
      variables: { limit: 5 },
      fetchPolicy: typeof window == 'undefined' ? 'cache-only' : 'cache-first',
      nextFetchPolicy: 'cache-first',
    });
    if (loading) return <div></div>;
    if (error) return <p>{error.toString()}</p>;

    hero = { ...data.launches[0], next: hero.next };
  }

  if (!hero || !Object.keys(hero).length) return <></>;

  return (
    <div className="bg-black h-full relative flex justify-center items-center">
      <Image
        src={hero.vehicle.image}
        className={`${hero.darker ? 'opacity-20' : 'opacity-50'} absolute select-none h-full w-full bg-center bg-cover`}
      />
      <div className="flex w-full text-white">
        <div className="flex-1 flex justify-center items-center flex-col xl:flex-row container m-auto">
          <NextLaunch data={hero} next={hero.next} />
          <Countdown net={hero.net} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
