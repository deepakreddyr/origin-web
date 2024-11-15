/* eslint-disable react/no-unescaped-entities */
import { Box, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import React from "react";

import { orderDetailsAtom } from "../../context/atoms";
import styles from "./styles.module.css";

declare global {
  interface Window {
    App?: any;
    webkit: any;
  }
}

interface PaymentPendingProps {
  orderId: number | undefined;
  total: number | undefined;
}

const PaymentPending: React.FC<PaymentPendingProps> = ({ orderId, total }) => {
  const orderDetails = useAtomValue(orderDetailsAtom);

  const checkDeviceForAndroidRetryPayment =
    typeof window !== "undefined" && window.App && window.App.retryPayment;

  const checkDeviceForIOSRetryPayment =
    typeof window !== "undefined" &&
    window.webkit &&
    window.webkit.messageHandlers &&
    window.webkit.messageHandlers.retryPayment;

  const checkDeviceForAndroidPayOnDelivery =
    typeof window !== "undefined" && window.App && window.App.payOnDelivery;

  const checkDeviceForIOSPayOnDelivery =
    typeof window !== "undefined" &&
    window.webkit &&
    window.webkit.messageHandlers &&
    window.webkit.messageHandlers.payOnDelivery;

  const checkDeviceForAndroidPayOnline =
    typeof window !== "undefined" && window.App && window.App.payOnline;

  const checkDeviceForIOSPayOnline =
    typeof window !== "undefined" &&
    window.webkit &&
    window.webkit.messageHandlers &&
    window.webkit.messageHandlers.payOnline;

  const renderPayOnline = () => {
    return (
      <Box className={styles.paymentContainer}>
        <Box className={styles.paymentDetails}>
          <Typography className={styles.paymentHeading}>
            Avoid hassle of paying with cash!
          </Typography>
          <Typography className={styles.paymentText}>
            Pay online and make the delivery experience seamless
          </Typography>
        </Box>
        <Box className={styles.paymentBtnContainer}>
          <button
            className={styles.payOnline}
            onClick={() => {
              if (orderId !== undefined && total !== undefined) {
                if (checkDeviceForAndroidPayOnline) {
                  window.App.payOnline(orderId.toString(), total);
                } else if (checkDeviceForIOSPayOnline) {
                  const messageToPost = {
                    total: total.toString(),
                    orderId: orderId.toString(),
                  };
                  window.webkit.messageHandlers.payOnline.postMessage(
                    messageToPost
                  );
                }
              }
            }}
          >
            Pay Online
          </button>
        </Box>
      </Box>
    );
  };

  const renderPaymentPending = () => {
    return (
      <Box className={styles.paymentContainer}>
        <Box className={styles.paymentDetails}>
          <Typography className={styles.paymentHeading}>
            Payment pending!
          </Typography>
          <Typography className={styles.paymentText}>
            Our payment didn't go through, please click on Retry Payment to try
            again
          </Typography>
        </Box>
        <Box className={styles.paymentBtnContainer}>
          <button
            className={styles.paymentRetry}
            onClick={() => {
              if (orderId !== undefined && total !== undefined) {
                if (checkDeviceForAndroidRetryPayment) {
                  window.App.retryPayment(orderId.toString(), total);
                } else if (checkDeviceForIOSRetryPayment) {
                  const messageToPost = {
                    total: total.toString(),
                    orderId: orderId.toString(),
                  };
                  window.webkit.messageHandlers.retryPayment.postMessage(
                    messageToPost
                  );
                }
              }
            }}
          >
            Retry Payment
          </button>

          <button
            className={styles.paymentButton}
            onClick={() => {
              if (orderId !== undefined && total !== undefined) {
                if (checkDeviceForAndroidPayOnDelivery) {
                  window.App.payOnDelivery(orderId.toString(), total);
                } else if (checkDeviceForIOSPayOnDelivery) {
                  const messageToPost = {
                    total: total.toString(),
                    orderId: orderId.toString(),
                  };
                  window.webkit.messageHandlers.payOnDelivery.postMessage(
                    messageToPost
                  );
                }
              }
            }}
          >
            Pay on delivery
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

  return content;
};

export default PaymentPending;
