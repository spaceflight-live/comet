import { FC } from 'react';
import Link from 'next/link';

const Footer: FC = () => {
  return (
    <div className="h-12 mx-auto px-2 sm:px-6 lg:px-8 bg-gray-800 flex-1 flex items-center justify-start">
      <h4>&copy; 2021 Spaceflight.live</h4>
      <div className="flex flex-1 justify-end items-center">
        <Link href="https://spaceflight.live/discord">
          <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Discord
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
