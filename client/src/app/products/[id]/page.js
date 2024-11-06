"use client";
import { useParams } from "next/navigation"; 
import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import Header from "@/components/header";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Footer from "@/components/footer";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  const dispatch = useDispatch();
  const handleAddToCart = () => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.salePrice, // Use the sale price for the cart
      quantity: 1,
      image: product.images[0], // Adjust if there's an array of images
    };

    dispatch(addToCart(cartItem));
    setSnackbarOpen(true);
    };

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`)
        .then((response) => {
          setProduct(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setError("Error fetching product details.");
          setLoading(false);
        });
    }
  }, [id]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center">{error}</div>;
  if (!product) return <div className="text-center">No product found.</div>;

  return (
    <>
    <Header/>
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <img
            src={`${product.images[0]}`} // Assuming the first image is the one you want to show
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg object-cover transition-transform duration-300 transform hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-3/5">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="mb-3 text-gray-600">
                {[
                  product.weight?.grams && `${product.weight.grams}`,
                  product.weight?.pieces && `${product.weight.pieces}`,
                  product.weight?.serves && ` ${product.weight.serves}`,
                ]
                  .filter(Boolean)
                  .join(" | ")}
              </p>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <div className="mb-6 flex items-center">
              <span className="text-gray-500 line-through mr-2">
                ₹{product.regularPrice}
              </span>
              <span className="text-xl font-semibold text-red-600">
                ₹{product.salePrice}
              </span>
            </div>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-400 hover:to-blue-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="container my-4 flex justify-center w-9/12 mx-auto">
        <div className="shadow-lg rounded-lg p-5 w-full">
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
                {product.longDescription || "No description available."}
              </p>
            )}
            {activeTab === "sourcing" && (
              <p className="text-gray-700">
                {product.sourcingInfo || "No sourcing information available."}
              </p>
            )}
          </div>
        </div>
      </div>
       {/* Snackbar for product added to cart */}
       <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Product added to cart!
        </Alert>
      </Snackbar>
      <Footer/>
    </>
  );
};

export default ProductDetail;
