import { Box, Typography } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import React, { useState } from "react";

import Watch from "../../assets/editWatch.svg";
import { isEditOrderIsOpen, orderDetailsAtom } from "../../context/atoms";
import { editOrderAtom } from "../../features/EditOrder/context/atoms";
import fabricateEditOrderItemsList from "../../utils/fabricateEditOrderItemsList";
import styles from "./styles.module.css";
import {
  calculateEditOrderTime,
  formatDuration,
} from "../../../OrderDetailsMobileView/components/EditOrderCounter";
interface EditOrderCounterProps {
  orderCreatedAt: number;
  editOrderTimeInSeconds: number;
  orderId: number;
}
const EditOrderCounter: React.FC<EditOrderCounterProps> = ({
  orderCreatedAt,
  editOrderTimeInSeconds,
  orderId,
}) => {
  const [, setIsOpen] = useAtom(isEditOrderIsOpen);
  const [, setEditOrder] = useAtom(editOrderAtom);
  const orderDetails = useAtomValue(orderDetailsAtom);

  const [remainingTime, setRemainingTime] = useState(
    calculateEditOrderTime(orderCreatedAt, editOrderTimeInSeconds)
  );

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => Math.max(0, prevTime - 1));
    }, 1000); // 1000 milliseconds = 1 second

    return () => {
      clearInterval(intervalId);
    };
  }, [orderCreatedAt, editOrderTimeInSeconds]);

  if (remainingTime === 0) return <></>;

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const onClick = async () => {
    setIsOpen(true);

    const orderedItems = await fabricateEditOrderItemsList(
      orderDetails.data?.items
    );
    setEditOrder((prevOrder) => ({ ...prevOrder, orderItems: orderedItems }));
  };

  return (
    <Box className={styles["edit-order-counter-container"]}>
      <Box className={styles["edit-order-counter-details"]}>
        <Typography className={styles["edit-order-counter-heading"]}>
          Want to modify this order?
        </Typography>
        <Typography className={styles["edit-order-counter-text"]}>
          We made it possible to add/Remove items from this order for a time
          period and get it delivered at together{" "}
        </Typography>
      </Box>
      <Box className={styles["edit-order-counter"]}>
        <Box className={styles["edit-order-counter-timer"]}>
          <Image src={Watch} alt="watch" />
          <Typography className={styles["edit-order-counter-timer-text"]}>
            {`Available for ${formatDuration(minutes, seconds)}`}
          </Typography>
        </Box>
        <button className={styles["edit-order-button"]} onClick={onClick}>
          Edit Order
        </button>
      </Box>
    </Box>
  );
};

export default EditOrderCounter;
