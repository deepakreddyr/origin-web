import styled from "@emotion/styled";
import {
  ArrowDropDown,
  ArrowDropUp,
  FlashOn,
  MarginTwoTone,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React, { useState } from "react";
import Dash from "../../assets/dash.svg";
import Timeslot from "../../assets/timeslot.svg";
import ArrownDown from "../../assets/arrow-down.svg";
import ArrownUp from "../../assets/arrow-up.svg";

import { cartAtom, cartItems } from "../../../CartPage/context/atoms";
import type CartAtomI from "../../../CartPage/types/CartAtomI";
import { checkoutAPI } from "../../context/atoms";
import Image from "next/image";

// Types
export type TimeSlot = {
  id: string | number;
  start: string;
  end: string;
};

type TimeSlotSelectorProps = {};

// Styled Components
const Container = styled.div`
  margin: 1.5rem 0.3rem 0.3rem 0.5rem;
`;

const InnerContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: rgba(242, 238, 228, 0.3);
  padding: 0.5rem 1rem;
  border: 2px solid #f2eee4;
  margin: 0.3rem 0.3rem 0.3rem 0.3rem;
  border-radius: 16px;
  &:nth-of-type(2) {
    margin-top: 1rem;
  }
`;

const DateDisplay = styled.h3`
  font-family: "SofiaPro";
  font-weight: 600;
  font-size: 18px !important;
  color: #231f20cc;
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const DashDeliveryContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px;
  border-radius: 12px;
  max-width: 400px;
  cursor: pointer;

  &.base {
    color: #1a1a1a;
    .fee {
      color: #25874d;
    }
  }
  &.selected {
    background-color: #25874d;
    color: #ffffff;
    .fee {
      color: #ffffff;
    }
  }
  &.disabled {
    background-color: #f2eee4;
    color: #231f20;
    cursor: not-allowed;
    .fee {
      color: #25874d;
    }
    opacity: 40%;
  }
`;

const SlotButton = styled.button<{ isSelected: boolean }>`
  background-color: ${(props) => (props.isSelected ? "#25874d" : "white")};
  color: ${(props) => (props.isSelected ? "white" : "#333")};
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#25874D" : "#F2EEE4")};
  }

  &:disabled {
    background-color: #f2eee4;
    color: #999;
    cursor: not-allowed;
    opacity: 40%;
  }
