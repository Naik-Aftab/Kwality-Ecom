"use client";
import { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert, Link } from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false); // State to toggle between forms
  const [tempPassword, setTempPassword] = useState(""); // State for temporary password
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for password confirmation

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message); // Display success message from API
      setErrorMessage("");
      setShowResetForm(true); // Show reset form after sending email
    } catch (error) {
      const errorResponse = error.response?.data?.message || "Error sending reset link.";
      setErrorMessage(errorResponse);
      setMessage("");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        email,
        tempPassword,
        newPassword
      });
      setMessage(res.data.message); // Display success message from API
      setErrorMessage("");
      // Optionally, redirect or perform other actions
    } catch (error) {
      const errorResponse = error.response?.data?.message || "Error resetting password.";
      setErrorMessage(errorResponse);
      setMessage("");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Box component="form" onSubmit={showResetForm ? handleResetSubmit : handleEmailSubmit} sx={{ maxWidth: 400, bgcolor: 'white', padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          {showResetForm ? "Reset Password" : "Forgot Password"}
        </Typography>

        {!showResetForm ? (
          <>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Send New Password
            </Button>
          </>
        ) : (
          <>
            <TextField
              label="Temporary Password"
              type="password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Reset Password
            </Button>
          </>
        )}

        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}

        <Button
          component={Link}
          href="/login"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}
