"use client"
import { useState } from 'react';
import axios from 'axios';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, formData);
      console.log('Login successful', res.data);
    } catch (error) {
      console.error('Login failed', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" value={email} onChange={handleChange} placeholder="Email" />
      <input type="password" name="password" value={password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
