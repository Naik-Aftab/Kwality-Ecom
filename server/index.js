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
const metricsRoutes = require('./routes/metrics'); 

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use('/auth', authRoutes);           // Auth routes
app.use('/categories', categoryRoutes); // Category routes
app.use('/products', productRoutes);    // Product routes
app.use('/orders', orderRoutes);        // Order routes
app.use('/customers', customerRoutes);  // Customers
app.use('/metrics', metricsRoutes);     // Metrics routes


// Listen on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
