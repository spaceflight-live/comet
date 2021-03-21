import Image from 'next/image';
import Countdown from './countdown';
import LaunchInfo from './launchinfo';

export default function Landing() {
  return (
    <div className="bg-black min-h-screen min-w-screen">
      <Image className="opacity-50 z-0" src="https://constellation.spaceflight.live/soyuz.jpg" alt="" layout="fill" />
      <div className="flex">
        <div className="flex-1 z-10 content-center text-center">
          <LaunchInfo />
        </div>
        <div className="flex-2 z-10 content-center text-center">
          <Countdown />
        </div>
      </div>
    </div>
  );
}
