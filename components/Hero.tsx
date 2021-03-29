import Countdown from './Countdown';
import { FC, useEffect, useState } from 'react';
import NextLaunch from './NextLaunch';
import Image from 'next/image';

const Hero: FC = () => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    fetch(`https://booster.spaceflight.live/?query=query {starter {name net vehicle image_path pad location}}`)
      .then((data) => data.json())
      .then(({ data }) => setData(data.starter));
  }, []);

  if (!data) return <></>;

  return (
    <div className="bg-black h-full bg-center bg-cover relative">
      <Image
        src={data.image_path}
        layout="fill"
        objectFit="cover"
        className="opacity-50 absolute select-none"
        quality={100}
      />
      <div className="flex h-full">
        <div className="flex-1 flex justify-center items-center flex-col xl:flex-row">
          <NextLaunch data={data} />
          <Countdown net={data.net} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
