const crypto = require('crypto');
const sendEmail = require('../utils/sendMail');
const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');


// @desc    Register a new customer
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    // Create a new customer
    const customer = await Customer.create({
      name, email, password, phone, address
    });

    console.log('Customer registered:', customer);

    // Generate JWT token
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      token
    });
  } catch (error) {
    console.error('Error registering customer:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a customer & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find customer by email
    const customer = await Customer.findOne({ email });

    if (!customer || !(await customer.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Customer logged in:', customer);

    // Generate JWT token
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(200).json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      token
    });
  } catch (error) {
    console.error('Error logging in customer:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if customer exists
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Generate reset token
    const resetToken = customer.getResetPasswordToken();
    await customer.save(); // Save the customer with reset token and expiry

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    // Email message
    const message = `You are receiving this email because you (or someone else) has requested a password reset. 
    Please click on the link below to reset your password:
    \n\n${resetUrl}
    \n\nIf you did not request this, please ignore this email.`;

    // Send email with the reset URL
    try {
      await sendEmail({
        email: customer.email,
        subject: 'Password Reset',
        message
      });

      res.status(200).json({ message: 'Reset email sent' });
    } catch (error) {
      console.error('Email could not be sent:', error);
      customer.resetPasswordToken = undefined;
      customer.resetPasswordExpire = undefined;
      await customer.save(); // Reset token and expiration fields

      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error('Error in forgot password:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
exports.resetPassword = async (req, res) => {
  // Hash the reset token provided in the URL
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

  try {
    // Find customer by the token and check if it's still valid
    const customer = await Customer.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() } // Token has not expired
    });

    if (!customer) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set the new password
    customer.password = req.body.password;
    customer.resetPasswordToken = undefined;
    customer.resetPasswordExpire = undefined;

    await customer.save();

    res.status(200).json({ message: 'Password has been updated' });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};