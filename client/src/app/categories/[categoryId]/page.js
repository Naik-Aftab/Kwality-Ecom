"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import Header from "@/components/header";
import BoltIcon from "@mui/icons-material/Bolt";
import Footer from "@/components/footer";


const CategoryProducts = () => {
  const {categoryId} = useParams(); // Ensure this is available
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { 
    if (categoryId) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${categoryId}/products`);
          setProducts(response.data);
          // console.log("Products for category:", response.data);
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
      <>
        <Header />
        <div className="container py-5 text-center">
          <Typography variant="h4" className="mb-4">
            No Products Available
          </Typography>
          <Typography variant="body1" className="mb-4">
            Sorry, there are no products in this category at the moment.
          </Typography>
          <Typography variant="body1" className="mb-4">
            Please check back later or explore other categories.
          </Typography>
          <Link href="/" passHref>
            <Button
              variant="contained"
              sx={{
                background: "#D32F2F",
                color: "white",
                "&:hover": { background: "#B71C1C" },
              }}
            >
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
    <Header />   
    <div className="container py-5">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Products in this Category
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {products.map((product) => (
          <Link href={`/products/${product._id}`} passHref>
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
            image={`${product.images[0]}`}
            alt={product.name}
            sx={{ objectFit: "cover" }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {[
                product.weight?.grams && `${product.weight.grams}`,
                product.weight?.pieces && `${product.weight.pieces}`,
                product.weight?.serves && ` ${product.weight.serves}`,
              ]
                .filter(Boolean)
                .join(" | ")}
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
                ₹{product.regularPrice}
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold", color: "#C00000" }}
              >
                ₹{product.salePrice}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "green", fontWeight: "bold" }}
            >
              {" "}
              <BoltIcon sx={{ color: "yellow" }} />
              Get Delivered in 2 Hours
            </Typography>

              <Button
                size="small"
                sx={{
                  marginTop: "15px",
                  color: "white",
                  background:
                    "linear-gradient(45deg, #D32F2F 30%, #C00000 90%)",
                  borderRadius: 25,
                  boxShadow: "0 3px 5px 2px rgba(192, 0, 0, .3)",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  transition: "0.3s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #B71C1C 30%, #8B0000 90%)",
                    transform: "scale(1.05)",
                    boxShadow: "0 5px 15px 2px rgba(128, 0, 0, .4)",
                  },
                }}
              >
                Add To Cart
              </Button>            
          </CardContent>         
        </Card>
        </Link>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CategoryProducts;
