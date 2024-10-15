"use client";
import React from "react";
import { Provider } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Banner } from "@/components/banner";
import { Category } from "@/components/category";
import { Cta } from "@/components/cta";
import { ProductList } from "@/components/productList";
import store from "../store/store";

const Home = () => {
  return (
    <div>
      <Provider store={store}>
        <Banner />
        <Category />
        <ProductList />
        <Cta />
      </Provider>
    </div>
  );
};
export default Home;
