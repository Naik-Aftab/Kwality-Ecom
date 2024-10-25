"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, CircularProgress, Pagination } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OrderDetailModal from './OrderDetailModal'; // Modal for order details

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit] = useState(10);  // Orders per page
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, [page]); // Only fetch orders based on page

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, {
        params: { limit, skip: (page - 1) * limit }, // Pass pagination params only
        headers: { Authorization: `Bearer ${token}`, }, // Attach the token in the Authorization header        
      });

      setOrders(response.data.orders); // Adjusted to match the response structure
      setTotalOrders(response.data.totalOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const handleViewOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
        },
      });
      // console.log("response",response.data);
      setSelectedOrder(response.data);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
    setLoading(false);
  };

// Function to update order status
const updateOrderStatus = async (id, newStatus) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${id}`, {
      status: newStatus,
      headers: { Authorization: `Bearer ${token}`, },
    });
    // console.log('Order status updated:', response.data);
    // Optionally, you might want to refresh the orders list or do something after updating
  } catch (error) {
    console.error('Error updating order status:', error.response.data.message);
    alert('Failed to update order status.');
  }
};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Orders</Typography>

      {/* Loading Indicator */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Orders Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Customer</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Total Amount</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId} sx={{ backgroundColor: '#f9f9f9' }}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customer.fullName}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>₹ {order.totalAmount}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewOrder(order._id)}>
                        <VisibilityIcon color="primary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(totalOrders / limit)}
              page={page}
              onChange={(event, value) => setPage(value)}
            />
          </Box>

          {/* Order Detail Modal */}
          {selectedOrder && (
            <OrderDetailModal
              order={selectedOrder}
              open={open}
              onClose={() => setOpen(false)}
              onUpdateStatus={updateOrderStatus}
            />
          )}
        </>
      )}
    </Box>
  );
}
