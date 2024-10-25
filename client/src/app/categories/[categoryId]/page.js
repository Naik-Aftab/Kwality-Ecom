"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";

const CategoryProducts = () => {
  const categoryId = useParams(); // Ensure this is available
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { 
    if (categoryId) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${categoryId}/products`);
          setProducts(response.data);
          console.log("Products for category:", response.data);
        } catch (error) {
          setError("Failed to fetch products.");
          console.error("Error fetching products:", error); // Improved logging
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [categoryId]); // Only run when categoryId changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Products in this Category
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {products.map((product) => (
          <Card
            key={product._id}
            sx={{
              maxWidth: 345,
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              boxShadow: 3,
              borderRadius: 2,
              overflow: "hidden",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={`${process.env.NEXT_PUBLIC_API_BASE_URL}${product.images[0]}`} // Assuming this is correct
              alt={product.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "red" }}>
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  my: 1,
                }}
              >
                {product.description}
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} my={1}>
                <Typography variant="body1" color="text.secondary" sx={{ textDecoration: "line-through", fontWeight: "bold" }}>
                  {product.regularPrice} Rs
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                  {product.salePrice} Rs
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "red", fontWeight: "bold" }}>
                Get Delivered in 2 Hours
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
              <Link href={`/products/${product._id}`} passHref>
                <Button
                  size="small"
                  sx={{
                    color: "white",
                    background: "linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)",
                    borderRadius: 25,
                    boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                    padding: "10px 20px",
                    fontWeight: "bold",
                    transition: "0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(45deg, #388e3c 30%, #1b5e20 90%)",
                      transform: "scale(1.05)",
                      boxShadow: "0 5px 15px 2px rgba(0, 128, 0, .4)",
                    },
                  }}
                >
                  Order Now
                </Button>
              </Link>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;
