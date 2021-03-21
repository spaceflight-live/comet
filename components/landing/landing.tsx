import Image from 'next/image';
import Countdown from './countdown';
import LaunchInfo from './launchinfo';

export default function Landing() {
  return (
    <div className="bg-black min-h-screen min-w-screen ">
      <Image
        className="opacity-50 z-0"
        src="https://constellation.spaceflight.live/soyuz-blurred.jpg"
        alt=""
        layout="fill"
      />
      <div className="flex flex-col min-h-screen">
        <div className="flex-1" />
        <div className="flex">
          <div className="z-10 m-auto">
            <LaunchInfo />
          </div>
          <div className="z-10 m-auto">
            <Countdown />
          </div>
        </div>
        <div className="flex-1" />
      </div>
    </div>
  );
}
