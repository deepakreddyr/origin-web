import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";

import PaymentSidebarLayout from "../../components/PaymentLayout/PaymentSidebarLayout";
import { addressAtom } from "../Address/context/atoms";
import { cartAtom } from "../CartPage/context/atoms";
import Home from "./assets/home.svg";
// import CartValue from './components/CartValue';
import Fail from "./components/Fail";
import PaymentMethod from "./components/PaymentMethod";
import Success from "./components/Success";
import {
  checkoutAPI,
  FailOrSuccess,
  failOrSuccess,
  isPaymentIsOpen,
  razorPayObjectAtom,
} from "./context/atoms";
import { getCheckout } from "./services/getCheckout";
import { isAddressAndTimeSlotIsOpen } from "../AddressAndTimeSlot/context/atoms";
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
const PaymentPage = () => {
  const [isOpen, setIsOpen] = useAtom(isPaymentIsOpen);
  const [, setIsAddressAndTimeslotOpen] = useAtom(isAddressAndTimeSlotIsOpen);
  const [checkout, setCheckout] = useAtom(checkoutAPI);
  const [address] = useAtom(addressAtom);
  const [isFailOrSuccess, setFailOrSuccess] = useAtom(failOrSuccess);
  const [, setRazorPayObject] = useAtom(razorPayObjectAtom);
  const [cart] = useAtom(cartAtom);
  React.useEffect(() => {
    getCheckout(setCheckout);
    return () => {
      setRazorPayObject(null);
    };
  }, []);

  const renderAddress = () => {
    const timeSlot = checkout?.data?.data?.find(
      (slot: any) => slot.id === cart.cartValues?.timeSlotId
    );

    const formatDate = (dateString: number | string): string => {
      const dateStr = dateString?.toString();
      const year = parseInt(dateStr?.substring(0, 4), 10);
      const month = parseInt(dateStr?.substring(4, 6), 10) - 1;
      const day = parseInt(dateStr?.substring(6, 8), 10);

      const date = new Date(year, month, day);
      return date.toLocaleDateString("en-GB");
    };

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
              {address.defaultAddress?.address_name}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: "rgba(0, 0, 0, 0.60)",
                fontWeight: "normal",
              }}
            >
              {address.defaultAddress?.address}
            </Typography>
          </Box>
        </Box>
        {!!cart.cartValues?.timeSlotId && (
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
              {timeSlot ? (
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
                  {checkout?.data?.delivery_date[0] && (
                    <span>
                      {convertDateFormat(
                        checkout?.data?.formatted_delivery_date[0]
                      )}
                    </span>
                  )}
                  {", "}
                  {timeSlot.from} - {timeSlot.to}
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
        {/* <CartValue /> */}
        {renderAddress()}
        {/* <DeliveryMethod /> */}
        <PaymentMethod />
      </>
    );
  };

  return (
    <PaymentSidebarLayout
      isOpen={isOpen}
      title="Payment Information"
      onClose={() => {
        setIsOpen(false);
        setFailOrSuccess(FailOrSuccess.NONE);
      }}
      onBack={() => {
        setIsAddressAndTimeslotOpen(true);
        setIsOpen(false);
      }}
    >
      {renderContent()}
    </PaymentSidebarLayout>
  );
};

export default PaymentPage;
