"use client";
import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Card, CardContent, CircularProgress, Alert, Link } from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";

const RegisterCard = styled(Card)({
  maxWidth: 500,
  width: "100%",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
  padding: "2rem",
  margin: "2rem 0",
});

const SubmitButton = styled(Button)({
  padding: "0.75rem 1.5rem",
  fontSize: "1.1rem",
  marginTop: "1.5rem",
});

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setIsEmailSent(false);
      setIsPasswordDisabled(true);
      setErrorMessage("");
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, { fullName, email });

      if (res.status === 201) {
        setSuccessMessage("Password sent to your email. Please enter it below.");
        setIsPasswordDisabled(false);
        setIsEmailSent(true);
      }
    } catch (error) {
      setErrorMessage("Error registering user.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/complete-registration`, {
        fullName,
        email,
        password,
      });

      if (res.status === 201) {
        setSuccessMessage("Registration completed successfully!");
        setErrorMessage("");
        // Clear password field and other relevant fields
        setPassword(""); // Clear password field
        setFullName(""); // Clear full name field (if necessary)
        setEmail(""); // Clear email field (if necessary)
        setIsPasswordDisabled(true); // Reset password input state
        setIsEmailSent(false); // Reset email sent state
        setIsRegistered(true);

      }
    } catch (error) {
      setErrorMessage("Password is incorrect.");
    }
  };

  const handleResetPassword = () => {
    router.push("/resetpassword");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5" p={2}>
      <RegisterCard>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Admin Registration
          </Typography>

          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          {isEmailSent && (
            <>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                disabled={isPasswordDisabled}
              />
              <SubmitButton
                variant="contained"
                color="primary"
                onClick={handlePasswordSubmit}
                disabled={isPasswordDisabled}
                fullWidth
              >
                Complete Registration
              </SubmitButton>
            </>
          )}

          {!isEmailSent && (
            <SubmitButton
              variant="contained"
              color="secondary"
              onClick={handleRegister}
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? "Sending..." : "Send Password to Email"}
            </SubmitButton>
          )}

          {errorMessage && <Alert severity="error" style={{ marginTop: "1rem" }}>{errorMessage}</Alert>}
          {successMessage && <Alert severity="success" style={{ marginTop: "1rem" }}>{successMessage}</Alert>}
        
          {isRegistered && (
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleResetPassword}
              style={{ marginTop: "1rem" }}
            >
              Reset Password
            </Button>
          )}

            {/* Login Button */}
            <Link href="/login" style={{ textDecoration: 'none', marginTop: "1rem", display: "block" }}>
            <Button variant="outlined" fullWidth>
              Already have an account? Login
            </Button>
          </Link>

        
        </CardContent>
      </RegisterCard>
    </Box>
  );
}
