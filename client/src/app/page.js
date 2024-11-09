"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Banner } from "@/components/banner";
import { Category } from "@/components/category";
import { Cta } from "@/components/cta";
import { TopSellerList } from "@/components/topSellerProducts";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UspsSection from "@/components/whychooseus";

const Home = () => {
  return (
    <div>
      <Header/>
        <Banner />
        <Category />
        <TopSellerList />
        <Cta />
        <UspsSection />
        <Footer/>
    </div>
  );
};
export default Home;
