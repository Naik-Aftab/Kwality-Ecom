const Customer = require('../models/Customer');

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, shippingAddress } = req.body;

    // Validate shippingAddress fields
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip) {
      return res.status(400).json({ message: 'Shipping address is incomplete' });
    }

    // Create a new customer instance
    const newCustomer = new Customer({ fullName, email, phone, shippingAddress });

    // Save the customer to the database
    await newCustomer.save();

    // Respond with the created customer
    res.status(201).json({
      message: 'Customer created successfully',
      customer: newCustomer,
    });
  } catch (error) {
    console.error('Error creating customer:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error creating customer', error: error.message }); // Use error.message for clarity
  }
};


// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default limit set to 10

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch customers with pagination
    const customers = await Customer.find()
      .sort({ createdAt: -1 }) // Optional sorting by creation date, newest first
      .skip(skip)
      .limit(parseInt(limit));

    // Get total number of customers for pagination info
    const totalCount = await Customer.countDocuments();

    // Send the customers and total count to the frontend
    res.status(200).json({
      customers,
      totalCount, // Send total customers count to handle pagination on frontend
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching customer', error });
  }
};


// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (error) {
    res.status(400).json({ message: 'Error updating customer', error });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting customer', error });
  }
};