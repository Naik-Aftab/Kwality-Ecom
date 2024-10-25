"use client"
import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon,Button, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Logout icon
import Link from 'next/link';


const Sidebar = () => {
  const handleLogout = () => {
    // Clear the token (assuming it's stored in localStorage)
    localStorage.removeItem('token');

  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
      <Link href='/' className='flex justify-center'>
          <img src="/logo.png" alt="Logo" className="h-24" />
        </Link>
        {/* Place Link on ListItem */}
        <ListItem component={Link} href="/admin">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} href="/admin/orders">
          <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem component={Link} href="/admin/products">
          <ListItemIcon><InventoryIcon /></ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem component={Link} href="/admin/categories">
          <ListItemIcon><CategoryIcon /></ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItem>
        <ListItem component={Link} href="/admin/customers">
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Customers" />
        </ListItem>
      </List>
      <Divider />


      {/* Logout Button */}
      <div className="mt-auto p-4">
        <Link href="/login" onClick={handleLogout} style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<ExitToAppIcon />}
            fullWidth
          >
            Logout
          </Button>
        </Link>
      </div>

    </Drawer>
  );
};

export default Sidebar;
