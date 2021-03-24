import { NextPage } from 'next';

type GetLayoutFunc<P = any> = (page: P) => JSX.Element;
export type NextPageWithLayout<T = {}> = NextPage<T> & {
	getLayout: GetLayoutFunc;
};