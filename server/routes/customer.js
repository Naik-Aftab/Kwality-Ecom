const express = require('express');
const { getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const router = express.Router();

// Customer routes
router.get('/', getCustomers);         // Get all customers
router.get('/:id', getCustomerById);   // Get customer by ID
router.put('/:id', updateCustomer);    // Update customer by ID
router.delete('/:id', deleteCustomer); // Delete customer by ID

module.exports = router;
