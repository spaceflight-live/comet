import { FC, useEffect, useState } from 'react';

interface FormattedTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function formatTime(time: number): FormattedTime {
  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);

  return {
    days: (String(days).padStart(2, '0') as unknown) as number,
    hours: (String(hours).padStart(2, '0') as unknown) as number,
    minutes: (String(minutes).padStart(2, '0') as unknown) as number,
    seconds: (String(seconds).padStart(2, '0') as unknown) as number,
  };
}

type Props = {
  net: string;
};

const Countdown: FC<Props> = ({ net }) => {
  const [time, setTime] = useState<FormattedTime>(formatTime(new Date(net).getTime() - Date.now()));

  useEffect(() => {
    const formatter = setInterval(() => {
      setTime(formatTime(new Date(net).getTime() - Date.now()));
    }, 1000);

    return () => {
      clearInterval(formatter);
    };
  }, []);

  if (!time) return <></>;

  return (
    <div className="flex z-10 m-auto text-shadow">
      {Object.keys(time).map((key) => (
        <div className="m-5 text-center" key={key}>
          <span className="font-bold text-6xl">{time[key]}</span>
          <span className="font-bold text-2xl block capitalize">{key}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
