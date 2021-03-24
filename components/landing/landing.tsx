import Countdown from './countdown';
import NextLaunch from './launchinfo';
import Image from 'next/image';

export default function Landing() {
  return (
    <div className="bg-black h-full max-w-screen bg-center bg-cover relative">
      <Image
        src="https://constellation.spaceflight.live/soyuz-blurred.jpg"
        layout="fill"
        objectFit="cover"
        className="opacity-50 max-w-screen max-h-screen absolute select-none"
        quality={100}
      />
      <div className="flex flex-col h-full">
        <div className="flex-1 flex justify-center items-center">
          <NextLaunch />
          <Countdown />
        </div>
      </div>
    </div>
  );
}
