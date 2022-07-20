import NextLaunch from './NextLaunch';
import Image from '@components/Image';
import { trpc } from '@lib/trpc';
import { Launch } from '@prisma/client';
import Dynamic from 'next/dynamic';
import { FC } from 'react';

const Countdown = Dynamic(() => import('./Countdown'), { ssr: false });

type Props = {
  launchId: Launch['id'];
  darker: boolean;
  next: boolean;
};

const Hero: FC<Props> = ({ launchId, darker, next }: Props) => {
  const { data, isLoading } = trpc.useQuery([
    'launches.getLaunch',
    { id: launchId },
  ]);

  return !isLoading && data?.launch ? (
    <div className="bg-black h-full relative flex justify-center items-center">
      <Image
        src={data?.launch?.vehicle?.image_path ?? ''}
        className={`${
          darker ? 'opacity-20' : 'opacity-50'
        } absolute select-none h-full w-full bg-center bg-cover`}
      />
      <div className="flex w-full text-white">
        <div className="flex-1 flex justify-center items-center flex-col xl:flex-row container m-auto">
          <NextLaunch launchId={data?.launch?.id} next={next} />
          <Countdown net={data?.launch?.net ?? new Date()} />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Hero;
