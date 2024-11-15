"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "@/store/slices/cartSlice";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const BulkOrder = () => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(null); // Track selected weight
  const [price, setPrice] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch the latest product from the API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/custom-products`
        );
        const latestProduct = response.data.products[response.data.products.length - 1];
        console.log("Product", latestProduct);
        setProduct(latestProduct);

        // Set initial weight and price if variations are available
        if (latestProduct.variations && latestProduct.variations.length > 0) {
          const initialWeight = latestProduct.variations[0];
          setSelectedWeight(initialWeight.weight);
          setPrice(initialWeight.price);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, []);

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => Math.max(1, prev + increment));
  };

  const handleWeightChange = (variation) => {
    setSelectedWeight(variation.weight);
    setPrice(variation.price * quantity); // Update price based on selected variation and quantity
  };

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        id: product._id,
        name: `${product.name} - ${selectedWeight}`,
        description: product.description,
        price,
        weight: selectedWeight,
        quantity,
        image: product.images[0],
      };

      dispatch(addToCart(cartItem));
      setSnackbarOpen(true); // Show success message
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10">
          <div className="w-full lg:w-1/2">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="flex space-x-4">
              {product.variations.map((variation) => (
                <button
                  key={variation._id}
                  onClick={() => handleWeightChange(variation)}
                  className={`${
                    selectedWeight === variation.weight
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  } px-4 py-2 rounded`}
                >
                  {variation.weight}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-xl font-bold">Price : ₹{price}</p>
            </div>

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
