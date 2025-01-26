import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import PopularNews from "./PopularNews";
import Recommendations from "./Recommendations";
import Ads from "./Ads";
import Footer from "./Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <PopularNews />
      <Recommendations />
      <Ads />
      <Footer />
    </div>
  );
}
