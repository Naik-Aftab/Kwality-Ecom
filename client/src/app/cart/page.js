"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "@/store/slices/cartSlice";
import Link from "next/link";
import Header from "@/components/header";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Footer from "@/components/footer";

const Cart = () => {
  // Get cart items and total quantity from the Redux store
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();

  // console.log("cartItems: ",cartItems)
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Calculate total price of the cart
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
    setSnackbarOpen(true); // Show the snackbar alert
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          // Show message when cart is empty
          <p className="text-lg text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col lg:flex-row">
            {/* Cart Items Section */}
            <div className="flex-1 max-h-96 overflow-y-auto pr-4 mb-6 lg:mb-0">
              <div className="grid grid-cols-1 gap-6 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Product Image and Details */}
                    <div className="flex items-center">
                      
                        <img
                          src={`${item.image}`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Price: ₹{item.price}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Subtotal and Remove Button */}
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-bold">
                        Subtotal: ₹{item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="mt-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-1/3">
              <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg">Total Items:</span>
                <span className="text-lg font-bold">{totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg">Total Price:</span>
                <span className="text-lg font-bold">₹{totalPrice}</span>
              </div>
              <Link href="/checkout" passHref>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500 transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}

        <Link href="/" passHref>
          <button className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-400 transition">
            Continue Shopping
          </button>
        </Link>
      </div>

      {/* Snackbar for product removed from cart */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Positioning the Snackbar
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: "100%" }}
        >
          Product removed from cart!
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
};

export default Cart;
