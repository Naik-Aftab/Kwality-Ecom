"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link"; 

export const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`);
        setCategories(response.data);
        // console.log("Category data:", response.data);
      } catch (error) {
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <h2 className="text-2xl text-red-500">{error}</h2>
      </div>
    );
  }


  return (
    <div className="container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-center p-4">
  {categories.map((category) => (
    <Link key={category._id} href={`/categories/${category._id}`} passHref>
      <div
        className="max-w-sm mx-auto mb-5 p-4 shadow-lg rounded-lg transition-transform transform hover:scale-105"
      >
        <div className="flex justify-center mb-2">
          <img
            src={`${category.image}`}
            alt={category.name}
            className="h-32 w-32 object-cover rounded-full"
          />
        </div>

        <div className="text-center">
          <h5 className="text-xl font-bold text-gray-800">{category.name}</h5>
        </div>
      </div>
    </Link>
  ))}
</div>
  );
};
