import { Box, Typography } from "@mui/material";

import styles from "./styles.module.css";
import { StyledHeadingTypography } from "../../../OrderDetailsMobileView/components/Styled/StyledHeadingTypography";

const RefundDetails = ({ amount }: { amount: string | number }) => {
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
          ₹ {amount}
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
        {`Your refund will be completed within 5-10 business days. Verify your
        bank statement if it's delayed. `}
      </Typography>
    </Box>
  );
};

export default RefundDetails;
