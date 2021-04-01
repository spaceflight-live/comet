import { FC } from 'react';

type Props = {
  data: any;
};

const NextLaunch: FC<Props> = ({ data }) => {
  return (
    <div className="text-left text-white z-10 m-auto">
      <span className="font-bold text-4xl mb-3 block text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400">
        Next Launch
      </span>
      <span className="block text-3xl font-bold text-shadow">{data.name}</span>
      <span className="block text-xl text-shadow">
        {data.vehicle.name} &bull; {data.pad.name}
      </span>
      <div className="block text-shadow">
        <svg
          className="inline from-blue-400 to-green-400"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient x1="50%" y1="92.034%" x2="50%" y2="7.2%" id="a">
              <stop offset="0%" stopColor="currentColor" />
              <stop stopOpacity="0" offset="100%" stopColor="white" />
            </linearGradient>
          </defs>
          <path
            fill="currentColor"
            d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"
          />
        </svg>
        <span>{data.pad.location.name}</span>
      </div>
    </div>
  );
};

export default NextLaunch;
