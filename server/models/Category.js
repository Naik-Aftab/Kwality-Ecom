const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures category names are unique
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store the image URL or path as a string
    required: false, // You can choose if the image is required
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Category", categorySchema);
