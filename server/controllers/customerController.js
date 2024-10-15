const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    console.log('Fetched all customers');
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get customer by ID
// @route   GET /api/customers/:id
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    console.log(`Fetched customer with ID: ${req.params.id}`);
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update customer by ID  
// @route   PUT /api/customers/:id
exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Find customer and update
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    console.log(`Updated customer with ID: ${req.params.id}`);
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error updating customer:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete customer by ID
// @route   DELETE /api/customers/:id
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    console.log(`Deleted customer with ID: ${req.params.id}`);
    res.status(200).json({ message: 'Customer deleted' });
  } catch (error) {
    console.error('Error deleting customer:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
