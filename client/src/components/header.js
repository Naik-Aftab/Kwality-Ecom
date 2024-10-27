import { useSelector } from "react-redux";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  useEffect(() => setIsMounted(true), []);

  // Debounce search handler for better performance
  const handleSearch = useCallback(async () => {
    if (!searchTerm) {
      setSearchResults([]); // Clear search results if input is empty
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?search=${searchTerm}`
      );
      setSearchResults(data);
      console.log("Search results:", data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Debounce effect for search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, handleSearch]);

  return (
    <header>
      <AppBar position="static" className="bg-white" elevation={0}>
        <Toolbar className="flex justify-around items-center">
          <Link href="/">
            <img src="/logo.png" alt="Logo" className="h-20" />
          </Link>

          {/* Search Bar */}
          <div className="relative w-1/2">
            <InputBase
              placeholder="Search Products …"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-200 rounded-full py-2 px-4 w-full"
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton
              className="absolute right-0 top-0 mt-1 mr-1"
              onClick={handleSearch}
            >
              {loading ? <CircularProgress size={24} /> : <SearchIcon />}
            </IconButton>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && searchTerm && (
              <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    href={`/products/${product._id}`}
                    key={product._id}
                    legacyBehavior
                  >
                    <a className="flex p-2 hover:bg-gray-100 text-gray-800">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${product.images[0]}`}
                        alt={product.name}
                        className="w-7 h-7 object-cover rounded-md mr-2"
                      />
                      {product.name}
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <IconButton color="inherit" className="text-black">
            <Link href="/cart" className="relative">
              <ShoppingCartOutlinedIcon />
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
