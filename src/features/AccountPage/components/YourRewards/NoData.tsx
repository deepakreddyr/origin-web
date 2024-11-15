import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

import NoDataIcon from "/public/assets/svg/no-rewards.svg";

const NoData = () => {
  return (
    <Box
      className="no-data"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
        paddingTop: "24px",
        paddingBottom: "24px",
        margin: "auto",
      }}
    >
      <Image src={NoDataIcon} alt="" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          No Rewards found
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.60)" }}>
          Get rewards for all orders placed online or in store purchases...
        </Typography>
      </Box>
    </Box>
  );
};

export default NoData;
