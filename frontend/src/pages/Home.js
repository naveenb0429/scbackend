import React from 'react';
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import CarbonCreditsHero from "../components/common/CarbonCreditsHero";
import AlignedWith from "../components/common/AlignedWith";
import ProductOverview from '../components/common/ProductOverview';
import AboutUs from "../components/common/AboutUs";
import OurProduct from "../components/common/OurProduct";
import OurApproach from "../components/common/OurApproach";

const Home = () => {
  return (
    <div className="container max-w-full mx-auto">
      <Header />
      <CarbonCreditsHero />
      <AlignedWith />
      <AboutUs />
      <OurApproach />
      <OurProduct />
      <ProductOverview />
      <Footer />
    </div>
  );
};

export default Home;
