import { Box, Typography } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
// import { useAtomValue } from 'jotai';
import React from "react";

import { isRetryPaymentOpenAtom, orderDetailsAtom } from "../../context/atoms";
import { orderedItemsAtom } from "../../features/RetryPaymentPage/context/atoms";
import fabricateEditOrderItemsList from "../../utils/fabricateEditOrderItemsList";
// import { orderDetailsAtom } from '../../context/atoms';
import styles from "./styles.module.css";

const PaymentPending = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);
  const [, setOrderedItem] = useAtom(orderedItemsAtom);
  const [, setIsRetryPaymentOpen] = useAtom(isRetryPaymentOpenAtom);

  const onClick = async () => {
    setIsRetryPaymentOpen(true);

    const orderedItems = await fabricateEditOrderItemsList(
      orderDetails.data?.items
    );

    setOrderedItem(orderedItems);
  };

  const renderPaymentPending = () => {
    return (
      <Box className={styles["payment-pending-container"]}>
        <Box className={styles["payment-pending-details"]}>
          <Typography className={styles["payment-pending-heading"]}>
            Pending Payment
          </Typography>
          <Typography className={styles["payment-pending-text"]}>
            We’re awaiting confirmation on your payment, You can click on Retry
            payment to try again.
          </Typography>
        </Box>
        <Box className={styles["payment-pending-counter"]}>
          <button
            className={styles["payment-pending-retry-button"]}
            onClick={onClick}
          >
            Retry Payment
          </button>
          <button className={styles["payment-pending-pay-button"]}>
            Pay on Delivery
          </button>
        </Box>
      </Box>
    );
  };

  const renderPayOnline = () => {
    return (
      <Box className={styles["payment-pending-container"]}>
        <Box className={styles["payment-pending-details"]}>
          <Typography className={styles["payment-heading"]}>
            Avoid hassle of paying with cash!
          </Typography>
          <Typography className={styles["payment-text"]}>
            Pay online and make the delivery experience seamless
          </Typography>
        </Box>
        <Box className={styles["payment-pending-counter"]}>
          <button className={styles["pay-online"]} onClick={onClick}>
            Pay Online
          </button>
        </Box>
      </Box>
    );
  };

  let content = null;

  if (
    orderDetails.data?.status !== "Rejected by admin" &&
    orderDetails.data?.status !== "Delivered" &&
    orderDetails.data?.status !== "Not Delivered"
  ) {
    if (
      orderDetails?.data?.payment_method === "Razorpay" &&
      (orderDetails?.data?.payment_status === "pending" ||
        orderDetails?.data?.payment_status === "failed" ||
        orderDetails?.data?.payment_status === "partially_completed")
    ) {
      content = renderPaymentPending();
    } else if (orderDetails?.data?.payment_method === "Cash") {
      content = renderPayOnline();
    }
  }

  return <>{content}</>;
};

export default PaymentPending;
