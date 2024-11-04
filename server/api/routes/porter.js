const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/porterController');

// Define the route for creating an order
router.post('/create', createOrder);

module.exports = router;
