import { Box, Typography } from "@mui/material";
import React from "react";

import RewardsDetailsTable from "./RewardsDetailsTable";

const BreakdownCoin = () => {
  return (
    <Box
      className="terms-use"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <Typography variant="body1" component="h4" sx={{ fontWeight: 600 }}>
        Breakdown of coins rewarded on app
      </Typography>
      <RewardsDetailsTable />
    </Box>
  );
};

export default BreakdownCoin;
