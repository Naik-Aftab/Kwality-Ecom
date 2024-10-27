"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearCart } from '@/store/slices/cartSlice'; 
import { TextField, Button, CircularProgress } from '@mui/material';
import Link from 'next/link';
import Swal from 'sweetalert2'; // Import SweetAlert

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingCost = 100; // Fixed shipping cost
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery'); // Default payment method

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customerData = {
      fullName,
      email,
      phone,
      shippingAddress,
    };

    setLoading(true);
    try {
      const customerResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customers`, customerData);
      const customerId = customerResponse.data.customer._id;

      const orderData = {
        customer: customerId,
        products: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        totalQuantity,
        totalAmount: totalAmount + shippingCost,
        shippingCharge: shippingCost,
        paymentMethod,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, orderData);
      
      // SweetAlert confirmation
      await Swal.fire({
        title: 'Order Placed!',
        text: 'Your order has been placed successfully!',
        icon: 'success'
      });

      dispatch(clearCart()); 
      router.push('/thankyou');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Shipping Information */}
        <div className="p-8 bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <CircularProgress />
              <span className="ml-2">Placing order...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField 
                label="Full Name" 
                variant="outlined" 
                fullWidth 
                className="mb-4" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
              />
              <TextField 
                label="Email" 
                type="email" 
                variant="outlined" 
                fullWidth 
                className="mb-4" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <TextField 
                label="Phone" 
                variant="outlined" 
                fullWidth 
                className="mb-4" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
              />

              {/* Shipping Address Fields */}
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              <TextField 
                label="Address" 
                name="street" 
                variant="outlined" 
                fullWidth 
                className="mb-4" 
                value={shippingAddress.street} 
                onChange={handleAddressChange} 
                required 
              />
              <div className="flex space-x-4 mb-4">
                <TextField 
                  label="City" 
                  name="city" 
                  variant="outlined" 
                  fullWidth 
                  value={shippingAddress.city} 
                  onChange={handleAddressChange} 
                  required 
                />
                <TextField 
                  label="State" 
                  name="state" 
                  variant="outlined" 
                  fullWidth 
                  value={shippingAddress.state} 
                  onChange={handleAddressChange} 
                  required 
                />
              </div>
              <TextField 
                label="Pin Code" 
                name="zip" 
                variant="outlined" 
                fullWidth 
                className="mb-4" 
                value={shippingAddress.zip} 
                onChange={handleAddressChange} 
                required 
              />

              <fieldset className="mb-4">
                <legend className="block text-gray-700 mb-2">Payment Method</legend>
                <div className="flex items-center mb-2">
                  <input type="radio" id="cashOnDelivery" name="paymentMethod" value="cashOnDelivery" checked={paymentMethod === 'cashOnDelivery'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <label htmlFor="cashOnDelivery" className="ml-2">Cash on Delivery</label>
                </div>
                <div className="flex items-center mb-2">
                  <input type="radio" id="onlinePayment" name="paymentMethod" value="onlinePayment" checked={paymentMethod === 'onlinePayment'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <label htmlFor="onlinePayment" className="ml-2">Online Payment</label>
                </div>
              </fieldset>
              <Button type="submit" variant="contained" color="primary" fullWidth className={loading ? 'opacity-50 cursor-not-allowed' : ''} disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </form>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="p-8 bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

          {/* Cart Items */}
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                    <div>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-gray-600">{item.quantity} x ₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>                
              ))}
              {/* Button to Modify Cart */}
              <Link href="/cart" passHref>
                <Button variant="outlined" color="secondary" className="mt-4">
                  Modify Cart
                </Button>
              </Link>
              {/* Total Price */}
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between mb-2">
                  <p>Total Items: {totalQuantity}</p>
                  <p>Subtotal: ₹{totalAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>Delivery Charges:</p>
                  <p>₹{shippingCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-bold">
                  <p>Total Amount:</p>
                  <p>₹{(totalAmount + shippingCost).toFixed(2)}</p>
                </div>
              </div>
            </>
          ) : (
            <p>No items in the cart.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
