import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';

const Header: FC = () => {
  const router = useRouter();

  return (
    <div className="bg-gray-800 z-10">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-start h-12">
          <div className="flex items-center">
            <Link href="/">🚀 Spaceflight.live</Link>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <div className="flex space-x-4">
              <Link href="/">
                <a
                  className={
                    'hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium ' +
                    (router.pathname === '/' ? 'bg-gray-900' : 'bg-gray-800')
                  }
                >
                  Home
                </a>
              </Link>
              <Link href="/developers">
                <a
                  className={
                    'hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium ' +
                    (router.pathname === '/developers'
                      ? 'bg-gray-900'
                      : 'bg-gray-800')
                  }
                >
                  Developers
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
