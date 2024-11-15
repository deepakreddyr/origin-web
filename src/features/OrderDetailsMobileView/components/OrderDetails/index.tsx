import { Box, Button, Divider, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import Image from "next/image";
import React from "react";

import Raw from "../../assets/raw.svg";
import Ripe from "../../assets/ripe.svg";
import Semi from "../../assets/semi-ripe.svg";
import Toggle from "../../assets/toggle.svg";
// import LogoImage from '../../../../assets/svg/logo.svg';
import { orderDetailsAtom } from "../../context/atoms";
import type { Item } from "../../types/Item";
import type { OrderedUOM } from "../../types/OrderUOM";
import { StyledHeadingTypography } from "../Styled/StyledHeadingTypography";

const OrderDetails = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);
  const [showAllItems, setShowAllItems] = React.useState(false);

  const totalItems = React.useMemo(() => {
    let total = 0;
    if (orderDetails.data?.items && orderDetails.data?.items.length > 0) {
      orderDetails.data?.items.forEach((i) => {
        total += i.ordered_uoms.length;
      });
    }
    return total;
  }, [orderDetails]);
  // const renderUOM = (uom: OrderedUOM) => {
  //   let numericUnit: any = uom.unit.replace(/[^\d.]/g, '');
  //   let { unit } = uom;

  //   if (numericUnit) {
  //     unit = uom.unit.split(String(numericUnit)).join('');
  //     numericUnit *= uom.cart_quantity;
  //   } else {
  //     numericUnit = uom.cart_quantity;
  //   }

  //   if (uom.cart_quantity > 1 && uom.unit.toLowerCase() === 'kg') {
  //     return (
  //       <Typography
  //         sx={{
  //           fontWeight: '500',
  //           fontSize: '11px !important',
  //         }}
  //       >
  //         1 {uom.unit} x{uom.cart_quantity}
  //       </Typography>
  //     );
  //   }

  //   return (
  //     <Typography
  //       sx={{
  //         fontWeight: '500',
  //         fontSize: '11px !important',
  //       }}
  //     >
  //       {numericUnit} {unit} x{uom.cart_quantity}
  //     </Typography>
  //   );
  // };

  const renderUOM = (uom: OrderedUOM) => {
    let numericUnit: any = uom.unit.replace(/[^\d.]/g, "");
    let { unit } = uom;

    if (numericUnit) {
      unit = uom.unit.split(String(numericUnit)).join("");
      numericUnit *= uom.cart_quantity;
    } else {
      numericUnit = uom.cart_quantity;
    }

    // Check if the unit contains 'g'
    if (
      uom.unit.toLowerCase().includes("g") ||
      uom.unit.toLowerCase().includes("piece") ||
      uom.unit.toLowerCase().includes("bunch") ||
      uom.unit.toLowerCase().includes("box") ||
      uom.unit.toLowerCase().includes("pack")
    ) {
      return (
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: "11px !important",
          }}
        >
          {uom.unit} x{uom.cart_quantity}
        </Typography>
      );
    }

    return (
      <Typography
        sx={{
          fontWeight: "500",
          fontSize: "11px !important",
        }}
      >
        1 {uom.unit} x{uom.cart_quantity}
      </Typography>
    );
  };
  // eslint-disable-next-line consistent-return
  const renderRipeness = (ripe: OrderedUOM) => {
    if (!!ripe.ripeness && ripe.ripeness === "raw") {
      return (
        <Box
          sx={{
            display: "flex",
            marginLeft: "0.5rem",

            // justifyContent: 'space-around',
          }}
        >
          <Image src={Raw} alt="semi" />

          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "10px !important",
              color: "#878787",
              marginLeft: "0.3rem",
            }}
          >
            RAW
          </Typography>
        </Box>
      );
    }
    if (!!ripe.ripeness && ripe.ripeness === "semi_ripe") {
      return (
        <Box
          sx={{
            display: "flex",
            marginLeft: "0.5rem",

            // justifyContent: 'space-around',
          }}
        >
          <Image src={Semi} alt="semi" />
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "10px !important",
              color: "#878787",
              marginLeft: "0.3rem",
            }}
          >
            SEMI
          </Typography>
        </Box>
      );
    }
    if (!!ripe.ripeness && ripe.ripeness === "ripe") {
      return (
        <Box
          sx={{
            // justifyContent: 'space-around',
            display: "flex",
            marginLeft: "0.5rem",
          }}
        >
          <Image src={Ripe} alt="semi" />

          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "10px !important",
              color: "#878787",
              marginLeft: "0.3rem",
            }}
          >
            RIPE
          </Typography>
        </Box>
      );
    }
  };

  const renderPrice = (uom: OrderedUOM) => {
    const price = `${uom.price * uom.cart_quantity}`;
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

  // const renderSubTotal = (uom: OrderedUOM) => {
  //   // const uomText = `${uom.uom_id} ${uom.unit} x${uom.cart_quantity}`;
  //   return (
  //     <Typography
  //       sx={{
  //         fontWeight: '500',
  //         fontSize: '11px !important',
  //       }}
  //     >
  //       ₹{uom.subtotal}
  //     </Typography>
  //   );
  // };

  const renderItemCard = (item: Item, uom: OrderedUOM) => {
    // const imageSrc = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.image}`;

    return (
      <Box
        sx={{
          width: "100%",
          padding: "0.1rem 0.3rem",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "Sofia Pro",
          "&:last-child": {
            paddingBottom: "0.5rem",
          },
        }}
      >
        <Box
          sx={{
            padding: "0.3rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Box
            sx={{
              padding: "0.3rem",
              background: "rgba(242, 238, 228, 1)",
              borderRadius: "12px",
              width: "3.5rem",
              height: "3.5rem",
            }}
          >
            <img
              height="100%"
              width="100%"
              src={item.image}
              alt="potato"
              style={{ objectFit: "contain" }}
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
                fontSize: "12px !important",
              }}
            >
              {item.name}
            </Typography>
            <Box
              sx={{
                marginTop: "0.1rem",
                display: "flex",
                gap: "0.2rem",
              }}
            >
              <Typography
                sx={{
                  color: "rgba(0, 0, 0, 0.5)",
                }}
              >
                {renderUOM(uom)}
              </Typography>
              {renderRipeness(uom)}
            </Box>
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
              paddingRight: "0.5rem", // Reduced padding on the right
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "12px !important",
                color: "rgba(35, 31, 32, 0.6)",
                textDecoration: "line-through",
              }}
            >
              {renderMarketPrice(uom)}
            </Typography>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "13px !important",
              }}
            >
              {renderPrice(uom)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderOrderedItem = (item: Item) => {
    return item.ordered_uoms.map((uom) => renderItemCard(item, uom));
  };

  const handleViewAllClick = () => {
    setShowAllItems(true);
  };

  const items = orderDetails.data?.items || [];
  const itemsToShow = showAllItems ? items : items.slice(0, 4);

  const renderHeading = () => {
    return (
      <Box sx={{ width: "100%" }}>
        <StyledHeadingTypography
          sx={{
            padding: "0rem 1rem 0rem 1rem",
          }}
        >
          Order Details
        </StyledHeadingTypography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontWeight: "400",
              fontSize: "12px",
              color: "#231F20CC",
              fontFamily: "Sofia Pro",
              padding: "0.3rem 1rem 1rem 1rem",
            }}
          >
            Order ID {orderDetails.data?.order_id}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Sofia Pro",
              fontWeight: "600",
              fontSize: "12px",
              color: "#7D786D",
              padding: "0 1rem 1rem 1rem",
            }}
          >
            {totalItems} items
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(242, 238, 228, 0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #F2EEE4",
        paddingTop: "1rem",
        margin: "1rem  1rem 0rem 1rem",
        borderRadius: "16px",
      }}
    >
      {renderHeading()}
      <Divider
        sx={{
          borderWidth: "0.1px",
          color: "#F2EEE4",
          width: "100%",
        }}
      />
      {itemsToShow?.map(renderOrderedItem)}
      {!showAllItems && items.length > 4 && (
        <Button onClick={handleViewAllClick} sx={{ margin: "1rem 0 0.5rem 0" }}>
          <Typography
            sx={{
              marginRight: "0.3rem",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            View All
          </Typography>
          <Image src={Toggle} alt="toggle" />
        </Button>
      )}
    </Box>
  );
};

export default OrderDetails;
