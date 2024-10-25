const express = require('express');
const upload = require("../middlewares/upload"); // Import multer setup
const {
  createCategory,
  getAllCategories, // Use consistent function names
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllProductsByCategory,
} = require('../controllers/categoryController');
const protect = require('../middlewares/protect'); // Importing the protect middleware


const router = express.Router();

// Routes for category CRUD operations
router.post("/", protect, upload.single("image"), createCategory);  // creating a category (with image upload)
router.get('/', getAllCategories);            // Get all categories
router.get('/:id', getCategoryById);          // Get a specific category by ID
router.put("/:id", protect, upload.single("image"), updateCategory); //updating a category (with image upload)
router.delete('/:id', protect, deleteCategory);        // Delete a category by ID
router.get('/:id/products', getAllProductsByCategory); // Get all products
module.exports = router;
