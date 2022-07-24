import Link from 'next/link';
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <div className="h-12 sm:p-6  bg-gray-800 flex items-center justify-start">
      <h4>Copyright &copy; 2021-2022 Modest Labs LLC</h4>
      <div className="flex flex-1 justify-end items-center">
        <Link href="https://discord.gg/modest">
          <a className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">
            Discord
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
