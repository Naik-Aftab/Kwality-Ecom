'use client'; 
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from'../store/slices/productSlice'; 
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export const ProductList = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    // Dispatch the action to fetch products when the component loads
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-3xl font-bold mb-6">Top Selling Products</h1>
      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product._id}
            sx={{
              maxWidth: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "10px",
            }}
          >
            <CardMedia
              sx={{ height: 200, width: 200 }}
              image={product.imageUrl} // Use the image URL from the product
              title={product.name}
            />
            <CardContent sx={{ padding: '0px' }}>
              <Typography gutterBottom variant="h6" component="div">
                {product.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", padding: "0px 0px 10px 0px" }}>
                {product.description}
              </Typography>
              <Typography variant="h6" sx={{ fontSize: "800" }}>
                {product.price} Rs
              </Typography>
              <Typography variant="body2" sx={{ color: "red" }}>
                Get Delivered in 2 Hours
              </Typography>
            </CardContent>
            <CardActions>
            <Link href={`/products/${product._id}`} passHref>
                <Button size="small" sx={{ color: 'green', backgroundColor: 'lightgreen' }}>
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