`;

function checkDate(unixTimestamp?: number): string {
  if (!unixTimestamp) return "";
  const givenDate = new Date(unixTimestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time to midnight for accurate date comparison
  givenDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);

  if (givenDate.getTime() === today.getTime()) {
    return "Today - ";
  }
  if (givenDate.getTime() === tomorrow.getTime()) {
    return "Tomorrow - ";
  }
  return "";
}

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

// Main Component
const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [checkoutDetails] = useAtom(checkoutAPI);
  const [cartItemsAtom] = useAtom(cartItems);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const getTotalCallback = () => {
    if (cartItemsAtom && Array.isArray(cartItemsAtom)) {
      // Calculate the total price
      let totalPrice: number = 0;

      cartItemsAtom.forEach((item: any) => {
        item.uom.forEach((uom: any) => {
          totalPrice += uom.qty * uom.price;
        });
      });

      return totalPrice;
    }
    return 0;
  };

  const subTotal = React.useMemo(getTotalCallback, [cartItemsAtom]);

  const onSelectSlot = (id: string | number) => () => {
    const payload: CartAtomI = {
      ...cart,
      cartValues: {
        ...cart.cartValues,
        timeSlotId: id,
        timeSlotError: null,
      },
    };
    setCart(payload);
  };

  const dashDeliveryContainerClassNames = React.useMemo(() => {
    if (cart.cartValues?.timeSlotId === "instant") return "selected";
    if (
      checkoutDetails.data?.dash_delivery.immediate_delivery_time_enabled ===
        false &&
      checkoutDetails.data?.dash_delivery
        .immediate_delivery_disabled_message !== null
    ) {
      return "disabled";
    }

    if (
      checkoutDetails.data?.dash_delivery.is_immediate_delivery_busy === true &&
      checkoutDetails.data?.dash_delivery
        .immediate_delivery_disabled_message !== null
    ) {
      return "disabled";
    }

    if (
      checkoutDetails.data?.dash_delivery.immediate_cart_minimum &&
      checkoutDetails.data?.dash_delivery.immediate_cart_minimum > subTotal
    ) {
      return "disabled";
    }

    return "base";
  }, [cart, checkoutDetails]);

  const renderMessage = () => {
    if (
      checkoutDetails.data?.dash_delivery.immediate_delivery_time_enabled ===
        false &&
      checkoutDetails.data?.dash_delivery
        .immediate_delivery_disabled_message !== null
    ) {
      return (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 400,
            fontSize: 12,
            color: "#D0583F",
          }}
        >
          {
            checkoutDetails.data?.dash_delivery
              .immediate_delivery_disabled_message
          }
        </Typography>
      );
    }

    if (
      checkoutDetails.data?.dash_delivery.is_immediate_delivery_busy === true &&
      checkoutDetails.data?.dash_delivery
        .immediate_delivery_disabled_message !== null
    ) {
      return (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 400,
            fontSize: 12,
            color: "#D0583F",
          }}
        >
          {
            checkoutDetails.data?.dash_delivery
              .immediate_delivery_disabled_message
          }
        </Typography>
      );
    }

    if (
      checkoutDetails.data?.dash_delivery.immediate_cart_minimum &&
      checkoutDetails.data?.dash_delivery.immediate_cart_minimum > subTotal
    ) {
      return (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 400,
            fontSize: 12,
            color: "#D0583F",
          }}
        >
          Available for order above ₹
          {checkoutDetails.data?.dash_delivery.immediate_cart_minimum}
        </Typography>
      );
    }

    return (
      <Typography
        variant="body2"
        sx={{
          fontWeight: 400,
          fontSize: 12,
          color: "rgba(35, 31, 32, 0.7)",
        }}
      >
        Get it within 35 mins
      </Typography>
    );
  };

  if (!checkoutDetails.data) return <></>;

  return (
    <Container>
      <DateDisplay>
        {checkoutDetails.data?.delivery_date &&
          checkDate(checkoutDetails.data?.delivery_date[0])}
        {checkoutDetails.data?.formatted_delivery_date &&
          convertDateFormat(checkoutDetails.data?.formatted_delivery_date[0])}
      </DateDisplay>
      {checkoutDetails.data?.dash_delivery.immediate_delivery_available && (
        <InnerContainer>
          {!!cart.cartValues?.timeSlotError && (
            <Typography
              variant="body2"
              sx={{
                color: "#9e0000",
              }}
            >
              {cart.cartValues?.timeSlotError}
            </Typography>
          )}
          <DashDeliveryContainer
            className={dashDeliveryContainerClassNames}
            onClick={
              dashDeliveryContainerClassNames === "disabled"
                ? () => {}
                : onSelectSlot("instant")
            }
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ marginRight: 1 }}>
                <Image src={Dash} alt="dash" />
              </Box>
              <Box>
                <Typography
                  // variant="subtitle1"
                  sx={{ fontWeight: "600", marginBottom: "-0.1rem" }}
                  className="text"
                >
                  Dash Delivery
                </Typography>
                {renderMessage()}
              </Box>
            </Box>
            {/* <Typography className="fee">+ ₹30 Delivery fee</Typography> */}
          </DashDeliveryContainer>
        </InnerContainer>
      )}
      <InnerContainer>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0.3rem 0.3rem 0.3rem 0.3rem",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ marginRight: 1 }}>
              <Image src={Timeslot} alt="timeslot" />
            </Box>
            <Box>
              <Typography
                sx={{ fontWeight: "600", marginBottom: "-0.1rem" }}
                className="text"
              >
                Preferred time slot
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: 12,
                  color: "rgba(35, 31, 32, 0.7)",
                }}
              >
                Select a time slot
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={toggleAccordion}>
            {isAccordionOpen ? (
              <Image src={ArrownUp} alt="arrow" />
            ) : (
              <Image src={ArrownDown} alt="arrow" />
            )}
          </IconButton>
        </Box>
        {isAccordionOpen && (
          <SlotGrid>
            {checkoutDetails?.data?.timeslots.map((slot: any) => (
              <SlotButton
                key={slot.id}
                isSelected={cart.cartValues?.timeSlotId === slot.id}
                onClick={onSelectSlot(slot.id)}
                disabled={!slot.available}
              >
                {slot.from} - {slot.to}
              </SlotButton>
            ))}
          </SlotGrid>
        )}
      </InnerContainer>
    </Container>
  );
};

export default TimeSlotSelector;
