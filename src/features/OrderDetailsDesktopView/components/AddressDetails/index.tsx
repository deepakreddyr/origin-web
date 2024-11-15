import { Box, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import Image from "next/image";
import React from "react";

import Cash from "../../assets/cash.svg";
import Home from "../../assets/home.svg";
import Online from "../../assets/online.svg";
import { orderDetailsAtom } from "../../context/atoms";

const AddressDetails = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);
  const renderAddress = () => {
    return (
      <Box
        sx={{
          display: "flex",
          padding: "0.3rem",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "2px solid #F2EEE4",
            borderRadius: "6px",
            padding: "0.5rem 0.5rem",
            width: "max-content",
            background: "#F8F4E9",
            justifyContent: "space-evenly",
          }}
        >
          <Box
            sx={{
              marginRight: "0.2rem",
              width: "20px",
              height: "20px",
              "@media (max-width: 1199px)": {
                "&>img": {
                  width: "16px",
                  height: "16px",
                },
              },
            }}
          >
            <img src={Home?.src} alt="orderPlaced" />
          </Box>
        </Box>
        <Box
          sx={{
            padding: "0 0 0 0.5rem",
          }}
        >
          <Typography
            sx={{
              marginLeft: "0.3rem",
              fontWeight: "600",
              fontSize: "16px",
              "@media (max-width: 1199px)": {
                fontSize: "10px",
              },
            }}
          >
            Home
          </Typography>
          <Typography
            sx={{
              fontWeight: "400",
              fontSize: "14px",
              color: "#7D786D",
            }}
          >
            {orderDetails.data?.address}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderPayment = () => {
    return (
      <Box>
        {orderDetails.data?.payment_method === "Razorpay" ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              margin: " 0rem 1rem 0.5rem 0.5rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "2px solid #F2EEE4",
                borderRadius: "6px",
                padding: "0.5rem 0.5rem",
                width: "max-content",
                background: "#F8F4E9",
                justifyContent: "space-evenly",
              }}
            >
              <Box
                sx={{
                  marginRight: "0.2rem",
                  width: "20px",
                  height: "20px",
                  "@media (max-width: 1199px)": {
                    "&>img": {
                      width: "16px",
                      height: "16px",
                    },
                  },
                }}
              >
                <img
                  width="30px"
                  height="30px"
                  src="../../assets/online.svg"
                  alt="orderPlaced"
                />
              </Box>
            </Box>

            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "14px",
                marginLeft: "1rem",
              }}
            >
              Paid Online
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              margin: " 0rem 1rem 0.5rem 0.5rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "2px solid #F2EEE4",
                borderRadius: "6px",
                padding: "0.5rem 0.5rem",
                width: "max-content",
                background: "#F8F4E9",
                justifyContent: "space-evenly",
              }}
            >
              <Box
                sx={{
                  marginRight: "0.2rem",
                  width: "20px",
                  height: "20px",
                  "@media (max-width: 1199px)": {
                    "&>img": {
                      width: "16px",
                      height: "16px",
                    },
                  },
                }}
              >
                <img
                  width="30px"
                  height="30px"
                  src="../../assets/cash.svg"
                  alt="orderPlaced"
                />
              </Box>
            </Box>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "14px",
                marginLeft: "1rem",
              }}
            >
              Pay on delivery
            </Typography>
          </Box>
        )}
      </Box>
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
        padding: "0 0.8rem 0.8rem 0.8rem",
      }}
    >
      <Typography
        sx={{
          fontWeight: "600",
          fontSize: "16px",
          padding: "1rem 1rem 0.5rem 0.5rem",
          //   background: '#F6F0E0',
        }}
      >
        Delivering To
      </Typography>
      {renderAddress()}
      <Typography
        sx={{
          fontWeight: "600",
          fontSize: "16px",
          padding: "1rem 1rem 0.5rem 0.5rem",
          //   background: '#F6F0E0',
        }}
      >
        Payment Type
      </Typography>
      {renderPayment()}
    </Box>
  );
};

export default AddressDetails;
