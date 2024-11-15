import { Box, Divider, Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import Image from "next/image";
import React from "react";

import { orderDetailsAtom } from "../../context/atoms";
import type { Item } from "../../types/Item";
import type { OrderedUOM } from "../../types/OrderUOM";

const OrderDetails = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);

  const renderUOM = (uom: OrderedUOM) => {
    let numericUnit: any = uom.unit.replace(/[^\d.]/g, "");
    let { unit } = uom;

    if (numericUnit) {
      unit = uom.unit.split(String(numericUnit)).join("");
      numericUnit *= uom.cart_quantity;
    } else {
      numericUnit = uom.cart_quantity;
    }

    if (uom.cart_quantity > 1 && uom.unit.toLowerCase() === "kg") {
      return (
        <Typography>
          1 {uom.unit} X {uom.cart_quantity}
        </Typography>
      );
    }

    return (
      <Typography>
        {numericUnit} {unit} X {uom.cart_quantity}
      </Typography>
    );
  };

  const renderPrice = (uom: OrderedUOM) => {
    const price = `${uom.price * uom.cart_quantity}`;
    return <Typography>₹{price}</Typography>;
  };

  const renderMarketPrice = (uom: OrderedUOM) => {
    const price = uom.market_price_sub_total;
    if (price > uom.subtotal) {
      return (
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: "11px !important",
          }}
        >
          ₹{price}
        </Typography>
      );
    }
    return <></>;
  };

  const renderSubTotal = (uom: OrderedUOM) => {
    // const uomText = `${uom.uom_id} ${uom.unit} x${uom.cart_quantity}`;
    return (
      <Typography
        sx={{
          fontWeight: "500",
          fontSize: "12px !important",
        }}
      >
        ₹{uom.subtotal}
      </Typography>
    );
  };

  const renderOrderedItem = (item: Item) => {
    const imageSrc = `${process.env.NEXT_PUBLIC_API_URL}${item.logo}`;
    return (
      <Grid item xs={12} sm={12}>
        <Box
          sx={{
            width: "100%",
            padding: "0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              padding: "0",
              display: "flex",
              alignItems: " center",
            }}
          >
            <Box
              sx={{
                padding: "0.8rem",
                background: "#F2EEE4",
                borderRadius: "16px",
                width: "3.8rem",
                height: "3.8rem",
              }}
            >
              <img
                height={100}
                width={100}
                // src={imageSrc}
                src={item.image}
                // src={LogoImage}
                alt="potato"
              />
            </Box>
            <Box
              sx={{
                padding: "0 0 0 0.5rem",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "14px !important",
                }}
              >
                {item.name}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: "12px !important",
                  color: "#878787",
                }}
              >
                {item.ordered_uoms.map(renderUOM)}

                {/* {renderUOM(uom)} */}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                paddingRight: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "20px !important",
                  color: "rgba(35, 31, 32, 0.6)",
                  textDecoration: "line-through",
                }}
              >
                {item.ordered_uoms.map(renderMarketPrice)}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "20px !important",
                }}
              >
                {item.ordered_uoms.map(renderPrice)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    );
  };

  const renderHeading = () => {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          margin: "0.5rem 0",
        }}
      >
        <Box
        // sx={{
        //   display: 'flex',
        //   alignItems: 'flex-end',
        // }}
        >
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "16px",
              marginRight: "1rem",
            }}
          >
            ORDER DETAILS
          </Typography>

          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "14px",
              color: "#7D786D",
              fontStyle: "normal",
              marginTop: "0.2rem",
            }}
          >
            Order ID 782631
          </Typography>
        </Box>
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "12px",
            color: "#7D786D",
          }}
        >
          10 items
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        background: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #F2EEE4",
        padding: " 0.5rem 1.5rem 1.5rem 1.5rem",
        borderRadius: "16px",
      }}
    >
      {renderHeading()}
      <Divider
        sx={{
          width: "100%",
          marginBottom: "1rem",
          marginTop: "0.5rem",
          background: " #F2EEE4",
        }}
      />
      <Grid container spacing={2}>
        {orderDetails.data?.items.map(renderOrderedItem)}
      </Grid>
    </Box>
  );
};

export default OrderDetails;
