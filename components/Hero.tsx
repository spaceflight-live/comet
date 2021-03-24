import Countdown from './countdown';
import { FC } from 'react';
import NextLaunch from './NextLaunch';
import Image from 'next/image';

const Hero: FC = () => {
  return (
    <div className="bg-black h-full max-w-screen bg-center bg-cover relative">
      <Image
        src="https://constellation.spaceflight.live/soyuz-blurred.jpg"
        layout="fill"
        objectFit="cover"
        className="opacity-50 max-w-screen max-h-screen absolute select-none"
        quality={100}
      />
      <div className="flex h-full">
        <div className="flex-1 flex justify-center items-center flex-col xl:flex-row">
          <NextLaunch />
          <Countdown />
        </div>
      </div>
    </div>
  );
};

export default Hero;
