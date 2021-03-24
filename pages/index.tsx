import { getLayoutWithHero } from 'components/layout';

const HomePage = () => {
  return new Array(100).fill('space').map((s, i) => (
    <p key={i}>
      {s}-{i}
    </p>
  ));
};

HomePage.getLayout = getLayoutWithHero;
export default HomePage;
