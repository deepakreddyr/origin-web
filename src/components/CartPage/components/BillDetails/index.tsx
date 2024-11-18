import { Box, Divider, Typography } from "@mui/material";
import React from "react";

import useCartCalculation from "../../hooks/useCartCalculation";

interface Props {
  setToPay: any;
}

interface IBillDetails {
  title: string;
  value: string | number;
  isShow?: boolean;
  divider?: boolean;
  variant: "green" | "black";
}

const BillDetails = (props: Props) => {
  const { setToPay } = props;
  const { couponDiscount, isCouponApplied, subTotal, total, totalSavings } =
    useCartCalculation();

  React.useEffect(() => {
    setToPay(total);
  }, [total]);

  const billDetails: IBillDetails[] = [
    {
      title: "Item total",
      value: `₹${subTotal.toFixed(2)}`,
      variant: "black",
      isShow: true,
      divider: true,
    },
    {
      title: "Savings",
      value: `- ₹${totalSavings.toFixed(2)}`,
      variant: "green",
      isShow: totalSavings > 0,
      divider: !isCouponApplied,
    },
    {
      title: "Coupon Applied",
      value: `- ₹${couponDiscount.toFixed(2)}`,
      variant: "green",
      isShow: isCouponApplied,
      divider: true,
    },
    {
      title: "To Pay",
      value: `₹${total.toFixed(2)}`,
      variant: "black",
      isShow: true,
    },
  ];

  const renderBill = (bill: IBillDetails) => {
    let color = "#000000";
    switch (bill.variant) {
      case "green":
        color = "#25874D";
        break;

      default:
        color = "#000000";
        break;
    }
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            color,
          }}
        >
          <Typography>{bill.title}</Typography>
          <Typography>{bill.value}</Typography>
        </Box>
        {bill.divider && <Divider sx={{ ml: "-1rem", mr: "-1rem" }} />}
      </>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(242, 238, 228, 0.3)",
        display: "flex",
        flexDirection: "column",
        border: "2px solid #F2EEE4",
        padding: "1rem",

        margin: " 0.8rem 0.3rem 0.3rem 0.3rem",

        borderRadius: "16px",
      }}
    >
      <Typography component="h3" variant="body1" sx={{ fontWeight: 600 }}>
        BILL DETAILS
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          mt: "0.5rem",
        }}
      >
        {billDetails.filter((b) => b.isShow).map(renderBill)}
      </Box>
    </Box>
  );
};

export default BillDetails;
