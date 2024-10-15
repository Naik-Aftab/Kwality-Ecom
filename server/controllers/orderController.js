const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { customer, products, totalAmount, status } = req.body;
    const newOrder = new Order({ customer, products, totalAmount, status });
    await newOrder.save();
    console.log('Order created:', newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer products.product');
    console.log('Fetched all orders');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer products.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log(`Fetched order with ID: ${req.params.id}`);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order by ID
// @route   PUT /api/orders/:id
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log(`Updated order with ID: ${req.params.id}`);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete order by ID
// @route   DELETE /api/orders/:id
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log(`Deleted order with ID: ${req.params.id}`);
    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Error deleting order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
