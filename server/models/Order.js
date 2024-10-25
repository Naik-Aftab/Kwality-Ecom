const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema({
  orderId: { type: Number, unique: true }, 
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cashOnDelivery', 'creditCard', 'debitCard', 'netBanking'], // Updated enum values for payment methods
    required: true,
  },
  shippingCharge: {
    type: Number,
    default: 100 // Default shipping charge
  },
  status: {
    type: String,
    enum: [
      'pending payment', 
      'processing', 
      'on hold', 
      'completed', 
      'refunded', 
      'cancelled', 
      'failed'
    ],
    default: 'pending payment',
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Apply the auto-increment plugin to the `orderId` field
orderSchema.plugin(AutoIncrement, { inc_field: 'orderId' });

module.exports = mongoose.model('Order', orderSchema);
