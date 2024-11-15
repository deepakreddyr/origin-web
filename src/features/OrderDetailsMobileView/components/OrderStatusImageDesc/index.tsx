import { Box, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import type { Duration } from "luxon";
import { DateTime } from "luxon";
import React from "react";

import { DeliveryStatus } from "../../constants/DeliveryStatus";
import { orderDetailsAtom } from "../../context/atoms";
import ReachingContainerWrapper from "./BannerContainerWrapper";
import FailedContainerWrapper from "./FailledContainer";
import NotInitiateContainerWrapper from "./NotInitiatedContainer";

const OrderStatusImageDesc = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);

  const counterRef: any = React.useRef(null);
  const [count, setCount]: any = React.useState(null);

  const calculateETA = (
    previousOrderStartedAt: number,
    eta: number
  ): Duration | null => {
    console.log("Input - previousOrderStartedAt:", previousOrderStartedAt);
    console.log("Input - eta:", eta);

    const previousOrderDate = new Date(previousOrderStartedAt * 1000);
    console.log("Previous order date:", previousOrderDate.toISOString());

    const then = DateTime.fromJSDate(previousOrderDate).plus({ seconds: eta });
    console.log("Calculated ETA (then):", then.toISO());

    const now = DateTime.now();
    console.log("Current time (now):", now.toISO());

    if (now < then) {
      const diff = then.diff(now);
      console.log("Time difference:", diff.toObject());
      return diff;
    }

    console.log("ETA has passed, returning null");
    return null;
  };

  const updateETA = () => {
    const eta = orderDetails.data?.driver?.eta;
    const previousOrderStartedAt =
      orderDetails.data?.driver?.previous_order_started_at;
    if (eta && previousOrderStartedAt) {
      const newETA = calculateETA(previousOrderStartedAt, eta);

      const minimumETA = DateTime.now()
        .plus({ minutes: 2 })
        .diff(DateTime.now());

      if (newETA && newETA.as("seconds") < 2 * 60) {
        setCount(minimumETA);
      } else {
        setCount(newETA);
      }

      console.log("Final ETA to display:", count?.toFormat("mm:ss") || "2:00");
    }
  };

  React.useEffect(() => {
    updateETA();
    counterRef.current = setInterval(updateETA, 1000);

    return () => {
      if (counterRef.current) clearInterval(counterRef.current);
    };
  }, [
    orderDetails.data?.driver?.eta,
    orderDetails.data?.driver?.previous_order_started_at,
  ]);

  const renderArrivedLocation = () => {
    return (
      <ReachingContainerWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "12px !important",
            }}
          >
            Order
          </Typography>
          <Typography
            sx={{
              fontWeight: "650",
              fontSize: "12px !important",
              marginTop: "0.3rem",
            }}
          >
            Arrived
          </Typography>
        </Box>
      </ReachingContainerWrapper>
    );
  };

  const renderReachingContent = () => {
    return (
      <ReachingContainerWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "12px !important",
            }}
          >
            Reaching in
          </Typography>
          <Typography
            sx={{
              fontWeight: "650",
              fontSize: "12px !important",
              marginTop: "0.3rem",
            }}
          >
            {count ? count.toFormat("mm:ss") : "02:00"} minutes
          </Typography>
        </Box>
      </ReachingContainerWrapper>
    );
  };

  const renderConfirmedContent = () => {
    return (
      <ReachingContainerWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "12px !important",
            }}
          >
            Order
          </Typography>
          <Typography
            sx={{
              fontWeight: "650",
              fontSize: "12px !important",
              marginTop: "0.3rem",
            }}
          >
            CONFIRMED
          </Typography>
        </Box>
      </ReachingContainerWrapper>
    );
  };

  const renderProcessingContent = () => {
    return (
      <ReachingContainerWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "12px !important",
            }}
          >
            Order
          </Typography>
          <Typography
            sx={{
              fontWeight: "650",
              fontSize: "12px !important",
              marginTop: "0.3rem",
            }}
          >
            PROCESSING
          </Typography>
        </Box>
      </ReachingContainerWrapper>
    );
  };

  const renderNotInitiateContent = () => {
    return (
      <NotInitiateContainerWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "12px !important",
              lineHeight: "15px !important",
            }}
          >
            Awaiting
          </Typography>
          <Typography
            sx={{
              fontWeight: "650",
              fontSize: "12px !important",
              lineHeight: "15px !important",
              marginTop: "0.3rem",
            }}
          >
            CONFIRMATION
          </Typography>
        </Box>
      </NotInitiateContainerWrapper>
    );
  };

  const renderInitiateContent = () => {
    return (
      <NotInitiateContainerWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "650",
              fontSize: "12px !important",
              lineHeight: "15px !important",
              marginTop: "0.3rem",
            }}
          >
            INITIATED
          </Typography>
        </Box>
      </NotInitiateContainerWrapper>
    );
  };

  const renderFailedContent = () => {
    return (
      <FailedContainerWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "12px !important",
              lineHeight: "15px !important",
            }}
          >
            Delivery
          </Typography>
          <Typography
            sx={{
              fontWeight: "650",
              fontSize: "12px !important",
              lineHeight: "15px !important",
            }}
          >
            FAILED
          </Typography>
        </Box>
      </FailedContainerWrapper>
    );
  };

  const renderOrderFailedContent = () => {
    return (
      <FailedContainerWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "12px !important",
              lineHeight: "15px !important",
            }}
          >
            Order
          </Typography>
          <Typography
            sx={{
              fontWeight: "650",
              fontSize: "12px !important",
              lineHeight: "15px !important",
            }}
          >
            FAILED
          </Typography>
        </Box>
      </FailedContainerWrapper>
    );
  };
  const renderPreparingContent = () => {
    return (
      <ReachingContainerWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "12px !important",
            }}
          >
            Starting
          </Typography>
          <Typography
            sx={{
              fontWeight: "650",
              fontSize: "12px !important",
            }}
          ></Typography>
        </Box>
      </ReachingContainerWrapper>
    );
  };

  const renderDeliverdContent = () => {
    return (
      <ReachingContainerWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "12px !important",
            }}
          >
            Order
          </Typography>
          <Typography
            sx={{
              fontWeight: "650",
              fontSize: "12px !important",
              marginTop: "0.3rem",
            }}
          >
            FULFILLED
          </Typography>
        </Box>
      </ReachingContainerWrapper>
    );
  };

  const renderETAContent = () => {
    const lastStatus =
      !!orderDetails?.data?.status_list &&
      orderDetails?.data?.status_list[orderDetails.data.status_list.length - 1];
    if (!lastStatus) {
      return renderInitiateContent();
    }
    const currentStatus =
      lastStatus.status_message.toLowerCase() || "out for delivery";
    switch (currentStatus) {
      case DeliveryStatus.PENDING:
        return renderNotInitiateContent();

      case DeliveryStatus.ACCEPTED:
        return renderConfirmedContent();

      case DeliveryStatus.REJECTED_BY_ADMIN:
        return renderOrderFailedContent();

      case DeliveryStatus.PROCESSING:
        return renderProcessingContent();

      case DeliveryStatus.PREPARING_FOR_DISPATCH:
        return renderPreparingContent();

      case DeliveryStatus.OUT_FOR_DELIVERY:
        return renderReachingContent();

      case DeliveryStatus.NEAR_BY:
        return renderReachingContent();

      case DeliveryStatus.DELIVERED:
        return renderDeliverdContent();

      case DeliveryStatus.NOT_DELIVERED:
        return renderFailedContent();

      case DeliveryStatus.CANCEL_BY_USER:
        return renderOrderFailedContent();

      case DeliveryStatus.ON_THE_WAY:
        return renderReachingContent();
      case DeliveryStatus.ARRIVED_AT_LOCATION:
        return renderArrivedLocation();

      default:
        return renderInitiateContent();
    }
    // const { driver } = orderDetails.data;

    // switch (true) {
    //   case driver.eta !== null:
    //     return renderReachingContent();
    //   case driver.eta === null:
    //     return renderNotInitiateContent();
    //   default:
    //     return <></>;
    // }
  };

  const orderCreatedAtTimestamp = orderDetails.data
    ? orderDetails.data.order_created_at * 1000
    : 0;
  const orderCreatedAtDate = new Date(orderCreatedAtTimestamp);

  const today = new Date();
  const isToday =
    orderCreatedAtDate.getDate() === today.getDate() &&
    orderCreatedAtDate.getMonth() === today.getMonth() &&
    orderCreatedAtDate.getFullYear() === today.getFullYear();

  const currentYear = today.getFullYear();
  const orderYear = orderCreatedAtDate.getFullYear();

  let formattedOrderCreatedAt;

  if (isToday) {
    formattedOrderCreatedAt = "Today";
  } else {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      ...(orderYear !== currentYear && { year: "numeric" }),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    formattedOrderCreatedAt = orderCreatedAtDate.toLocaleDateString(
      "en-US",
      options
    );
  }

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        padding: "1rem",
      }}
    >
      {orderDetails.data?.time_slot ? (
        <Box>
          <Typography
            sx={{
              // fontFamily: 'Melts-Script-Rough',
              // fontStyle: 'italic !important',
              fontSize: "14px !important",
              fontWeight: "400",
              marginBottom: "0",
            }}
          >
            TIME SLOT
          </Typography>

          <Typography
            sx={{
              fontSize: "14px!important",
              fontWeight: "600",
              marginTop: "0.3rem",
              lineHeight: "14px",
            }}
          >
            {orderDetails.data?.time_formatted}
            {/* {orderDetails.data?.time_slot?.from} -{' '}
          {orderDetails.data?.time_slot?.to} | {formattedOrderCreatedAt} */}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography
            sx={{
              // fontFamily: 'Melts-Script-Rough',
              // fontStyle: 'italic !important',
              fontSize: "14px !important",
              fontWeight: "400",
              marginBottom: "0",
            }}
          >
            Dash Delivery
          </Typography>

          <Typography
            sx={{
              fontSize: "14px!important",
              fontWeight: "600",
              marginTop: "0.3rem",
              lineHeight: "14px",
            }}
          >
            {formattedOrderCreatedAt}
            {/* Today */}
            {/* {orderDetails.data?.time_slot?.from} -{' '}
          {orderDetails.data?.time_slot?.to} | {formattedOrderCreatedAt} */}
          </Typography>
        </Box>
      )}

      {renderETAContent()}
      {/* {renderReachingContent()} */}
    </Box>
  );
};

export default OrderStatusImageDesc;
