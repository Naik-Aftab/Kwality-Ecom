const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  regularPrice: { 
    type: Number, 
    required: true 
  },
  salePrice: { 
    type: Number, 
    required: false // Not required; if not provided, the product is not on sale
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  images: { 
    type: [String], 
    required: true 
  },
  stock: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Product', productSchema);
