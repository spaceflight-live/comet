import Link from 'next/link';
import { FC } from 'react';
import { print } from 'graphql/language/printer';

import UPCOMING_LAUNCHES from '../../queries/getUpcomingLaunches.graphql';

const Header: FC = () => {
  return (
    <div className="bg-gray-800 z-10">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-start h-12">
          <div className="flex items-center">
            <Link href="/">🚀 Spaceflight.live</Link>
          </div>
          <Link href="https://spaceflight.live/discord">
            <a className="ml-5 hover:underline">Join our Discord</a>
          </Link>
          <div className="flex-1 flex items-center justify-end">
            <div className="flex space-x-4">
              <Link href="/">
                <a className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
              </Link>
              <a
                href={`https://booster.spaceflight.live?query=${encodeURIComponent(print(UPCOMING_LAUNCHES))}`}
                target="_blank"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Developers
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
