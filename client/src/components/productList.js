"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export const ProductList = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === "loading") {
    return <p className="text-center text-xl">Loading...</p>;
  }

  if (status === "failed") {
    return <p className="text-center text-xl text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Top Selling Products
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
              image={`${process.env.NEXT_PUBLIC_API_BASE_URL}${product.images[0]}`}
              alt={product.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold", color: "red" }}
              >
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
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
                my={1}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through", fontWeight: "bold" }}
                >
                  {product.regularPrice} Rs
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  {product.salePrice} Rs
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "red", fontWeight: "bold" }}
              >
                Get Delivered in 2 Hours
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
              <Link href={`/products/${product._id}`} passHref>
                <Button
                  size="small"
                  sx={{
                    color: "white",
                    background:
                      "linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)", // Gradient background
                    borderRadius: 25, // Rounded corners
                    boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)", // Shadow effect
                    padding: "10px 20px",
                    fontWeight: "bold", // Bold font
                    transition: "0.3s ease", // Smooth transition
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #388e3c 30%, #1b5e20 90%)", // Darker gradient on hover
                      transform: "scale(1.05)", // Slightly scale up on hover
                      boxShadow: "0 5px 15px 2px rgba(0, 128, 0, .4)", // More pronounced shadow on hover
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
