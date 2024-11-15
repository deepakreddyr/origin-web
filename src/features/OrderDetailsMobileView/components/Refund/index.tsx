/* eslint-disable react/no-unescaped-entities */
import { Box, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import React from "react";

import { orderDetailsAtom } from "../../context/atoms";
import { StyledHeadingTypography } from "../Styled/StyledHeadingTypography";

const Refund = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);

  return (
    <Box
      sx={{
        backgroundColor: "rgba(37, 135, 77, 0.12)",
        display: "flex",
        flexDirection: "column",
        // alignItems: 'center',
        border: "1px solid rgba(37, 135, 77, 0.2)",
        margin: " 0 1rem 1rem 1rem",
        borderRadius: "16px",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <StyledHeadingTypography
          sx={{
            marginBottom: "8px",
            color: "#25874D !important",
          }}
        >
          Refund
        </StyledHeadingTypography>

        <Typography
          sx={{
            fontSize: "14px !important",
            fontWeight: "500 !important",
            fontFamily: "Sofia Pro",
            color: "#25874D",
          }}
        >
          ₹ {orderDetails.data?.refunds?.amount}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontFamily: "Sofia Pro",
          fontSize: "13px",
          lineHeight: "15px",
          color: "rgba(35, 31, 32, 0.8)",
        }}
      >
        Your refund will be completed within 5-10 business days. Verify your
        bank statement if it's delayed.{" "}
      </Typography>
    </Box>
  );
};

export default Refund;
