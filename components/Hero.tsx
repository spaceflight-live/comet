import { FC } from 'react';
import NextLaunch from './NextLaunch';
import Image from 'next/image';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Dynamic from 'next/dynamic';

const Countdown = Dynamic(() => import('./Countdown'), { ssr: false });

export const UPCOMING_LAUNCHES = gql`
  query getUpcomingLaunches($limit: Int) {
    launches(
      limit: $limit
      orderBy: { field: net, direction: ASC }
      filters: [{ field: net, operation: greaterThan, value: "NOW()" }]
    ) {
      id
      name
      net
      pad {
        id
        name
        location {
          id
          name
        }
      }
      vehicle {
        id
        name
        image_path
      }
    }
  }
`;

const Hero: FC = () => {
  const { error, data, loading } = useQuery(UPCOMING_LAUNCHES, {
    variables: { limit: 1 },
    fetchPolicy: typeof window == 'undefined' ? 'cache-only' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });
  if (loading) return <div></div>;
  if (error) return <p>{error.toString()}</p>;
  const { launches } = data;
  const [hero] = launches;
  if (!hero || !Object.keys(hero).length) return <></>;

  return (
    <div className="bg-black h-full bg-center bg-cover relative">
      <Image
        src={`https://constellation.spaceflight.live/${hero.vehicle.image_path}`}
        layout="fill"
        objectFit="cover"
        className="opacity-50 absolute select-none"
        quality={100}
      />
      <div className="flex h-full">
        <div className="flex-1 flex justify-center items-center flex-col xl:flex-row">
          <NextLaunch data={hero} />
          <Countdown net={hero.net} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
