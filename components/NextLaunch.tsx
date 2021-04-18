import { FC } from 'react';

type Props = {
  data: any;
  next: boolean;
};

const NextLaunch: FC<Props> = ({ data, next }) => {
  return (
    <div className="text-white m-auto z-10 xl:text-left xl:ml-0 xl:mb-0 mb-6">
      {next && (
        <p className="block font-bold md:text-4xl text-3xl mb-3 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400">
          Next Launch
        </p>
      )}
      <h2 className="md:text-3xl text-2xl font-bold text-shadow">{data.name}</h2>
      <h3 className="md:text-xl text-xl text-shadow">
        {data.vehicle.name} &bull; {data.pad.name}
      </h3>
      <div className="flex text-shadow items-center">
        <svg className="inline mr-1 " xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24">
          <defs>
            <linearGradient x1="25%" y1="0%" x2="0%" y2="50%" id="grad">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <path
            fill="url('#grad')"
            d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"
          />
        </svg>
        <p>{data.pad.location.name}</p>
      </div>
    </div>
  );
};

export default NextLaunch;
