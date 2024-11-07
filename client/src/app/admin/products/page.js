"use client"
import React, { useState } from 'react';
import { Tab, Tabs, Box, Typography } from '@mui/material';
import SingleProductList from './SingleProductList';
import CustomizedProductList from './CustomizedProductList';

function ProductTabs() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newTab) => {
    setSelectedTab(newTab);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Products List
      </Typography>
         
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Single Products" />
        <Tab label="Customized Products" />
      </Tabs>
      
      <Box sx={{ paddingTop: 2 }}>
        {selectedTab === 0 && <SingleProductList />}
        {selectedTab === 1 && <CustomizedProductList />}
      </Box>
    </Box>
  );
}

export default ProductTabs;
