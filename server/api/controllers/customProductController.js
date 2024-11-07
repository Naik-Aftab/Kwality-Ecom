const CustomProduct = require("../../models/CustomProduct");
const cloudinary = require('../../config/cloudinary');

// Add Customized Product
exports.createCustomProduct = async (req, res) => {
  try {
    const { name, description, category, variations } = req.body;

    let imagePaths = [];

    if (req.files && req.files.length > 0) {
      // Upload images to Cloudinary
      const uploadPromises = req.files.map(file => {
        return cloudinary.uploader.upload(file.path, {
          folder: "products"
        }).then(result => result.secure_url);
      });
      imagePaths = await Promise.all(uploadPromises);
    }

    const newCustomProduct = new CustomProduct({
      name,
      description,
      category,
      variations,
      images: imagePaths,
    });
    await newCustomProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newCustomProduct });
  } catch (error) {
    res.status(500).json({ error: "Failed to add product" });
  }
};

// Update Customized Product
exports.updateCustomProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, category, variations } = req.body;

    // Find the existing product by ID
    let product = await CustomProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update product fields if provided
    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;

    // Handle image upload if new images are provided
    if (req.files && req.files.length > 0) {
      // Delete old images if needed (optional, if you want to clear old images from Cloudinary)
      if (product.images.length > 0) {
        const deletePromises = product.images.map((imageUrl) => {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          return cloudinary.uploader.destroy(`products/${publicId}`);
        });
        await Promise.all(deletePromises);
      }

      // Upload new images to Cloudinary
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "products" }).then((result) => result.secure_url)
      );
      product.images = await Promise.all(uploadPromises);
    }

    // Update variations if provided
    if (variations && Array.isArray(variations)) {
      product.variations = variations.map((variation) => ({
        weight: variation.weight || "",
        price: variation.price || 0,
      }));
    }

    // Save the updated product to the database
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Get All Customized Products
exports.getAllCustomProducts = async (req, res) => {
    try {
      const products = await CustomProduct.find().populate("category"); // Optional: Populate category if you need related data
  
      if (!products || products.length === 0) {
        return res.status(404).json({ error: "No products found" });
      }
  
      res.status(200).json({ products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve products" });
    }
  };
  

// Get Product Detail by ID
exports.getCustomProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await CustomProduct.findById(productId).populate("category");

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve product details" });
  }
};

// Delete Customized Product
exports.deleteCustomProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by ID
    const product = await CustomProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete images from Cloudinary if they exist
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((imageUrl) => {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(`products/${publicId}`);
      });
      await Promise.all(deletePromises);
    }

    // Delete the product from the database
    await CustomProduct.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

