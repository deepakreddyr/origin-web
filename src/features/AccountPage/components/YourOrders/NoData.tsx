import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

import NoDataIcon from "/public/assets/images/noOrder.png";

const NoData = () => {
  return (
    <Box
      className="no-data "
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
        paddingTop: "20px",
        paddingBottom: "20px",
        margin: "auto",
        height: "70vh",
      }}
    >
      <Box sx={{ width: "4.1vw", height: "4.1vw" }}>
        <Image src={NoDataIcon} alt="" />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontFamily: "SofiaPro", fontSize: "16px" }}
        >
          No orders found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#00000099",
            fontWeight: 500,
            fontFamily: "SofiaPro",
            fontSize: "14px",
            lineHeight: 1,
          }}
        >
          Your past orders and ongoing orders are shown here...
        </Typography>
      </Box>
    </Box>
  );
};

export default NoData;
