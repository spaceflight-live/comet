import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';
import merge from 'deepmerge';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';
let client: ApolloClient<NormalizedCacheObject> | undefined;
export const cache = new InMemoryCache();

function initClient(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createHttpLink({
      uri:
        typeof window === 'undefined' && process.env.BOOSTER_SSR_HOST
          ? process.env.BOOSTER_SSR_HOST
          : 'https://booster.spaceflight.live',
      credentials: 'same-origin',
    }),
    ssrForceFetchDelay: 1,
    queryDeduplication: true,
    cache,
  });
}

export function createClient(state: any = null): ApolloClient<NormalizedCacheObject> {
  const _client = client ?? initClient();

  if (state) {
    const cache = _client.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(state, cache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) => sourceArray.every((s) => d != s)),
      ],
    });

    // Restore the cache with the merged data
    _client.cache.restore(data);
  }
  if (typeof window === 'undefined') return _client;
  if (!client) client = _client;

  return client;
}

export function ApolloWithState(client: ApolloClient<NormalizedCacheObject>, pageProps: any) {
  if (pageProps?.props) pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  else pageProps[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  return pageProps;
}

export function useApollo(pageProps: { [key: string]: any }) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => createClient(state), [state]);
  return store;
}
