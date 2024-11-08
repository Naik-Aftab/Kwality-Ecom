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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import useAuth from "../withauth";

function SingleProductList() {
  useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [token, setToken] = useState(null);

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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setImages([]);
  };

  // Update product details in modal
  const handleProductUpdate = async () => {
    const formData = new FormData();
    formData.append("name", selectedProduct.name);
    formData.append("description", selectedProduct.description);
    formData.append("regularPrice", selectedProduct.regularPrice);
    formData.append("salePrice", selectedProduct.salePrice);
    formData.append("category", selectedProduct.category._id);
    formData.append("isTopSeller", selectedProduct.isTopSeller || false);
    formData.append("weight[grams]", selectedProduct.weight.grams || "");
    formData.append("weight[pieces]", selectedProduct.weight.pieces || "");
    formData.append("weight[serves]", selectedProduct.weight.serves || "");

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

  // Handle changes in the product modal inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "grams" || name === "pieces" || name === "serves") {
      setSelectedProduct((prevProduct) => ({
        ...prevProduct,
        weight: {
          ...prevProduct.weight,
          [name]: value,
        },
      }));
    } else {
      setSelectedProduct({ ...selectedProduct, [name]: value });
    }
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Delete product
  const handleProductDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
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
    formData.append("isTopSeller", selectedProduct.isTopSeller || false);
    formData.append("weight[grams]", selectedProduct.weight.grams || "");
    formData.append("weight[pieces]", selectedProduct.weight.pieces || "");
    formData.append("weight[serves]", selectedProduct.weight.serves || "");

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
            Authorization: `Bearer ${token}`,
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
          Add Single Product
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
                        src={`${product.images[0]}`}
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

              <Box display="flex" gap={2}>
                <TextField
                  label="Weight (grams)"
                  fullWidth
                  name="grams"
                  value={selectedProduct.weight?.grams || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  label="Pieces"
                  fullWidth
                  name="pieces"
                  value={selectedProduct.weight?.pieces || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  label="serves"
                  fullWidth
                  name="serves"
                  value={selectedProduct.weight?.serves || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Box>

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                name="description"
                value={selectedProduct.description || ""}
                onChange={handleInputChange}
                margin="normal"
              />
              <Box display="flex" gap={2}>
                <TextField
                  label="Regular Price"
                  fullWidth
                  name="regularPrice"
                  type="number"
                  value={selectedProduct.regularPrice || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  label="Sale Price"
                  fullWidth
                  name="salePrice"
                  type="number"
                  value={selectedProduct.salePrice || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Box>

              <FormControl fullWidth margin="normal">
                <Select
                  value={selectedProduct.category?._id || ""}
                  onChange={(e) =>
                    setSelectedProduct((prev) => ({
                      ...prev,
                      category: categories.find(
                        (category) => category._id === e.target.value
                      ),
                    }))
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

              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedProduct.isTopSeller || false}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                        ...prev,
                        isTopSeller: e.target.checked,
                      }))
                    }
                    name="isTopSeller"
                    color="primary"
                  />
                }
                label="Top Seller Product"
              />

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ marginTop: "1rem" }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={
                selectedProduct._id ? handleProductUpdate : handleAddProduct
              }
              color="primary"
            >
              {selectedProduct._id ? "Update Product" : "Add Product"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default SingleProductList;
