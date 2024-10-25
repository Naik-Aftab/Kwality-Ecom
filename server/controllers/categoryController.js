const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Create a new category
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Check if an image was uploaded

    const newCategory = new Category({
      name,
      description,
      image: imagePath, // Save image path to the category
    });

    await newCategory.save();
    res.status(201).json({ message: "Category created successfully", newCategory });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category", details: error });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ categoryId }); // Find products by category ID

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this category.' });
    }

    res.status(200).json(products); // Respond with the products
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined; // Update image if uploaded

    const updatedFields = { name, description };
    if (imagePath) {
      updatedFields.image = imagePath;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category", details: error });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(204).json(); // No content to return on successful delete
  } catch (error) {
    console.error('Error deleting category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
