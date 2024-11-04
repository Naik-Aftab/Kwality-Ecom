"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const BulkOrder = () => {
  const dispatch = useDispatch();

  // Static product data
  const product = {
    id: 100,
    name: "Chicken Curry Cut",
    description: "Experience rich and authentic flavors with our Chicken Curry Cut, prepared to bring out the best in every dish. Sourced from premium quality chicken, each piece is meticulously cut for a seamless cooking experience. Perfect for bulk orders, this option allows you to buy in larger quantities for gatherings, celebrations, or just to stock up. Choose from our weight options – 2kg, 5kg, 10kg, and 20kg – with affordable pricing per kilogram. Convenient and fresh, it's an ideal choice for family meals or catering needs.",
    image: "/Product-Img/chi-curry.png",
    pricing: {
      2: 400,
      5: 800,
      10: 1200,
      20: 1500,
    },
  };

  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(2); // Default weight
  const [price, setPrice] = useState(400); // Initial price for 2kg
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => Math.max(1, prev + increment));
  };

  const handleWeightChange = (newWeight) => {
    setWeight(newWeight);
    setPrice(product.pricing[newWeight] * quantity);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    const cartItem = {
        id: product.id,
        name: product.name +" - "+ weight + "Kg" ,
        description: product.description,
        price,
        weight,
        quantity,
        image: product.image,
    };

    dispatch(addToCart(cartItem));
    setSnackbarOpen(true); // Show success message
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10">
          {/* Product Image */}
          <div className="w-full lg:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            {/* Bulk Order Options */}
            <div className="flex space-x-4">
              {[2, 5, 10, 20].map((w) => (
                <button
                  key={w}
                  onClick={() => handleWeightChange(w)}
                  className={`${
                    weight === w
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  } px-4 py-2 rounded`}
                >
                  {w} kg
                </button>
              ))}

            </div>

<div className="mt-4">  <p className="text-xl font-bold">Price : ₹{price}</p>
</div>

            {/* Quantity Controls and Add to Cart */}
            <div className="flex items-center space-x-4 mt-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
              <button
                onClick={handleAddToCart}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg ml-4"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Snackbar for product added to cart */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Product added to cart!
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default BulkOrder;
