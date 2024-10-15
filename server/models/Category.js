const mongoose = require('mongoose');

// Define the Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Category name must be unique
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Export the Category model
module.exports = mongoose.model('Category', categorySchema);
