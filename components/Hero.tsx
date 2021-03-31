import { FC } from 'react';
import NextLaunch from './NextLaunch';
import Image from 'next/image';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Dynamic from 'next/dynamic';

const Countdown = Dynamic(() => import('./Countdown'), { ssr: false });

type Props = {
  name: string;
  net: string;
  vehicle: string;
  image_path: string;
  pad: string;
  location: string;
};

export const STARTER_QUERY = gql`
  query {
    starter {
      name
      net
      vehicle
      image_path
      pad
      location
    }
  }
`;

const Hero: FC<Props> = () => {
  const { error, data, loading } = useQuery(STARTER_QUERY, {
    fetchPolicy: typeof window == 'undefined' ? 'cache-only' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });
  if (loading) return <div></div>;
  if (error) return <p>{error.toString()}</p>;
  const { starter: hero } = data;

  if (!hero || !Object.keys(hero).length) return <></>;

  return (
    <div className="bg-black h-full bg-center bg-cover relative">
      <Image
        src={hero.image_path}
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
