// import Hero from 'components/Hero';
import { getLayoutWithHero } from 'components/layout';
import { GetServerSideProps } from 'next';

const HomePage = () => {
  // const launches = trpc.useQuery(['']);

  return (
    <div className="w-full">
      {/* {launches.slice(1, launches.length).map((launch: any) => (
        <div className="xl:h-56 h-72" key={launch.id as string}>
          <Hero {...launch} next={false} darker={true} />
        </div>
      ))} */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async function () {
  return {
    props: {},
  };
};

HomePage.getLayout = getLayoutWithHero;
export default HomePage;
