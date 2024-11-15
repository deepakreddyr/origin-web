import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";

import { orderDetailsAtom } from "../../../../context/atoms";
import styles from "./style.module.css";

const DeliveryMethod = () => {
  const [order] = useAtom(orderDetailsAtom);

  return (
    <Box className={styles["delivering-method"]}>
      <Typography
        variant="body2"
        component="h5"
        sx={{ fontWeight: 700, textTransform: "uppercase" }}
      >
        Selected Delivery Method
      </Typography>
      <Box
        sx={{
          padding: "1rem",
        }}
      >
        <Box>
          {!!order.data?.delivery_type &&
          order.data?.delivery_type === "app" ? (
            <Typography
              sx={{
                fontFamily: "Melts-Script-Rough",
                fontStyle: "italic !important",
                fontSize: "16px !important",
                fontWeight: "500",
                marginBottom: "0",
              }}
            >
              Fresh Tomorrow
            </Typography>
          ) : (
            <Typography
              sx={{
                fontFamily: "Melts-Script-Rough",
                fontStyle: "italic !important",
                fontSize: "16px !important",
                fontWeight: "500",
                marginBottom: "0",
              }}
            >
              Instant Today
            </Typography>
          )}

          {!!order.data?.delivery_type &&
          order.data?.delivery_type === "app" ? (
            <Typography
              sx={{
                fontSize: "12px!important",
                fontWeight: "500",
                marginTop: "0",
                lineHeight: "14px",
              }}
            >
              SELECTED SLOT {order.data?.time_slot?.from} -{" "}
              {order.data?.time_slot?.to}
            </Typography>
          ) : (
            <Typography
              sx={{
                fontSize: "12px!important",
                fontWeight: "500",
                marginTop: "0",
                lineHeight: "14px",
              }}
            >
              DELIVERED IN 60 MINS
            </Typography>
          )}
        </Box>
        {/* {renderETAContent()} */}
        {/* {renderReachingContent()} */}
      </Box>
    </Box>
  );
};

export default DeliveryMethod;
