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
        console.log("Category data:", response.data);
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
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl text-red-500">{error}</h2>
      </div>
    );
  }


  return (
    <div className="flex flex-wrap justify-center p-4">
      {categories.map((category) => (
         <Link key={category.id} href={`/categories/${category._id}`} passHref>
        <div
          key={category._id}
          className="max-w-sm mx-4 mb-8 p-4 shadow-lg rounded-lg transition-transform transform hover:scale-105" // Increased mx-4 and mb-8
        >
          <div className="flex justify-center mb-2">
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${category.image}`} // Assuming your API returns an image URL
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
