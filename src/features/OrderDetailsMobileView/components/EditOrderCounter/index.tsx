import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import Watch from "../../assets/editWatch.svg";
import styles from "./styles.module.css";

declare global {
  interface Window {
    App?: any;
    webkit: any;
  }
}

interface EditOrderCounterProps {
  orderCreatedAt: number;
  editOrderTimeInSeconds: number;
  orderId: number;
}

export function formatDuration(minutes: number, seconds: number): string {
  const parts: string[] = [];

  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  }

  if (minutes === 0) {
    parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);
  }

  return parts.join(", ");
}

export function calculateEditOrderTime(
  orderCreatedAt: number,
  editOrderTimeInSeconds: number
) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const editOrderTimestamp = orderCreatedAt + editOrderTimeInSeconds;
  const remainingTimeInSeconds = editOrderTimestamp - currentTimestamp;

  return Math.max(0, remainingTimeInSeconds);
}

const EditOrderCounter: React.FC<EditOrderCounterProps> = ({
  orderCreatedAt,
  editOrderTimeInSeconds,
  orderId,
}) => {
  const [remainingTime, setRemainingTime] = useState(
    calculateEditOrderTime(orderCreatedAt, editOrderTimeInSeconds)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => Math.max(0, prevTime - 1));
    }, 1000); // 1000 milliseconds = 1 second

    return () => {
      clearInterval(intervalId);
    };
  }, [orderCreatedAt, editOrderTimeInSeconds]);

  const checkDeviceForAndroid = window.App && window.App.editOrder;

  const checkDeviceForIOS =
    window.webkit &&
    window.webkit.messageHandlers &&
    window.webkit.messageHandlers.editOrder;

  if (remainingTime === 0) return <></>;

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <Box className={styles["edit-order-counter-container"]}>
      <Box className={styles["edit-order-counter-details"]}>
        <Typography className={styles["edit-order-counter-heading"]}>
          Want to modify this order?
        </Typography>
        <Typography className={styles["edit-order-counter-text"]}>
          We made it possible to add/remove items from this order for a limited
          time period and get it delivered together.
        </Typography>
      </Box>
      <Box className={styles["edit-order-counter"]}>
        <Box className={styles["edit-order-counter-timer"]}>
          <Image src={Watch} alt="watch" />
          <Typography className={styles["edit-order-counter-timer-text"]}>
            {`Available for ${formatDuration(minutes, seconds)}`}
          </Typography>
        </Box>
        <button
          className={styles["edit-order-button"]}
          onClick={() => {
            if (checkDeviceForAndroid) {
              window.App.editOrder(orderId.toString());
            } else if (checkDeviceForIOS) {
              window.webkit.messageHandlers.editOrder.postMessage(
                orderId.toString()
              );
            }
          }}
        >
          EDIT ORDER
        </button>
      </Box>
    </Box>
  );
};

export default EditOrderCounter;
