"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
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
        totalAmount: totalAmount,
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
    <Box sx={{ maxWidth: "lg", mx: "auto", px: 6, py: 10 }}>
      <Typography variant="h4" sx={{ mb: 6, textAlign: "center", fontWeight: "bold" }}>
        Checkout
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 8 }}>
        
        <Box sx={{ p: 8, backgroundColor: "white", borderRadius: 2, boxShadow: 3, "&:hover": { boxShadow: 4 } }}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: "medium" }}>Shipping Information</Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Placing order...</Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 4 }}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                sx={{ mb: 4 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                sx={{ mb: 4 }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "medium" }}>
                Shipping Address
              </Typography>

              <GoogleApiAutocomplete onAddressSelect={handleAddressSelect} />

              <TextField
                label="Flat No / House No / Apartment"
                name="apartment_address"
                variant="outlined"
                fullWidth
                sx={{ mb: 4 }}
                value={shippingAddress.apartment_address}
                onChange={handleAddressChange}
                required
              />
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
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

              <Box component="fieldset" sx={{ mb: 4 }}>
                <Typography component="legend" sx={{ color: "text.primary", mb: 2 }}>
                  Payment Method
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <input
                    type="radio"
                    id="cashOnDelivery"
                    name="paymentMethod"
                    value="cashOnDelivery"
                    checked={paymentMethod === "cashOnDelivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <Typography component="label" htmlFor="cashOnDelivery" sx={{ ml: 2 }}>
                    Cash on Delivery
                  </Typography>
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
                  <Typography component="label" htmlFor="onlinePayment" sx={{ ml: 2 }}>
                    Online Payment
                  </Typography>
                </Box>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ opacity: loading ? 0.5 : 1 }}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </form>
          )}
        </Box>

        <Box sx={{ p: 8, backgroundColor: "white", borderRadius: 2, boxShadow: 3, "&:hover": { boxShadow: 4 } }}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: "medium" }}>Order Summary</Typography>

          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img src={item.imageUrl} alt={item.name} width={60} height={60} style={{ marginRight: "16px" }} />
                    <Box>
                      <Typography sx={{ fontWeight: "medium" }}>{item.name}</Typography>
                      <Typography color="textSecondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontWeight: "medium" }}>
                    ₹{item.price * item.quantity}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography color="textSecondary">Subtotal</Typography>
                <Typography sx={{ fontWeight: "medium" }}>₹{totalAmount}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography color="textSecondary">Shipping Cost</Typography>
                <Typography sx={{ fontWeight: "medium" }}>₹{shippingCost}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography color="textSecondary">Total Amount</Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  ₹{totalAmount + shippingCost}
                </Typography>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography>Your cart is empty.</Typography>
              <Link href="/" passHref>
                <Button variant="contained" color="primary" sx={{ mt: 4 }}>
                  Continue Shopping
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Checkout;
