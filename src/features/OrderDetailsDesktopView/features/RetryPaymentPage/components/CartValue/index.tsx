import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";

import { orderDetailsAtom } from "../../../../context/atoms";
import getEditCartTotal from "../../../EditOrder/utils/getEditCartTotal";
import { orderedItemsAtom } from "../../context/atoms";

const CartValue = ({ setToPay }: { setToPay: (value: number) => void }) => {
  const [orderedItems] = useAtom(orderedItemsAtom);
  const [order] = useAtom(orderDetailsAtom);

  const total = React.useMemo(getEditCartTotal({ orderItems: orderedItems }), [
    orderedItems,
  ]);

  const toPay = React.useMemo(() => {
    setToPay(Number(total));
    return Number(total);
  }, [order, orderedItems]);

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
          ITEMS
        </Typography>
        <Typography
          component="span"
          variant="body2"
          sx={{
            fontWeight: "700",
            fontFamily: "Roboto Mono",
          }}
        >
          {orderedItems?.length} items
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
