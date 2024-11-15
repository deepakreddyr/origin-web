import { Box, Divider, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import React from "react";

import { orderDetailsAtom } from "../../context/atoms";
import Bills from "../Bills";

const BillDetails = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);

  const renderPayment = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: "14px",
            color: "#414141",
          }}
        >
          TO BE PAID (COD)
        </Typography>
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          ₹ {orderDetails?.data?.total}
        </Typography>
      </Box>
    );
  };

  const totalSavings = React.useMemo(() => {
    return orderDetails.data?.items.reduce((savings, item) => {
      const itemSavings = item.ordered_uoms.reduce((uomSavings, uom) => {
        return uomSavings + (uom.market_price_sub_total - uom.subtotal);
      }, 0);
      return savings + itemSavings;
    }, 0);
  }, [orderDetails]);

  const renderBills = () => {
    return (
      <>
        <Box
          sx={{
            padding: "0rem 1rem 0.3rem 1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: "14px",
                color: "#414141",
              }}
            >
              Market Price
            </Typography>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              ₹ {orderDetails?.data?.sub_total}
            </Typography>
          </Box>
          {!!totalSavings && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  color: "#00855B",
                }}
              >
                Savings
              </Typography>
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#00855B",
                }}
              >
                - ₹ {totalSavings}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* <Typography
              sx={{
                fontWeight: '500',
                fontSize: '12px',
                color: '#D25337',
              }}
            >
              Coupon Applied “SAVEIT”
            </Typography> */}
            {/* <Typography
              sx={{
                fontWeight: '600',
                fontSize: '12px',
                color: '#D25337',
              }}
            >
              -₹ {orderDetails?.data?.discount}
            </Typography> */}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Divider sx={{ width: "100%", marginTop: "0.5rem" }} />
        </Box>
        {renderPayment()}
      </>
    );
  };

  return (
    <Box
      sx={{
        width: "95%",
        background: "rgba(242, 238, 228, 0.3)",
        marginTop: "1rem",
        border: "1px solid #F2EEE4",
        borderRadius: "16px",
      }}
    >
      <Typography
        sx={{
          fontWeight: "600",
          fontSize: "16px",
          padding: "1rem 1rem 0.3rem 1rem",
        }}
      >
        BILL DETAILS
      </Typography>
      {(orderDetails?.data?.bills || []).length > 1 ? <Bills /> : renderBills()}
    </Box>
  );
};

export default BillDetails;
