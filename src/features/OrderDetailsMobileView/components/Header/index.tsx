import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

import BackImage from "../../assets/back.svg";

const OrderStatusHeader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
      }}
    >
      <Box
        sx={{
          color: "#000000",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Image src={BackImage} alt="back" />
        <Typography
          sx={{
            marginLeft: "1rem",
            fontFamily: "Lexend",
            fontWeight: "500",
            fontSize: "18px!important",
          }}
        >
          Order Status
        </Typography>
      </Box>

      <Typography
        sx={{
          fontFamily: "Lexend",
          fontWeight: "500",
          fontSize: "14px!important",
          color: "#00855B",
        }}
      >
        HELP
      </Typography>
    </Box>
  );
};

export default OrderStatusHeader;
