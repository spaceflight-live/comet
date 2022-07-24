import dynamic from 'next/dynamic';

const API = dynamic(() => import('@components/docs'), {
  ssr: false,
});

export default () => (
  <div className="flex flex-col flex-1 bg-slate-100">
    <API />
  </div>
);
