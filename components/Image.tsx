import React from 'react';
import Image from 'next/image';

const baseUrl = process.env.NEXT_PUBLIC_CONSTELLATION_SSR_HOST;

const ImageWithBase: typeof Image = (props) => {
  const host = baseUrl ? baseUrl : 'https://constellation.spaceflight.live';

  return <Image {...props} src={`${host}/${props.src}`} />;
};

export default ImageWithBase;
