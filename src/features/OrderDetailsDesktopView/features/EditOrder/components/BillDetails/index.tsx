import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";

import { orderDetailsAtom } from "../../../../context/atoms";
import { editOrderAtom } from "../../context/atoms";
import getEditCartTotal from "../../utils/getEditCartTotal";
import styles from "./style.module.css";

const BillDetails = () => {
  const [editOrder] = useAtom(editOrderAtom);
  const [order] = useAtom(orderDetailsAtom);

  const total = React.useMemo(getEditCartTotal(editOrder), [
    editOrder.orderItems,
  ]);

  const toPay = React.useMemo(() => {
    return Number(total) - Number(order?.data?.total);
  }, [order, editOrder.orderItems]);

  return (
    <Box className={styles.container}>
      <Typography variant="body1">Bill Details: {}</Typography>
      <Typography variant="body2">Item Total: {total}</Typography>
      <Typography variant="body2">Total: {total}</Typography>
      <Typography variant="body2">
        Already Paid: {Number(order?.data?.total)}
      </Typography>
      <Typography variant="body2">To Pay: {toPay}</Typography>
    </Box>
  );
};
export default BillDetails;
