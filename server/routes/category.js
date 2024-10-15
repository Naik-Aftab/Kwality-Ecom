const express = require('express');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');
const router = express.Router();

// Routes for category CRUD operations
router.post('/', createCategory); // Create a new category
router.get('/', getCategories);   // Get all categories
router.get('/:id', getCategoryById);  // Get a specific category by ID
router.put('/:id', updateCategory);   // Update a category by ID
router.delete('/:id', deleteCategory); // Delete a category by ID

module.exports = router;
