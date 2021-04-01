import { NextPage } from 'next';

export type WithChildren = { children: React.ReactNode };

type GetLayoutFunc<P = any> = (page: P) => JSX.Element;
export type NextPageWithLayout<T = {}> = NextPage<T> & {
  getLayout: GetLayoutFunc;
};
