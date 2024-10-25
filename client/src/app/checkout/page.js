"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearCart } from '@/store/slices/cartSlice'; 



const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

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
  const [loading, setLoading] = useState(false);

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
      shippingAddress, // Include the shipping address as an object
    };

    setLoading(true);
    try {
      // Save customer details first
      const customerResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customers`, customerData);
      console.log("Customer Response:",customerResponse.data.customer._id);
      const customerId = customerResponse.data.customer._id; // Assuming your API returns the customer's ID

      const orderData = {
        customer: customerId, // Change to 'customer'
        products: cartItems.map(item => ({
          product: item.id, // Assuming item.id is the product ID
          quantity: item.quantity
        })),
        totalQuantity,
        totalAmount: totalAmount + shippingCost,
        shippingCharge: shippingCost, // Make sure you match the field name
        paymentMethod,
      };

      // Place the order
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, orderData);
      alert('Order placed successfully!');
       
      dispatch(clearCart()); // Clear the cart

      router.push('/thankyou');
      // Optionally, redirect or clear cart here
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
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" className="w-full p-3 border rounded-lg" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
              <input type="email" id="email" className="w-full p-3 border rounded-lg" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
              <input type="text" id="phone" className="w-full p-3 border rounded-lg" placeholder="1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            {/* Shipping Address Fields */}
            <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="street">Street</label>
              <input type="text" name="street" className="w-full p-3 border rounded-lg" placeholder="123 Main St" value={shippingAddress.street} onChange={handleAddressChange} required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="city">City</label>
              <input type="text" name="city" className="w-full p-3 border rounded-lg" placeholder="City" value={shippingAddress.city} onChange={handleAddressChange} required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="state">State</label>
              <input type="text" name="state" className="w-full p-3 border rounded-lg" placeholder="State" value={shippingAddress.state} onChange={handleAddressChange} required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="zip">Zip</label>
              <input type="text" name="zip" className="w-full p-3 border rounded-lg" placeholder="Pincode" value={shippingAddress.zip} onChange={handleAddressChange} required />
            </div>

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
            <button type="submit" className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
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
                <div className="flex justify-between font-semibold">
                  <p>Total Amount:</p>
                  <p>₹{(totalAmount + shippingCost).toFixed(2)}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
