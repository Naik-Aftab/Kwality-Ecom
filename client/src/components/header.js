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
  Button,
  Box,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const Header = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  useEffect(() => setIsMounted(true), []);

  const handleSearch = useCallback(async () => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?search=${searchTerm}`
      );
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, handleSearch]);

  return (
    <header className="container">
      <AppBar
        position="static"
        elevation={0}
        sx={{ background: "#fff", padding: "8px 0px" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Link href="/">
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{ width: isMobile ? 60 : 90, objectFit: "contain" }}
            />
          </Link>

          {/* Search Bar */}
          <Box
            sx={{
              position: "relative",
              width: { xs: "60%", sm: "50%" },
              display: "flex",
              alignItems: "center",
            }}
          >
            <InputBase
              placeholder="Search Products …"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: "#e0e0e0",
                borderRadius: 50,
                padding: "8px 16px",
                width: "100%",
                pr: 5, // Add right padding to make space for the search icon
              }}
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton
              sx={{
                position: "absolute",
                right: 4, // Adjust as necessary to bring it closer to the edge
                top: "50%",
                transform: "translateY(-50%)",
                color: "#000",
              }}
              onClick={handleSearch}
            >
              {loading ? <CircularProgress size={24} /> : <SearchIcon />}
            </IconButton>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && searchTerm && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  marginTop: 1,
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 2,
                  boxShadow: 3,
                  zIndex: 10,
                  maxHeight: 240,
                  overflowY: "auto",
                }}
              >
                {searchResults.map((product) => (
                  <Link
                    href={`/products/${product._id}`}
                    key={product._id}
                    legacyBehavior
                  >
                    <a
                      style={{
                        display: "flex",
                        padding: "8px",
                        color: "#4a4a4a",
                        textDecoration: "none",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={`${product.images[0]}`}
                        alt={product.name}
                        sx={{
                          width: 28,
                          height: 28,
                          objectFit: "cover",
                          borderRadius: 1,
                          marginRight: 1,
                        }}
                      />
                      {product.name}
                    </a>
                  </Link>
                ))}
              </Box>
            )}
          </Box>

          {/* Cart Icon */}
          <IconButton
            color="inherit"
            sx={{ color: "black", width: "50px", height: "50px" }}
          >
            <Link href="/cart" style={{ position: "relative" }}>
              <ShoppingCartOutlinedIcon />
              {isMounted && totalQuantity > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 16,
                    height: 16,
                    fontSize: 10,
                    fontWeight: "bold",
                    backgroundColor: "#d32f2f",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {totalQuantity}
                </Box>
              )}
            </Link>
          </IconButton>

          {/* Bulk Order Button */}
          {!isMobile && (
            <Link href="/bulkOrder" passHref>
              <Button
                size="small"
                sx={{
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
                Bulk Order
              </Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
