import { FC } from 'react';

const Countdown: FC = () => {
  return (
    <div className="flex z-10 m-auto">
      <div className="m-5 text-center">
        <span className="font-bold text-6xl">01</span>
        <span className="font-bold text-2xl block">Days</span>
      </div>
      <div className="m-5 text-center">
        <span className="font-bold text-6xl">12</span>
        <span className="font-bold text-2xl block">Hours</span>
      </div>
      <div className="m-5 text-center">
        <span className="font-bold text-6xl">34</span>
        <span className="font-bold text-2xl block">Minutes</span>
      </div>
      <div className="m-5 text-center">
        <span className="font-bold text-6xl">20</span>
        <span className="font-bold text-2xl block">Seconds</span>
      </div>
    </div>
  );
};

export default Countdown;
