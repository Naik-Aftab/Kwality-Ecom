"use client"
import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { name, email, password } = formData;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, formData);
      console.log('Registration successful', res.data);
    } catch (error) {
      console.error('Registration failed', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={name} onChange={handleChange} placeholder="Name" />
      <input type="email" name="email" value={email} onChange={handleChange} placeholder="Email" />
      <input type="password" name="password" value={password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
