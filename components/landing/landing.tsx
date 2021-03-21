import Image from 'next/image';
import Countdown from './countdown';
import LaunchInfo from './launchinfo';

export default function Landing() {
  return (
    <div
      className="bg-black h-full max-w-screen"
      style={{
        textShadow: '0px 8px 13px rgba(0,0,0,0.2), 0px 18px 23px rgba(0,0,0,0.2)',
      }}
    >
      <Image
        className="opacity-50 z-0"
        src="https://constellation.spaceflight.live/soyuz-blurred.jpg"
        alt=""
        layout="fill"
        draggable="false"
      />

      <div className="flex flex-col h-full">
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
