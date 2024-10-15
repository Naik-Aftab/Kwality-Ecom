"use client"
import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/forgotpassword`, { email });
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Failed to send password reset email', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">Send Password Reset Link</button>
    </form>
  );
};

export default ForgotPassword;
