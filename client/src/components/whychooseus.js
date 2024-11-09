import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import FastDeliveryIcon from '@mui/icons-material/LocalShipping'; // Example icon
import PriceCheckIcon from '@mui/icons-material/PriceCheck'; // Example icon
import VerifiedIcon from '@mui/icons-material/Verified'; // Example icon
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Example icon

const UspsSection = () => {
  return (
    <Box sx={{ padding: '2rem', backgroundColor: '#f9f9f9' }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Why Choose Us?
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 3, // Add gap between boxes
        }}
      >
        {/* Fastest Delivery USP */}
        <Box sx={{ flex: '1 1 22%', minWidth: '250px' }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: 'center'}}>
            <CardContent>
              <FastDeliveryIcon sx={{ fontSize: '3rem', color: '#4caf50' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '1rem' }}>
                Fastest Delivery
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Get your orders delivered in the fastest time possible!
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Cheapest Rate USP */}
        <Box sx={{ flex: '1 1 22%', minWidth: '250px' }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: 'center'}}>
            <CardContent>
              <PriceCheckIcon sx={{ fontSize: '3rem', color: '#ff9800' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '1rem' }}>
                Cheapest Rate
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                We offer the most affordable prices in the market.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* 100% Halal USP */}
        <Box sx={{ flex: '1 1 22%', minWidth: '250px' }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
            <CardContent>
              <VerifiedIcon sx={{ fontSize: '3rem', color: '#2196f3' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '1rem' }}>
                100% Halal
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                All our products are certified Halal for your peace of mind.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Anytime Delivery USP */}
        <Box sx={{ flex: '1 1 22%', minWidth: '250px' }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
            <CardContent>
              <AccessTimeIcon sx={{ fontSize: '3rem', color: '#f44336' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '1rem' }}>
                Anytime Delivery
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                We ensure delivery at your convenience, any time of the day.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default UspsSection;
