/* eslint-disable jsx-a11y/alt-text */
import { Box, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import React from "react";

import {
  DeliveryStatus,
  DeliveryStatusDesc,
  DeliveryStatusText,
} from "../../constants/DeliveryStatus";
import { orderDetailsAtom } from "../../context/atoms";
import styles from "./styles.module.css";

const OrderStatusText = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);
  const orderDetailsData = React.useMemo((): {
    title: string;
    desc: string;
  } => {
    const lastStatus =
      !!orderDetails?.data?.status_list &&
      orderDetails?.data?.status_list[orderDetails.data.status_list.length - 1];

    if (!lastStatus) {
      return {
        title: DeliveryStatusText.OUT_FOR_DELIVERY,
        desc: DeliveryStatusDesc.OUT_FOR_DELIVERY,
      };
    }
    const currentStatus =
      lastStatus.status_message.toLowerCase() || "out for delivery";

    switch (currentStatus) {
      case DeliveryStatus.PENDING:
        return {
          title: DeliveryStatusText.OUT_FOR_DELIVERY,
          desc: DeliveryStatusDesc.OUT_FOR_DELIVERY,
        };
      case DeliveryStatus.ACCEPTED:
        return {
          title: DeliveryStatusText.ACCEPTED,
          desc: DeliveryStatusDesc.ACCEPTED,
        };
      case DeliveryStatus.REJECTED_BY_ADMIN:
        return {
          title: DeliveryStatusText.REJECTED_BY_ADMIN,
          desc: DeliveryStatusDesc.REJECTED_BY_ADMIN,
        };
      case DeliveryStatus.PROCESSING:
        return {
          title: DeliveryStatusText.PROCESSING,
          desc: DeliveryStatusDesc.PROCESSING,
        };
      case DeliveryStatus.PREPARING_FOR_DISPATCH:
        return {
          title: DeliveryStatusText.PREPARING_FOR_DISPATCH,
          desc: DeliveryStatusDesc.PREPARING_FOR_DISPATCH,
        };
      case DeliveryStatus.OUT_FOR_DELIVERY:
        return {
          title: DeliveryStatusText.OUT_FOR_DELIVERY,
          desc: DeliveryStatusDesc.OUT_FOR_DELIVERY,
        };
      case DeliveryStatus.ON_THE_WAY:
        return {
          title: DeliveryStatusText.ON_THE_WAY,
          desc: DeliveryStatusDesc.ON_THE_WAY,
        }; // need update image
      case DeliveryStatus.NEAR_BY:
        return {
          title: DeliveryStatusText.NEAR_BY,
          desc: DeliveryStatusDesc.NEAR_BY,
        }; // need update image
      case DeliveryStatus.DELIVERED:
        return {
          title: DeliveryStatusText.DELIVERED,
          desc: DeliveryStatusDesc.DELIVERED,
        };
      case DeliveryStatus.NOT_DELIVERED:
        return {
          title: DeliveryStatusText.NOT_DELIVERED,
          desc: DeliveryStatusDesc.NOT_DELIVERED,
        };

      default:
        return {
          title: DeliveryStatusText.OUT_FOR_DELIVERY,
          desc: DeliveryStatusDesc.OUT_FOR_DELIVERY,
        };
    }
  }, [orderDetails]);

  const renderBottomProgressBar = () => {
    return <div className={styles.progress} />;
  };

  const renderCircles = () => {
    return (
      <div className={styles.circleMaster}>
        <div className={styles.circle01} />
        <div className={styles.circle02} />
        <div className={styles.circle03} />
        <div className={styles.circle04} />
      </div>
    );
  };

  return (
    <>
      <Box
        // sx={{
        //   width: '375px',
        //   marginTop: '0.5rem',
        // }}
        className={styles["progress-bar"]}
      >
        <Typography
          sx={{
            fontStyle: "Lexend",
            fontSize: "14px !important",
            fontWeight: "500",
          }}
        >
          {orderDetailsData.title}
        </Typography>
        <Typography
          sx={{
            fontStyle: "Lexend",
            fontWeight: "400",
            fontSize: "12px",
            textAlign: "justify",
            display: "flex",
            alignItems: "center",
            color: "#FFFFFFCC",
          }}
        >
          {orderDetailsData.desc}
        </Typography>
        {/* {renderBottomProgressBar()} */}
      </Box>
      {/* {renderCircles()} */}
    </>
  );
};

export default OrderStatusText;
