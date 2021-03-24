import Link from 'next/link';
import { FC } from 'react';

const Header: FC = () => {
  return (
    <div className="bg-gray-800">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-12">
          <div className="flex-1 flex items-center justify-start">
            <div className="flex items-center">
              <Link href="/">🚀 Spaceflight.live</Link>
            </div>
            <div className="flex-1 flex items-center justify-end">
              <div className="flex space-x-4">
                <Link href="/about">
                  <a className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
                </Link>
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Developers
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
