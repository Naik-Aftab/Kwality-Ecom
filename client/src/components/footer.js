import React from 'react';
import { Container, Grid, Typography, Link } from '@mui/material';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white ">
      <Container className='py-8'>
        <Grid container spacing={4}>
          {/* About Us Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h5" gutterBottom className="font-bold">
              About Us
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              We are a leading eCommerce platform providing a wide range of products at unbeatable prices. Join us on our journey to deliver quality and convenience to your doorstep.
            </Typography>
          </Grid>
          
          {/* Customer Service Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h5" gutterBottom className="font-bold">
              Customer Service
            </Typography>
            <ul className="list-none p-0 space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition duration-200 no-underline">Contact Us</Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition duration-200 no-underline">FAQ</Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition duration-200 no-underline">Returns</Link>
              </li>
            </ul>
          </Grid>

          {/* Follow Us Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h5" gutterBottom className="font-bold">
              Follow Us
            </Typography>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-200">
                <Facebook fontSize="large" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-200">
                <Instagram fontSize="large" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-200">
                <Twitter fontSize="large" />
              </Link>
            </div>
          </Grid>
        </Grid>
      </Container>

      {/* Copyright Notice */}
      <div className="text-center py-4 border-t border-gray-700">
        <Typography variant="body2" className="text-gray-400">
          &copy; {new Date().getFullYear()} Kwality Chicken. All Rights Reserved.
        </Typography>
      </div>
    </footer>
  );
};

export default Footer;
