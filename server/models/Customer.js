const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Customer', customerSchema);
