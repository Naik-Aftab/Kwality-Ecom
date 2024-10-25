"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { Box, TextField, Button, Typography, Alert, Link } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      console.log("token", res.data.token);
      router.push("/admin");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f7f7f7">
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: 400, // Increased width
          padding: 4,
          backgroundColor: "white",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center">
          Admin Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>

        {/* Register Button */}
        <Button 
          component={Link} 
          href="/register" 
          variant="outlined" 
          fullWidth 
          sx={{ mt: 2 }}
        >
          Register
        </Button>

        {/* Forgot Password Link */}
        <Link href="/forgotpassword" style={{ textAlign: "center", marginTop: 16 }}>
          <Typography variant="body2" color="primary" textAlign="center">
            Forgot Password?
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
