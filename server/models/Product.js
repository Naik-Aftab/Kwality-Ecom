const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  weight: {
    grams: { type: String, required: false },  
    pieces: { type: String, required: false },  
    serves: { type: String, required: false }, 
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
    required: true
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
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  isTopSeller: { 
    type: Boolean, 
    default: false 
  },
});

module.exports = mongoose.model('Product', productSchema);
