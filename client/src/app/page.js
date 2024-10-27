"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Banner } from "@/components/banner";
import { Category } from "@/components/category";
import { Cta } from "@/components/cta";
import { ProductList } from "@/components/productList";
import Header from "@/components/header";
import Footer from "@/components/footer";

const Home = () => {
  return (
    <div>
      <Header/>
        <Banner />
        <Category />
        <ProductList />
        <Cta />
        <Footer/>
    </div>
  );
};
export default Home;
