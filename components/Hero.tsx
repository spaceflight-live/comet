import { FC } from 'react';
import NextLaunch from './NextLaunch';
import Image from 'next/image';
import Dynamic from 'next/dynamic';

const Countdown = Dynamic(() => import('./Countdown'), { ssr: false });

const Hero: FC = (hero?: any) => {
  if (!hero || !Object.keys(hero).length) return <></>;

  return (
    <div className="bg-black h-full bg-center bg-cover relative flex justify-center items-center">
      <Image
        src={`https://constellation.spaceflight.live/${hero.vehicle.image_path}`}
        layout="fill"
        objectFit="cover"
        className={`${hero.darker ? 'opacity-20' : 'opacity-50'} absolute select-none`}
        quality={100}
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
