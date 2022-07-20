import Link from 'next/link';
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <div className="h-12 mx-auto px-2 sm:px-6 lg:px-8 bg-gray-800 flex-1 flex items-center justify-start">
      <h4>Copyright &copy; 2021-2022 Modest Labs LLC</h4>
      <div className="flex flex-1 justify-end items-center">
        <Link href="https://discord.gg/modest">
          <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Discord
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
