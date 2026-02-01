import {
  BestSeller,
  Categories,
  MainBanner,
  BottomBanner,
  NewsLetter,
  Footer,
} from "../components/index";

const Home = () => {
  return (
    <div className="mt-10">
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
      <NewsLetter />
    </div>
  );
};

export default Home;
