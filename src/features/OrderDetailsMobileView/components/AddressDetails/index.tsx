import { Box, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import Image from "next/image";
import React from "react";

import Freinds from "../../../../assets/svg/familyTag.svg";
import Office from "../../../../assets/svg/OfficeTag.svg";
import Others from "../../../../assets/svg/OthersTag.svg";
import Cash from "../../assets/cash.svg";
import Home from "../../assets/home.svg";
import Online from "../../assets/online.svg";
import { orderDetailsAtom } from "../../context/atoms";
import { StyledHeadingTypography } from "../Styled/StyledHeadingTypography";

const AddressDetails = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);

  const renderImage = () => {
    if (orderDetails.data?.address_name === "Home") {
      return (
        <img
          width="30px"
          height="30px"
          src="../../assets/home.svg"
          alt="orderPlaced"
        />
      );
    }
    if (orderDetails.data?.address_name === "Office") {
      return (
        <img
          width="25px"
          height="30px"
          src="../../../../assets/svg/OfficeTag.svg"
          alt="orderPlaced"
        />
      );
    }
    if (orderDetails.data?.address_name === "Friends & Family") {
      return (
        <img
          width="30px"
          height="30px"
          src="../../../../assets/svg/familyTag.svg"
          alt="orderPlaced"
        />
      );
    }
    return (
      <img
        width="30px"
        height="30px"
        src="../../../../assets/svg/OthersTag.svg"
        alt="orderPlaced"
      />
    );
  };

  const renderAddress = () => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {orderDetails.data ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #F6F0E0",
              background: "rgba(242, 238, 228, 1)",
              borderRadius: "6px",
              padding: "0.5rem",
              width: "95px",
              height: "50px",
            }}
          >
            {renderImage()}
            {/* <img width="30px" height="30px" src={Home} alt="orderPlaced" /> */}
          </Box>
        ) : (
          <Box
            sx={{
              width: "50px",
              height: "40px",
              background: "rgba(242, 238, 228, 1)",
              borderRadius: "6px",
            }}
          />
        )}
        <Box
          sx={{
            padding: " 0 0 0 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Sofia Pro",
              fontWeight: "600",
              fontSize: "12px",
            }}
          >
            {orderDetails.data?.address_name
              ? orderDetails.data?.address_name
              : "HOME"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Sofia Pro",
              fontWeight: "400",
              fontSize: "11px",
              color: "#7D786D",
              // textAlign: 'justify',
            }}
          >
            {orderDetails.data?.formatted_address}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderPaymentType = () => {
    return (
      <Box>
        {orderDetails.data?.payment_method === "Razorpay" ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #F6F0E0",
                background: "rgba(242, 238, 228, 1)",
                borderRadius: "6px",
                width: "54px",
                height: "50px",
              }}
            >
              <img width="30px" height="30px" src={Online} alt="orderPlaced" />
            </Box>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "12px",
                marginLeft: "1rem",
                fontFamily: "Sofia Pro",
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
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #F6F0E0",
                background: "rgba(242, 238, 228, 1)",
                borderRadius: "6px",
                padding: "0.5rem",
                width: "54px",
                height: "54px",
              }}
            >
              <img width="30px" height="30px" src={Cash} alt="orderPlaced" />
            </Box>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "12px",
                marginLeft: "1rem",
                fontFamily: "Sofia Pro",
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
        backgroundColor: "rgba(242, 238, 228, 0.3)",
        display: "flex",
        flexDirection: "column",
        border: "2px solid #F2EEE4",
        padding: "1rem",
        margin: "1rem ",
        marginTop: "0",
        borderRadius: "16px",
      }}
    >
      <StyledHeadingTypography
        sx={{
          paddingBottom: "0.5rem",
        }}
      >
        Delivering To
      </StyledHeadingTypography>
      {renderAddress()}
      {orderDetails?.data?.payment_method === "Razorpay" &&
      (orderDetails?.data?.payment_status === "pending" ||
        orderDetails?.data?.payment_status === "failed" ||
        orderDetails?.data?.payment_status === "partially_completed") ? (
        <></>
      ) : (
        <Box
          sx={{
            paddingBottom: "0.5rem",
            paddingTop: "0.4rem",
          }}
        >
          <StyledHeadingTypography
            sx={{
              paddingBottom: "0.5rem",
            }}
          >
            Payment Type
          </StyledHeadingTypography>
          {renderPaymentType()}
        </Box>
      )}
    </Box>
  );
};

export default AddressDetails;
