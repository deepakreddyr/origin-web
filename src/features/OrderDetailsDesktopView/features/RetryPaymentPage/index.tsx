import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";

import PaymentSidebarLayout from "../../../../components/PaymentLayout/PaymentSidebarLayout";
import { isRetryPaymentOpenAtom, orderDetailsAtom } from "../../context/atoms";
import Home from "./assets/home.svg";
import CartValue from "./components/CartValue";
import DeliveryMethod from "./components/DeliveryMethod";
import Fail from "./components/Fail";
import PaymentMethod from "./components/PaymentMethod";
import Success from "./components/Success";
import { FailOrSuccess, failOrSuccess } from "./context/atoms";
function convertDateFormat(dateString?: string): string {
  if (!dateString) return "";
  const [day, month, year] = dateString.replace(/\*/g, "").split("-");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = months[parseInt(month, 10) - 1];
  const formattedDay = parseInt(day, 10).toString();

  return `${formattedDay} ${monthName} ${year}`;
}

const RetryPaymentPage = () => {
  const [isOpen, setIsOpen] = useAtom(isRetryPaymentOpenAtom);
  const [isFailOrSuccess, setFailOrSuccess] = useAtom(failOrSuccess);
  const [order] = useAtom(orderDetailsAtom);
  const [toPay, setToPay] = React.useState(0);

  const renderAddress = () => {
    return (
      <Box
        className="delivering-to"
        sx={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          backgroundColor: "#F2EEE44D",
          border: "1px solid #F2EEE4",
          padding: "0.5rem",
          borderRadius: "10px",
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
            paddingBottom: "0.8rem",
            borderBottom: "1px solid #F2EEE4",
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
            <Image width={23} height={22} src={Home} alt="orderPlaced" />
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
              {order.data?.address_name}
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
        {!!order.data?.time_slot && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              width: "100%",
              padding: "0 1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Typography
                component="span"
                variant="button"
                sx={{
                  // fontFamily: "Sofia Pro",
                  fontWeight: "500",
                  fontSize: "12px",
                  color: "#231F2099",
                }}
              >
                TIME SLOT
              </Typography>
              {order.data?.time_slot ? (
                <Typography
                  component="span"
                  variant="body1"
                  sx={{
                    // fontFamily: "Sofia Pro",
                    color: "#231F20",
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  {/* {order.data?.delivery_date && (
                    <span>{convertDateFormat(order.data?.delivery_date)}</span>
                  )} */}
                  {", "}
                  {order.data?.time_slot.from} - {order.data?.time_slot.to}
                </Typography>
              ) : (
                <Typography
                  component="span"
                  variant="body1"
                  sx={{
                    fontFamily: "Sofia Pro",
                    color: "#231F20",
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  Dash Delivery
                </Typography>
              )}
            </Box>
          </Box>
        )}
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
        {/* <CartValue setToPay={setToPay} /> */}
        {renderAddress()}
        {/* <DeliveryMethod /> */}
        <PaymentMethod toPay={toPay} />
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

export default RetryPaymentPage;
