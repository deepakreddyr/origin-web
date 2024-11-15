import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";

import PaymentSidebarLayout from "../../../../components/PaymentLayout/PaymentSidebarLayout";
import { orderDetailsAtom } from "../../context/atoms";
import Home from "./assets/home.svg";
import CartValue from "./components/CartValue";
import DeliveryMethod from "./components/DeliveryMethod";
import Fail from "./components/Fail";
import PaymentMethod from "./components/PaymentMethod";
import Success from "./components/Success";
import { FailOrSuccess, failOrSuccess, isPaymentIsOpen } from "./context/atoms";

const EditOrderPaymentPage = () => {
  const [isOpen, setIsOpen] = useAtom(isPaymentIsOpen);
  const [isFailOrSuccess, setFailOrSuccess] = useAtom(failOrSuccess);
  const [order] = useAtom(orderDetailsAtom);

  const renderAddress = () => {
    return (
      <Box
        className="delivering-to"
        sx={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography
          variant="body2"
          component="h5"
          sx={{ fontWeight: 700, textTransform: "uppercase" }}
        >
          Delivering to
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Box
            component="figure"
            sx={{
              width: "46px",
              height: "46px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              margin: 0,
              borderRadius: "6px",
              border: "1px solid #F6F0E0",
            }}
          >
            <img
              width="23px"
              height="22px"
              src="./assets/home.svg"
              alt="orderPlaced"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{ fontWeight: "600" }}
            >
              Home
            </Typography>
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: "rgba(0, 0, 0, 0.60)",
                fontWeight: "normal",
              }}
            >
              {order.data?.address}
            </Typography>
          </Box>
          {/* <Button onClick={onOpenAddress}>Change</Button> */}
        </Box>
      </Box>
    );
  };

  const renderContent = () => {
    if (isFailOrSuccess !== FailOrSuccess.NONE) {
      switch (isFailOrSuccess) {
        case FailOrSuccess.SUCCESS:
          return <Success />;
        case FailOrSuccess.FAIL:
          return <Fail />;
        default:
          return <Fail />;
      }
    }

    return (
      <>
        <CartValue />
        {renderAddress()}
        <DeliveryMethod />
        <PaymentMethod />
      </>
    );
  };

  return (
    <PaymentSidebarLayout
      isOpen={isOpen}
      title="Payment Options"
      onClose={() => {
        setIsOpen(false);
        setFailOrSuccess(FailOrSuccess.NONE);
      }}
    >
      {renderContent()}
    </PaymentSidebarLayout>
  );
};

export default EditOrderPaymentPage;
