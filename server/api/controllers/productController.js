const Product = require('../../models/Product');

/// @desc    Create new product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, regularPrice, salePrice, description, category, stock, weight } = req.body;
    // Collect image file paths
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    // Create new product with regular price and optional sale price
    const newProduct = new Product({
      name,
      regularPrice,
      salePrice, 
      description,
      category,
      stock,
      images: imagePaths, // Store image paths
      weight: {
        grams: weight?.grams || "", 
        pieces: weight?.pieces || "", 
        serves: weight?.serves || ""
      }
    });

    await newProduct.save();
    // console.log('Product created:', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
        ]
      };
    }

    const products = await Product.find(filter).populate('category');  // No populate here
    // console.log('Fetched products', search ? `with search term: ${search}` : 'all products');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // console.log(`Fetched product with ID: ${req.params.id}`);
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Update product by ID
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, regularPrice, salePrice, category, stock, weight } = req.body;
  
    // Check if product exists
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update product details
    if (req.files && req.files.length > 0) {
      // If new images are uploaded, replace the old ones
      const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
      product.images = imagePaths;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.regularPrice = regularPrice || product.regularPrice;
    product.salePrice = salePrice || product.salePrice;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.weight = {
      grams: weight?.grams || product.weight?.grams || "",
      pieces: weight?.pieces || product.weight?.pieces || "",
      serves: weight?.serves || product.weight?.serves || ""
    };

    // Save updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product", details: error });
  }
};

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // console.log(`Deleted product with ID: ${req.params.id}`);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
