"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link"; // Import Link component

const OrderInvoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("order detail", response.data);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Typography align="center" my={5}>
        Failed to load order details.
      </Typography>
    );
  }

  return (
    <Box sx={{ bgcolor: "#eee" }}>
      <Box
        sx={{
          maxWidth: "800px",
          mx: "auto",
          p: 3,
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#fff",
        }}
      >
        {/* Header with Logo and Title */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            {/* Company Logo */}
            <Image src="/logo.png" alt="Company Logo" width={100} height={40} />
          </Box>
          <Box textAlign="center" flex="1">
            {/* Company Name and Address */}
            <Typography variant="h5" fontWeight="bold" color="success.main">
              {" "}
              {/* Green color */}
              Kwality Chicken Center
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Shop No, 55 56, Chatrapati Shivaji Market, Camp, Near St. Xaviers
              Church, pune, Maharashtra, 411001
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Order Invoice Title */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="success.main">
            {" "}
            {/* Green color */}
            Order Invoice
          </Typography>
          <Typography variant="subtitle1">Order ID: {order.orderId}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Shipping Information */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" color="success.main">
            {" "}
            {/* Green color */}
            Shipping Information
          </Typography>
          <Typography>Full Name: {order.customer.fullName}</Typography>
          <Typography>Email: {order.customer.email}</Typography>
          <Typography>Phone: {order.customer.phone}</Typography>
          <Typography>
            Address: {order.customer.shippingAddress.apartment_address},{" "}
            {order.customer.shippingAddress.street_address1},{" "}
            {order.customer.shippingAddress.city}
          </Typography>
          <Typography>
            {order.customer.shippingAddress.state},{" "}
            {order.customer.shippingAddress.pincode}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Order Summary */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" color="success.main">
            {" "}
            {/* Green color */}
            Order Summary
          </Typography>
          {order.products.map((product) => (
            <Box
              key={product._id}
              display="flex"
              justifyContent="space-between"
              py={1}
            >
              <Box>
                <Typography fontWeight="bold">{product.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {product.product.weight
                    ? [
                        product.product.weight.grams &&
                          `${product.product.weight.grams}`,
                        product.product.weight.pieces &&
                          `${product.product.weight.pieces}`,
                        product.product.weight.serves &&
                          `${product.product.weight.serves}`,
                      ]
                        .filter(Boolean)
                        .join(" | ")
                    : null}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {product.quantity} x ₹{product.price.toFixed(2)}
                </Typography>
              </Box>
              <Typography>
                ₹{(product.quantity * product.price).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Delivery Charges */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h6" fontWeight="bold" color="success.main">
            {" "}
            {/* Green color */}
            Delivery Charges:
          </Typography>
          <Typography variant="h6">
            ₹{order.deliveryCharges ? order.deliveryCharges.toFixed(2) : "0.00"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Total Cost */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h6" fontWeight="bold" color="success.main">
            {" "}
            {/* Green color */}
            Total:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary">
            ₹{(order.totalAmount + (order.deliveryCharges || 0)).toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Payment Method */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" color="success.main">
            {" "}
            {/* Green color */}
            Payment Status
          </Typography>
          <Typography>COD</Typography>
        </Box>

        {/* Download Invoice Button */}
        <Box textAlign="center" mt={4}>
          <Link href="/">
            <Button variant="contained" color="primary" sx={{ px: 4, py: 1.5 }}>
              Continue Shopping
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderInvoice;
