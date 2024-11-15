import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";

import { orderDetailsAtom } from "../../../../context/atoms";
import { editOrderAtom } from "../../../EditOrder/context/atoms";
import getEditCartTotal from "../../../EditOrder/utils/getEditCartTotal";

const CartValue = () => {
  const [editOrder] = useAtom(editOrderAtom);
  const [order] = useAtom(orderDetailsAtom);

  const total = React.useMemo(getEditCartTotal(editOrder), [
    editOrder.orderItems,
  ]);

  const toPay = React.useMemo(() => {
    return Number(total) - Number(order?.data?.total);
  }, [order, editOrder.orderItems]);

  return (
    <Box
      className="sidebar-info"
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        borderRadius: "0px 0px 12px 12px",
        border: "1px solid #EAE5CF",
        backgroundColor: "#FBF4E5",
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: "20px",
        paddingRight: "20px",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          component="span"
          variant="body2"
          sx={{
            color: "rgba(0, 0, 0, 0.70)",
            fontWeight: "normal",
          }}
        >
          UPDATED ITEMS
        </Typography>
        <Typography
          component="span"
          variant="body2"
          sx={{
            fontWeight: "700",
            fontFamily: "Roboto Mono",
          }}
        >
          {editOrder.orderItems.length} items
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          component="span"
          variant="body2"
          sx={{
            color: "rgba(0, 0, 0, 0.70)",
            fontWeight: "normal",
          }}
        >
          BALANCE AMOUNT
        </Typography>
        <Typography
          component="span"
          variant="body2"
          sx={{
            fontWeight: "700",
            fontFamily: "Roboto Mono",
          }}
        >
          ₹{toPay}
        </Typography>
      </Box>
    </Box>
  );
};

export default CartValue;
