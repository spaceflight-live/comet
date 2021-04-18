import { FC, Fragment, useEffect, useState } from 'react';

interface FormattedTime {
  abs: boolean;
  diff: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

function formatTime(time: number): FormattedTime {
  const abs = time >= 0;
  if (!abs) time = Math.abs(time);

  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);

  return {
    abs,
    diff: {
      days: (String(days).padStart(2, '0') as unknown) as number,
      hours: (String(hours).padStart(2, '0') as unknown) as number,
      minutes: (String(minutes).padStart(2, '0') as unknown) as number,
      seconds: (String(seconds).padStart(2, '0') as unknown) as number,
    },
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
    }, 500);

    return () => {
      clearInterval(formatter);
    };
  }, []);

  if (!time || !time.diff) return <></>;

  return (
    <div className="flex z-10 m-auto text-shadow xl:text-right xl:mr-0">
      <div className="text-center mr-3 opacity-50">
        <span className="font-bold md:text-4xl text-2xl">T{time.abs ? '-' : '+'}</span>
      </div>
      {Object.keys(time.diff).map((key, i) => (
        <Fragment key={key}>
          {i ? (
            <div className="ml-3 mr-3 text-center opacity-50">
              <span className="font-bold md:text-6xl text-4xl">:</span>
            </div>
          ) : (
            <></>
          )}
          <div className="text-center">
            <span className="font-bold md:text-6xl text-4xl tabular-nums">{time.diff[key]}</span>
            <span className="font-bold md:text-2xl block capitalize">{key}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default Countdown;
