import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export const Cta = () => {
  return (
    <Box
      sx={{
        backgroundImage: "url(doodle-bg.png)",
        backgroundColor: "#ffe9e9f0",
        height: "300px",
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        overflow: "hidden",
        borderRadius: 2,
        my: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box sx={{ py: 5 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 2,
            fontWeight: "bold",
          }}
        >
          We Deliver the Next Day from 10:00 AM to 08:00 PM
        </Typography>

        <Link href="tel:+91111111111" passHref>
          <Button
            sx={{
              background: "linear-gradient(to right, #3b82f6, #2563eb)",
              color: "white",
              px: 3,
              py: 1.5,
              borderRadius: 1,
              fontWeight: "medium",
              boxShadow: 3,
              transition: "transform 0.3s ease-in-out, background-color 0.3s",
              "&:hover": {
                background: "linear-gradient(to right, #60a5fa, #3b82f6)",
                transform: "scale(1.05)",
              },
            }}
          >
            Call Now
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
