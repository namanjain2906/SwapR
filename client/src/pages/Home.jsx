import CategoriesSection from "../components/CategoriesSection";
import HeroSection from "../components/HeroSection";
import FlowchartSection from "../components/FlowchartSection";
import BlurCircle from "../components/BlurCircle";

const Home = () => {
  return (
    <div >
      <BlurCircle top="-30px" right="-50px"/>
      <BlurCircle top="500px" left="150px"/>
      <BlurCircle top="1000px" right="-50px"/>
      <BlurCircle top="1400px" left="-50px"/>
      <HeroSection/>
      <CategoriesSection/>
      <FlowchartSection/>
    </div>
  );
};

export default Home;
