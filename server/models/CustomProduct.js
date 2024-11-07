const mongoose = require("mongoose");

const variationSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  price: { type: Number, required: true },
});

const CustomproductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  variations: [variationSchema],
  images: [String],
});

module.exports = mongoose.model("CustomProduct", CustomproductSchema);
