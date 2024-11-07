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
  TextField,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import useAuth from "../withauth";

function CustomizedProductList() {
  useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [token, setToken] = useState(null);
  const [variations, setVariations] = useState([{ weight: "", price: "" }]);

  useEffect(() => {
    // Fetch token from localStorage and set it in the state
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Fetch products and categories if token is available
    if (storedToken) {
      fetchProducts();
      fetchCategories();
    }
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/custom-products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data.products);
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Open modal with selected product details
  const handleOpen = (product) => {
    setSelectedProduct({
      ...product,
      weight: product.weight || { grams: "", pieces: "", serves: "" },
    });
    setImages([]);
    setVariations(product.variations || [{ weight: "", price: "" }]);
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setImages([]);
    setVariations([{ weight: "", price: "" }]);
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleAddVariation = () => {
    setVariations([...variations, { weight: "", price: "" }]);
  };

  const handleVariationChange = (index, key, value) => {
    const newVariations = [...variations];
    newVariations[index][key] = value;
    setVariations(newVariations);
  };

  const handleProductDelete = async (productId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (isConfirmed) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/custom-products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchProducts(); // Refresh the product list
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  const handleAddCustomProduct = async () => {
    const formData = new FormData();
    formData.append("name", selectedProduct.name);
    formData.append("description", selectedProduct.description);
    formData.append("category", selectedProduct.category._id);
    variations.forEach((variation, index) => {
      formData.append(`variations[${index}][weight]`, variation.weight);
      formData.append(`variations[${index}][price]`, variation.price);
    });
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/custom-products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
      handleClose();
    } catch (err) {
      console.error("Error adding custom product:", err);
    }
  };

  const handleCustomProductUpdate = async () => {
    const formData = new FormData();
    formData.append("name", selectedProduct.name);
    formData.append("description", selectedProduct.description);
    formData.append("category", selectedProduct.category._id);
    variations.forEach((variation, index) => {
      formData.append(`variations[${index}][weight]`, variation.weight);
      formData.append(`variations[${index}][price]`, variation.price);
    });
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/custom-products/${selectedProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
      handleClose();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="left" mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedProduct({});
            setOpen(true);
          }}
          sx={{ mr: 2 }}
        >
          Add Customize Product
        </Button>
      </Box>

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
                <strong>Weights</strong>
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
            ) : Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        width={50}
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                  <TableCell>
                    {product.variations
                      ? product.variations
                          .map((variation) => variation.weight) // Extract weights
                          .join(", ") // Join the weights with commas
                      : "No Weights Available"}
                  </TableCell>
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
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found.
                </TableCell>
              </TableRow>
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
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
                margin="normal"
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                name="description"
                value={selectedProduct.description || ""}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    description: e.target.value,
                  })
                }
                margin="normal"
              />

              <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                <Select
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
                >
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Product variations */}
              {variations.map((variation, index) => (
                <Box
                  key={index}
                  display="flex"
                  gap={2}
                  alignItems="center"
                  width="100%"
                  mb={2}
                >
                  <TextField
                    label="Weight"
                    value={variation.weight || ""}
                    onChange={(e) =>
                      handleVariationChange(index, "weight", e.target.value)
                    }
                    fullWidth
                  />
                  <TextField
                    label="Price"
                    value={variation.price || ""}
                    onChange={(e) =>
                      handleVariationChange(index, "price", e.target.value)
                    }
                    fullWidth
                  />
                </Box>
              ))}

              <Button
                variant="outlined"
                onClick={handleAddVariation}
                sx={{ mt: 2 }}
              >
                Add Variation
              </Button>

              <Box mt={2}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                {images.length > 0 && (
                  <Typography>Selected Images: {images.length}</Typography>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={
                selectedProduct._id
                  ? handleCustomProductUpdate
                  : handleAddCustomProduct
              }
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

export default CustomizedProductList;
