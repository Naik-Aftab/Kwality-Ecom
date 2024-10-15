const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const customerRoutes = require('./routes/customer'); 

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);           // Auth routes
app.use('/api/categories', categoryRoutes); // Category routes
app.use('/api/products', productRoutes);    // Product routes
app.use('/api/orders', orderRoutes);        // Order routes
app.use('/api/customers', customerRoutes);  // Customers


// Listen on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
