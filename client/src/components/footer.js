import React from 'react';
import { Container, Typography, Link, Box } from '@mui/material';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer>
      <Box sx={{ backgroundColor: '#1F2937', color: '#FFFFFF', pt: 8, pb: 4 }}>
        <Container>
          <Box gap={3} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 4 }}>
            
            {/* About Us Section */}
            <Box sx={{ flex: 1, mb: { xs: 4, sm: 0 } }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                About Us
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                We are a leading Chicken Seller platform providing a wide range of products at unbeatable prices. Join us on our journey to deliver quality and convenience to your doorstep.
              </Typography>
            </Box>
            
            {/* Quick Links Section */}
            <Box sx={{ flex: 1, mb: { xs: 4, sm: 0 } }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quick Links
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                <li>
                  <Link href="/" sx={{ color: '#D1D5DB', '&:hover': { color: '#FFFFFF' }, textDecoration: 'none', transition: 'color 0.2s' }}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" sx={{ color: '#D1D5DB', '&:hover': { color: '#FFFFFF' }, textDecoration: 'none', transition: 'color 0.2s' }}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" sx={{ color: '#D1D5DB', '&:hover': { color: '#FFFFFF' }, textDecoration: 'none', transition: 'color 0.2s' }}>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" sx={{ color: '#D1D5DB', '&:hover': { color: '#FFFFFF' }, textDecoration: 'none', transition: 'color 0.2s' }}>
                    Contact
                  </Link>
                </li>
              </Box>
            </Box>

            {/* Follow Us Section */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" sx={{ color: '#D1D5DB', '&:hover': { color: '#FFFFFF' }, transition: 'color 0.2s' }}>
                  <Facebook fontSize="large" />
                </Link>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" sx={{ color: '#D1D5DB', '&:hover': { color: '#FFFFFF' }, transition: 'color 0.2s' }}>
                  <Instagram fontSize="large" />
                </Link>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" sx={{ color: '#D1D5DB', '&:hover': { color: '#FFFFFF' }, transition: 'color 0.2s' }}>
                  <Twitter fontSize="large" />
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Copyright Notice */}
          <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid', borderColor: '#4B5563' }}>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              &copy; {new Date().getFullYear()} Kwality Chicken. All Rights Reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
