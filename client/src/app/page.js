"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Banner } from "@/components/banner";
import { Category } from "@/components/category";
import { Cta } from "@/components/cta";
import { ProductList } from "@/components/productList";

const Home = () => {
  return (
    <div>
        <Banner />
        <Category />
        <ProductList />
        <Cta />
    </div>
  );
};
export default Home;
