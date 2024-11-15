import { Box, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import React from "react";

import { orderDetailsAtom } from "../../context/atoms";
import BannerContainerWrapper from "./BannerContainerWrapper";

const OrderStatusImageDesc = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);

  const orderCreatedAtTimestamp = orderDetails.data
    ? orderDetails.data.order_created_at * 1000
    : 0;
  const orderCreatedAtDate = new Date(orderCreatedAtTimestamp);

  const today = new Date();
  const isToday =
    orderCreatedAtDate.getDate() === today.getDate() &&
    orderCreatedAtDate.getMonth() === today.getMonth() &&
    orderCreatedAtDate.getFullYear() === today.getFullYear();

  const currentYear = today.getFullYear();
  const orderYear = orderCreatedAtDate.getFullYear();

  let formattedOrderCreatedAt;

  if (isToday) {
    formattedOrderCreatedAt = "Today";
  } else {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      ...(orderYear !== currentYear && { year: "numeric" }),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    formattedOrderCreatedAt = orderCreatedAtDate.toLocaleDateString(
      "en-US",
      options
    );
  }

  const renderReachingContent = () => {
    return (
      <BannerContainerWrapper>
        <Box>
          <Typography
            sx={{
              fontSize: "1rem",
              "@media(max-width: 992px)": {
                fontSize: "0.8rem",
              },
              // '@media(max-width: 767px)': {
              //   fontSize: '0.6rem',
              // },
            }}
          >
            Reaching
          </Typography>
        </Box>
      </BannerContainerWrapper>
    );
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        padding: "1rem",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "16px !important",
            fontWeight: "500",
            marginBottom: "0",
          }}
        >
          SLOT
        </Typography>
        {!!orderDetails.data?.delivery_type &&
        orderDetails.data?.delivery_type === "app" ? (
          <Typography
            sx={{
              fontSize: "14px!important",
              fontWeight: "600",
              marginTop: "0",
              lineHeight: "14px",
            }}
          >
            {orderDetails.data?.time_slot?.from} -{" "}
            {orderDetails.data?.time_slot?.to} | {formattedOrderCreatedAt}
          </Typography>
        ) : (
          <Typography
            sx={{
              fontSize: "14px!important",
              fontWeight: "500",
              marginTop: "0",
              lineHeight: "14px",
            }}
          >
            DELIVERED IN 60 MINS
          </Typography>
        )}
      </Box>
      {renderReachingContent()}
    </Box>
  );
};

export default OrderStatusImageDesc;
