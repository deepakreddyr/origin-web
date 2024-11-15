import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";

import { editOrderAtom } from "../../context/atoms";
import Item from "../Item";

const ItemsList = () => {
  const [editOrder] = useAtom(editOrderAtom);

  return (
    <Box
      className="review-cart"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        overflow: "auto",
      }}
    >
      <Typography component="h3" variant="body1" sx={{ fontWeight: 600 }}>
        REVIEW CART
      </Typography>
      <Box
        className="review-cart-list"
        component="ul"
        sx={{
          listStyleType: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {editOrder.orderItems?.map((item: any) => (
          <Item item={item} key={item.id} />
        ))}
      </Box>
    </Box>
  );
};

export default ItemsList;
