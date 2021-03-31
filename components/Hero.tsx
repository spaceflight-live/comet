import Countdown from './Countdown';
import { FC } from 'react';
import NextLaunch from './NextLaunch';
import Image from 'next/image';

type Props = {
  name: string;
  net: string;
  vehicle: string;
  image_path: string;
  pad: string;
  location: string;
};

const Hero: FC<Props> = (hero) => {
  if (!hero) return <></>;

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
