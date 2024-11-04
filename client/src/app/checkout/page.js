"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCart } from "@/store/slices/cartSlice";
import { TextField, Button, CircularProgress, Box, Typography } from "@mui/material";
import Link from "next/link";
import Swal from "sweetalert2";
import GoogleApiAutocomplete from "@/components/GoogleApiAutocomplete";

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

  const shippingCost = 100;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressComponents, setAddressComponents] = useState({});
  const [shippingAddress, setShippingAddress] = useState({
    street_address1: "",
    city: "",
    apartment_address: "",
    state: "",
    pincode: "",
    country: "",
    lat: "",
    lng: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");

  const handleAddressSelect = (selectedAddressComponents) => {
    setAddressComponents(selectedAddressComponents);
    setShippingAddress({
      street_address1: selectedAddressComponents.street_address1,
      city: selectedAddressComponents.city,
      apartment_address: selectedAddressComponents.apartment_address,
      state: selectedAddressComponents.state,
      pincode: selectedAddressComponents.pincode,
      country: selectedAddressComponents.country,
      lat: selectedAddressComponents.latitude,
      lng: selectedAddressComponents.longitude,
    });
  };

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
      let customerResponse;
      try {
        customerResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers`,
          customerData
        );
      } catch (error) {
        console.error("Error creating customer:", error);
        await Swal.fire({
          title: "Error",
          text: "Failed to create customer. Please try again.",
          icon: "error",
        });
        return;
      }

      const customerId = customerResponse.data.customer._id;

      const orderData = {
        customer: customerId,
        products: cartItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        totalQuantity,
        totalAmount,
        shippingCharge: shippingCost,
        paymentMethod,
      };

      let orderResponse;
      try {
        orderResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`,
          orderData
        );
      } catch (error) {
        console.error("Error creating order:", error);
        await Swal.fire({
          title: "Error",
          text: "Failed to place order. Please try again.",
          icon: "error",
        });
        return;
      }

      await Swal.fire({
        title: "Order Placed!",
        text: "Your order has been placed successfully!",
        icon: "success",
      });

      dispatch(clearCart());
      router.push("/thankyou");
    } catch (error) {
      console.error("Unexpected error:", error);
      await Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Checkout
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 4 }}>
        <Box sx={{ p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shipping Information
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Placing order...</Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Shipping Address
              </Typography>

              <GoogleApiAutocomplete onAddressSelect={handleAddressSelect} />

              <TextField
                label="Flat No / House No / Apartment"
                name="apartment_address"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={shippingAddress.apartment_address}
                onChange={handleAddressChange}
                required
              />
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
                  label="Pin Code"
                  name="pincode"
                  variant="outlined"
                  fullWidth
                  value={shippingAddress.pincode}
                  onChange={handleAddressChange}
                  required
                />
              </Box>

              <fieldset>
                <legend>Payment Method</legend>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <input
                    type="radio"
                    id="cashOnDelivery"
                    name="paymentMethod"
                    value="cashOnDelivery"
                    checked={paymentMethod === "cashOnDelivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="cashOnDelivery" style={{ marginLeft: "8px" }}>
                    Cash on Delivery
                  </label>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <input
                    type="radio"
                    id="onlinePayment"
                    name="paymentMethod"
                    value="onlinePayment"
                    checked={paymentMethod === "onlinePayment"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="onlinePayment" style={{ marginLeft: "8px" }}>
                    Online Payment
                  </label>
                </Box>
              </fieldset>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </form>
          )}
        </Box>

        <Box sx={{ p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Order Summary
          </Typography>

          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`}
                      alt={item.name}
                      style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "8px", marginRight: "8px" }}
                    />
                    <Box>
                      <Typography>{item.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.quantity} x ₹{item.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1">₹{(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Typography variant="body1">Total Amount</Typography>
                <Typography variant="body1">₹{totalAmount.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Typography variant="body1">Shipping Cost</Typography>
                <Typography variant="body1">₹{shippingCost.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Typography variant="h6">Grand Total</Typography>
                <Typography variant="h6">
                  ₹{(totalAmount + shippingCost).toFixed(2)}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No items in cart.
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Link href="/">
          <Button variant="contained" color="primary">
            Continue Shopping
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Checkout;
