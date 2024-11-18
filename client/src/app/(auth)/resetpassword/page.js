"use client";
import { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert, Link } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [email, setEmail] = useState(""); // User's email
  const [tempPassword, setTempPassword] = useState(""); // Temporary password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password strength validation
  const isStrongPassword = (password) => {
    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!tempPassword) {
      setErrorMessage("Temporary password is required.");
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setErrorMessage(
        "Password must be at least 8 characters long, with one uppercase, one lowercase, one number, and one special character."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    // Clear error message before making API call
    setErrorMessage("");

    try {
      // POST request to reset the password
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        email,
        tempPassword,
        newPassword,
      });

      setMessage(res.data.message); // Success message from backend
      setErrorMessage("");
      setEmail("");
      setTempPassword("");
      setNewPassword("");
      setConfirmPassword("");

      router.push("/login"); // Redirect to login after successful reset
    } catch (error) {
      setErrorMessage(error.response?.data.message || "Error resetting password.");
      setMessage("");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          bgcolor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Reset Password
        </Typography>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
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
        
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Reset Password
        </Button>
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
