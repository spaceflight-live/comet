import { trpc } from '@lib/trpc';
import Hero from 'components/Hero';
import { getLayoutWithHero } from 'components/layout';
import superjson from 'superjson';

const HomePage = () => {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    status,
    error,
  } = trpc.useInfiniteQuery(['launches.getUpcoming', { limit: 5 }], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (status === 'loading' || status === 'idle') return <></>;
  else if (status === 'error' && error) return <p>{error.message}</p>;
  else if (!data?.pages[0].launches.length) return <></>;

  return (
    <div className="w-full">
      {data?.pages.map((page, pI) =>
        page?.launches.map(
          (launch, lI) =>
            (pI !== 0 || lI !== 0) && (
              <div className="xl:h-56 h-72" key={launch.id}>
                <Hero launchId={launch.id} next={false} darker={true} />
              </div>
            ),
        ),
      )}
      {isFetchingNextPage ? (
        <p className="text-gray-200 hover:bg-gray-800 hover:text-white py-3 text-sm font-medium py-2 bg-gray-700 duration-50 w-full text-center">
          Loading...
        </p>
      ) : hasNextPage ? (
        <button
          className="text-gray-200 hover:bg-gray-800 hover:text-white py-3 text-sm font-medium py-2 bg-gray-700 duration-50 w-full"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          Load More?
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

HomePage.getLayout = getLayoutWithHero;
export default HomePage;
