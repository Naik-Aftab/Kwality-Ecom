const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const createInvoice = require("../utils/createInvoice");
const sendEmail = require("../utils/sendMail");

// @desc    Create a new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  const { customer, products, totalAmount, paymentMethod, shippingCharge } =
    req.body;

  try {
    // Check if the customer exists
    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(400).json({ message: "Customer does not exist" });
    }

    // // Check if all products exist
    // const productIds = products.map((item) => item.product); // Ensure we use item.product
    // const existingProducts = await Product.find({ _id: { $in: productIds } });

    // Validate product existence
    // if (existingProducts.length !== products.length) {
    //   return res
    //     .status(400)
    //     .json({ message: "One or more products do not exist" });
    // }
    // Create a new order
    const order = await Order.create({
      customer,
      products,
      totalAmount,
      paymentMethod,
      shippingCharge,
    });

    // Optionally, fetch the complete order data with populated fields
    const populatedOrder = await Order.findById(order._id)
      .populate("customer") // Populate the customer details
      .populate("products.product"); // Assuming 'products' contains an array of objects with 'product' referencing Product

    // Log the populated order data
    console.log("Populated Order:", populatedOrder);
    console.log("Products in Order:", populatedOrder.products);
    console.log("Customer in Order:", populatedOrder.customer);

    let buffer;
    try {
      // Generate invoice as a PDF buffer
      buffer = await createInvoice(populatedOrder); // Now returns a buffer
    } catch (error) {
      console.error("Error generating invoice:", error.message);
      return res.status(500).json({ message: "Failed to generate invoice" });
    }

    // Send email to the user with the invoice
    try {
      await sendEmail({
        email: existingCustomer.email,
        subject: "Order Confirmation & Invoice",
        message: `Dear ${existingCustomer.fullName},\n\nThank you for your order! Please find your invoice attached.\n\nRegards,\nKwality Ecom Team`,
        attachments: [
          {
            filename: `Invoice_${order._id}.pdf`,
            content: buffer,
          },
        ],
      });
    } catch (error) {
      console.error("Error sending email to user:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to send invoice email to the customer" });
    }

    // Generate product details string
    const productDetails = order.products
      .map((item) => {
        const product = existingProducts.find(
          (p) => p._id.toString() === item.product.toString()
        );
        return product
          ? `- ${product.name} (Quantity: ${
              item.quantity
            }, Unit Price: ₹${product.salePrice.toFixed(2)})`
          : "";
      })
      .join("\n");

    try {
      await sendEmail({
        email: process.env.Admin_Email_Id,
        subject: "New Order Created",
        message: `
      A new order (Order #${order._id}) has been placed by ${
          existingCustomer.fullName
        }.
      \n\nOrder Details:
      \nTotal Amount: ₹${order.totalAmount.toFixed(2)}
      \nShipping Charge: ₹${order.shippingCharge.toFixed(2)}
      \n\nProducts:\n${productDetails}
      \n\nThank you,
      \nKwality Ecom Team
    `,
      });
    } catch (error) {
      console.error("Error sending email to admin:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to send notification email to the admin" });
    }

    // Respond with the created order
    res.status(201).json({
      _id: order._id,
      orderId: order.orderId,
      customer: order.customer,
      products: order.products,
      totalAmount: order.totalAmount,
      shippingCharge: order.shippingCharge,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    // Get pagination and search parameters from the request query
    const { limit = 10, skip = 0 } = req.query;

    const orders = await Order.find()
      .sort({ createdAt: -1 }) // Sort orders in reverse (latest first)
      .populate("customer", "fullName email") // Populate customer details
      .populate("products.product", "name price") // Populate product details
      .limit(Number(limit)) // Limit the number of orders returned
      .skip(Number(skip)); // Skip the first N results

    // Get the total count of orders for pagination
    const totalOrders = await Order.countDocuments();

    // Return the orders and total count in the response
    res.status(200).json({
      totalOrders,
      orders: orders.map((order) => ({
        _id: order._id,
        orderId: order.orderId,
        customer: order.customer,
        products: order.products,
        totalAmount: order.totalAmount,
        shippingCharge: order.shippingCharge,
        status: order.status,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id)
      .populate("customer", "fullName email phone shippingAddress") // Populate customer details
      .populate("products.product", "name salePrice"); // Populate product details

    // console.log("getOrderById", order.products);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      _id: order._id,
      orderId: order.orderId,
      customer: order.customer,
      products: order.products,
      totalAmount: order.totalAmount,
      shippingCharge: order.shippingCharge,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update an order
// @route   PUT /api/orders/:id
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate the status
  const validStatuses = [
    "pending payment",
    "processing",
    "on hold",
    "completed",
    "refunded",
    "cancelled",
    "failed",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true } // Return the updated order and validate input
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the updated order details
    res.status(200).json({
      _id: order._id,
      orderId: order.orderId,
      customer: order.customer,
      products: order.products,
      totalAmount: order.totalAmount,
      shippingCharge: order.shippingCharge,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ message: "Server error", error: error.message }); // Include the error message for debugging
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(204).json({ message: "Order Deleted Successfully" }); // No content to return on successful delete
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
