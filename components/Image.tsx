import React, { FC, HTMLAttributes } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_CONSTELLATION_SSR_HOST;

const ImageWithBase: FC<
  HTMLAttributes<HTMLDivElement> & { src: string | null }
> = (props) => {
  const host = baseUrl ? baseUrl : 'https://constellation.spaceflight.live';

  return (
    <div
      style={{ backgroundImage: `url(${host}/${props.src})` }}
      {...props}
    ></div>
  );
};

export default ImageWithBase;
