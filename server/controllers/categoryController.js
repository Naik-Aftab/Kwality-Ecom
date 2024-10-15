const Category = require('../models/Category');

// @desc    Create new category
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create new category
    const newCategory = new Category({ name });
    await newCategory.save();

    console.log('Category created:', newCategory);
    res.status(201).json(newCategory); // Return the newly created category
  } catch (error) {
    console.error('Error creating category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    console.log('Fetched all categories');
    res.status(200).json(categories); // Return all categories
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    // Check if category exists
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log(`Fetched category with ID: ${req.params.id}`);
    res.status(200).json(category); // Return the requested category
  } catch (error) {
    console.error('Error fetching category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update category by ID
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Find category by ID and update
    const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
    
    // Check if category exists
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log(`Updated category with ID: ${req.params.id}`);
    res.status(200).json(category); // Return the updated category
  } catch (error) {
    console.error('Error updating category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    // Find category by ID and delete
    const category = await Category.findByIdAndDelete(req.params.id);
    
    // Check if category exists
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log(`Deleted category with ID: ${req.params.id}`);
    res.status(200).json({ message: 'Category deleted' }); // Confirm deletion
  } catch (error) {
    console.error('Error deleting category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
