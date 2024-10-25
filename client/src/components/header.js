import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { AppBar, Toolbar, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);  // To track if the component is mounted
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  useEffect(() => {
    // Ensures this component only renders on the client side
    setIsMounted(true);
  }, []);

  return (
    <header className="">
       <AppBar position="static" className="bg-white" elevation={0}>
      <Toolbar className="flex justify-around items-center">
        {/* Logo */}
        <Link href='/'>
          <img src="/logo.png" alt="Logo" className="h-20" />
        </Link>

        {/* Search Bar */}
        <div className="relative w-1/2">
          <InputBase
            placeholder="Search Products …"
            inputProps={{ 'aria-label': 'search' }}
            className="bg-gray-200 rounded-full py-2 px-4 w-full"
          />
          <IconButton className="absolute right-0 top-0 mt-1 mr-1">
            <SearchIcon />
          </IconButton>
        </div>

        {/* Cart Icon */}
        <IconButton color="inherit" className="text-black">
        <Link href="/cart" className="relative">
          <ShoppingCartOutlinedIcon/>
            
            {isMounted && totalQuantity > 0 && (
              <span className="absolute top-0 right-0 inline-block w-4 h-4 text-xs font-semibold text-white bg-red-600 rounded-full text-center">
                {totalQuantity}
              </span>
            )}
          </Link>
        </IconButton>
      </Toolbar>
    </AppBar>

    </header>
  );
};

export default Header;
