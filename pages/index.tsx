import { getLayoutWithHero } from 'components/layout';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const HomePage = ({ hero }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <>{JSON.stringify(hero)}</>;
};

export const getServerSideProps: GetServerSideProps = async function () {
  return {
    props: {
      heroOnly: true,
      hero: (
        await fetch(
          `https://booster.spaceflight.live/?query=query {starter {name net vehicle image_path pad location}}`,
        ).then((data) => data.json())
      ).data.starter,
    },
  };
};

HomePage.getLayout = getLayoutWithHero;
export default HomePage;
