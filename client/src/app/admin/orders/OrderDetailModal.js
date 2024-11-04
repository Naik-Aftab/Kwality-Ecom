import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EditIcon from "@mui/icons-material/Edit"; // Import Edit icon

export default function OrderDetailModal({
  order,
  open,
  onClose,
  onUpdateStatus,
}) {
  const [newStatus, setNewStatus] = useState(order.status);

  if (!order) return null; // Return null if no order is selected

  const handleStatusChange = () => {
    // Call the provided onUpdateStatus function with the new status
    onUpdateStatus(order._id, newStatus);
    alert(`Order status updated to: ${newStatus}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Order Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {/* Order Overview */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Order Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Order ID:</strong> {order.orderId}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        {/* Status Update */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Update Status
          </Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending payment">Pending Payment</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="on hold">On Hold</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Customer Details */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Customer Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Name:</strong> {order.customer.fullName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Email:</strong> {order.customer.email}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Phone:</strong> {order.customer.phone}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Shipping Address:</strong>{" "}
            {`${order.customer.shippingAddress.street_address1}, ${order.customer.shippingAddress.city}, ${order.customer.shippingAddress.state}, ${order.customer.shippingAddress.pincode}`}
          </Typography>
        </Box>

        {/* Order Items */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Order Items
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Product</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Price</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Quantity</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Total</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.products.map((item) => (
                  <TableRow key={item.product._id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell align="right">
                      ₹ {item.product.salePrice}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ₹ {item.product.salePrice * item.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Summary */}
        <Box mt={2} mb={4}>
          <Typography variant="h5" gutterBottom>
            Order Summary
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Total Amount:</strong> ₹ {order.totalAmount}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Shipping Charge:</strong> ₹ {order.shippingCharge}
          </Typography>
          <Typography variant="h6" mt={2}>
            <CurrencyRupeeIcon /> <strong>Total Payable:</strong> ₹{" "}
            {order.totalAmount + order.shippingCharge}
          </Typography>
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<EditIcon />}
          onClick={handleStatusChange}
        >
          Update Status
        </Button>
      </Box>
    </Dialog>
  );
}
