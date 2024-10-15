"use client"
import { useParams } from 'next/navigation';  // Import the new hooks
import Slider from "react-slick";
import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../styles/globals.css";
import axios from 'axios';

const ProductDetail = () => {

  const { id } = useParams(); // Use the new useParams hook to get the product ID
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [activeTab, setActiveTab] = useState("description"); // State for active tab

  useEffect(() => {
    if (id) {
      // Fetch product details by ID from the backend
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`)
        .then((response) => {
          setProduct(response.data);
          setLoading(false); // Set loading to false when data is fetched
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setError("Error fetching product details.");
          setLoading(false); // Stop loading in case of an error
        });
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>No product found.</div>;


  const settings = {
    customPaging: function (i) {
      const thumbnails = ["/chiken.png", "/egg.png", "/mutton.png"];
      return (
        <a className="flex justify-center">
          <img      
            src={thumbnails[i]}
            alt={`Thumbnail ${i + 1}`}
            className="w-20 h-20 object-cover rounded-md"
          />
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
    <div className="container mx-auto px-4 py-8 flex space-x-10">
      {/* Image Slider */}
      <div className="w-2/5">
        <div className="slider-container w-full">
          <Slider {...settings}>
            <div className="flex justify-center items-center">
              <img
                src="/chiken.png"
                alt="Chicken"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
            <div className="flex justify-center items-center">
              <img
                src="/egg.png"
                alt="Eggs"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
            <div className="flex justify-center items-center">
              <img
                src="/mutton.png"
                alt="Mutton"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </Slider>
        </div>
      </div>

      {/* Product Details */}
      <div className="w-3/5">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="mb-3 text-gray-600">450 g | 2-4 Pieces | Serves 4</p>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="mb-6">
            <span className="text-gray-500 line-through mr-2">
              ₹{product.price}
            </span>
            <span className="text-xl font-semibold text-red-600">
              ₹{product.price}
            </span>
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={() => alert("Added to cart")}
          >
            Add to Cart
          </button>
        </div>       
      </div>
 
    </div>

    <div className="container my-4 flex justify-center w-9/12">
            <div className="shadow-lg rounded-lg p-5">
          <div className="flex space-x-4 justify-center">
            <button
              className={`${
                activeTab === "description"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              } py-2 px-4 font-semibold`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`${
                activeTab === "sourcing"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              } py-2 px-4 font-semibold`}
              onClick={() => setActiveTab("sourcing")}
            >
              Sourcing
            </button>
          </div>

          <div className="mt-6">
            {activeTab === "description" && (
              <p className="text-gray-700">
                Here’s an in-depth description of the product, including
                preparation, storage, and cooking tips.Here’s an in-depth description of the product, including
                preparation, storage, and cooking tips.Here’s an in-depth description of the product, including
                preparation, storage, and cooking tips.Here’s an in-depth description of the product, including
                preparation, storage, and cooking tips.Here’s an in-depth description of the product, including
                preparation, storage, and cooking tips.
              </p>
            )}
            {activeTab === "sourcing" && (
              <p className="text-gray-700">
                Here’s an in-depth description of the product, including
                preparation, storage, and cooking tips.Here’s an in-depth description of the product, including
                preparation, storage, and cooking tips.Here’s an in-depth description of the product, including
                preparation, storage, and cooking tips.Here’s an in-depth description of the product, including
                preparation, storage, and cooking tips.Here’s an in-depth description of the product, including
                preparation, storage, and cooking tips.Here’s an in-depth description of the product, including
                preparation, storage, and cooking tips.
              </p>
            )}
          </div>
        </div>
    </div>
</>
  );
};

export default ProductDetail;
