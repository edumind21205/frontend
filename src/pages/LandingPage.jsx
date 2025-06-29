import React from "react";
import Header from "./Header";
import Hero from "../components/Hero";
import Banner from "../components/Banner";
import Category from "../components/Category";
import Cta from "../components/Cta";
import Std from "../components/Std";
import Feature from "../components/Feature";
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <>
      <div
        className="min-h-screen w-full"
       
        
      >
        <Header />
        <Hero />
        <Std />
        <Feature />
        <Category />
        <Banner />
        <Cta />
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
