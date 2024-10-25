"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // State to hold uploaded images

  const token = localStorage.getItem('token');

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
          },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
          },
        }
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Open modal with selected product details
  const handleOpen = (product) => {
    setSelectedProduct(product);
    setImages([]); // Reset images when opening the modal
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setImages([]); // Reset images on close
  };

  // Update product details in modal
  const handleProductUpdate = async () => {
    const formData = new FormData();
    formData.append("name", selectedProduct.name);
    formData.append("description", selectedProduct.description);
    formData.append("regularPrice", selectedProduct.regularPrice);
    formData.append("salePrice", selectedProduct.salePrice);
    formData.append("category", selectedProduct.category._id);
    formData.append("stock", selectedProduct.stock);
    
    // Append image files if they exist
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${selectedProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
             Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
          },           
        }
      );
      fetchProducts();
      handleClose();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // Handle changes in the product modal inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    setImages([...e.target.files]); // Store selected files
  };

  // Delete product
  const handleProductDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
        },
      }
        );
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  // Handle adding a new product
  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("name", selectedProduct.name);
    formData.append("description", selectedProduct.description);
    formData.append("regularPrice", selectedProduct.regularPrice);
    formData.append("salePrice", selectedProduct.salePrice);
    formData.append("category", selectedProduct.category._id);
    formData.append("stock", selectedProduct.stock);

    // Append image files if they exist
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
             Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
          },
        }
      );
      fetchProducts();
      handleClose();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Products List
        </Typography>

        {/* Add Product Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedProduct({}); // Reset selected product for adding a new product
            setOpen(true); // Open the modal
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Product Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Product Name</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Image</strong>
              </TableCell>
              <TableCell>
                <strong>Regular Price</strong>
              </TableCell>
              <TableCell>
                <strong>Sale Price</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${product.images[0]}`}
                        alt={product.name}
                        width={50}
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                  <TableCell>₹ {product.regularPrice}</TableCell>
                  <TableCell>₹ {product.salePrice || "-"}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(product)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleProductDelete(product._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Modal */}
      {selectedProduct && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>
            {selectedProduct._id ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogContent>
            <Box my={2}>
              <TextField
                label="Product Name"
                fullWidth
                name="name"
                value={selectedProduct.name || ""}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                label="Description"
                fullWidth
                name="description"
                value={selectedProduct.description || ""}
                onChange={handleInputChange}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <Select
                  labelId="category-select-label"
                  name="category"
                  value={
                    selectedProduct.category ? selectedProduct.category._id : ""
                  }
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      category: categories.find(
                        (cat) => cat._id === e.target.value
                      ),
                    })
                  }
                  displayEmpty
                  sx={{
                    "& .MuiSelect-select": {
                      padding: "16.5px 14px", // Adjust padding if necessary to prevent overlap
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select a category</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Regular Price"
                    fullWidth
                    name="regularPrice"
                    value={selectedProduct.regularPrice || ""}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Sale Price"
                    fullWidth
                    name="salePrice"
                    value={selectedProduct.salePrice || ""}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <TextField
                label="Stock"
                fullWidth
                name="stock"
                value={selectedProduct.stock || ""}
                onChange={handleInputChange}
                margin="normal"
              />

              <input
                accept="image/*"
                style={{ display: "none" }}
                id="product-images-upload"
                type="file"
                multiple
                onChange={handleImageChange}
              />
              <label htmlFor="product-images-upload">
                <Button variant="contained" color="primary" component="span">
                  Upload Images
                </Button>
              </label>

              {/* Display selected image names */}
              {images.length > 0 && (
                <Box mt={2}>
                  <Typography>Selected Images:</Typography>
                  <ul>
                    {images.map((image, index) => (
                      <li key={index}>{image.name}</li>
                    ))}
                  </ul>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={selectedProduct._id ? handleProductUpdate : handleAddProduct}
              color="primary"
              variant="contained"
            >
              {selectedProduct._id ? "Update Product" : "Add Product"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
