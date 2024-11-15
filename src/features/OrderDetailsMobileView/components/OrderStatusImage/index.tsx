/* eslint-disable import/no-duplicates */
import { Box, Button, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import Image from "next/image";
import React from "react";
import Lottie from "react-lottie";

import ArrivedAtLocation from "../../assets/arrivedAtLocation.svg";
import Close from "../../assets/closeMap.svg";
import NearBy from "../../assets/OrderStatusAnimations/DELIVERING_NEARBY.json";
import MapLocator from "../../assets/OrderStatusAnimations/map.json";
import OrderPacked from "../../assets/OrderStatusAnimations/ORDER_PACK.json";
import Placed from "../../assets/OrderStatusAnimations/ORDER_PLACE.json";
import OrderConfirmed from "../../assets/OrderStatusAnimations/ORDER_PLACE-CONFIRM.json";
import OrderFailed from "../../assets/OrderStatusAnimations/ORDER_PLACE-REJECTED.json";
import Delivered from "../../assets/OrderStatusAnimations/ORDERED-DELIVERED.json";
import NotDelivered from "../../assets/OrderStatusAnimations/ORDERED-NOT-DELIVERED.json";
import OutForDelivery from "../../assets/OrderStatusAnimations/OUT_FOR_DELIVERY.json";
import PreparingDispatch from "../../assets/OrderStatusAnimations/PREPARING_FOR_DISPATCH.json";
import { DeliveryStatus } from "../../constants/DeliveryStatus";
import { orderDetailsAtom } from "../../context/atoms";
import MapContainer from "../MapContainer";
import OrderStatusImageDesc from "../OrderStatusImageDesc";
import styles from "./styles.module.css";

const OrderStatusImage = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);
  const [mapToggle, setMapToggle] = React.useState(false);
  const [mapToggleButtonText, setMapToggleButtonText] =
    React.useState("MAP VIEW");

  const onToggleMapButtonClick = () => {
    switch (mapToggleButtonText) {
      case "MAP VIEW": {
        setMapToggle(true);
        setMapToggleButtonText("CLOSE MAP");
        return;
      }
      case "CLOSE MAP": {
        setMapToggle(false);
        setMapToggleButtonText("MAP VIEW");
        return;
      }
      default: {
        setMapToggle(true);
        setMapToggleButtonText("MAP VIEW");
      }
    }
  };

  const mapDetails = React.useMemo(() => {
    const isMapDetailsExist =
      mapToggle &&
      orderDetails?.data?.driver &&
      orderDetails?.data?.driver?.latitude &&
      orderDetails?.data?.driver?.longitude &&
      orderDetails?.data?.latitude &&
      orderDetails?.data?.longitude;

    const driverDetails = orderDetails?.data?.driver || {
      latitude: "0",
      longitude: "0",
    };

    const driverLocation = {
      lat: Number(driverDetails?.latitude),
      lng: Number(driverDetails?.longitude),
    };

    const customerLocation = {
      lat: Number(orderDetails?.data?.latitude),
      lng: Number(orderDetails?.data?.longitude),
    };

    return { isMapDetailsExist, driverLocation, customerLocation };
  }, [orderDetails, mapToggle]);

  const renderImage = () => {
    const lastStatus =
      !!orderDetails?.data?.status_list &&
      orderDetails?.data?.status_list[orderDetails.data.status_list.length - 1];

    if (!lastStatus) {
      return (
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: OrderConfirmed,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          height={400}
          width="100%"
        />
      );
    }
    const currentStatus =
      lastStatus.status_message.toLowerCase() || "out for delivery";

    switch (currentStatus) {
      case DeliveryStatus.PENDING:
        return (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: Placed,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width="100%"
          />
        );

      case DeliveryStatus.ACCEPTED:
        return (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: OrderConfirmed,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width="100%"
          />
        );

      case DeliveryStatus.REJECTED_BY_ADMIN:
        return (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: OrderFailed,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width="100%"
          />
        );

      case DeliveryStatus.PROCESSING:
        return (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: OrderPacked,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width="100%"
          />
        );

      case DeliveryStatus.PREPARING_FOR_DISPATCH:
        return (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: PreparingDispatch,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width="100%"
          />
        );

      case DeliveryStatus.OUT_FOR_DELIVERY:
        return (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: OutForDelivery,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width="100%"
          />
        );

      case DeliveryStatus.ON_THE_WAY:
        return (
          <>
            <Button
              className={styles["map-btn"]}
              size="small"
              onClick={onToggleMapButtonClick}
            >
              {mapToggleButtonText === "MAP VIEW" ? (
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: MapLocator,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  height={35}
                  width="25%"
                  style={{
                    margin: 0,
                  }}
                />
              ) : (
                <Image src={Close} alt="close" height={35} width={20} />
              )}

              <Typography className={styles["map-btn-text"]} variant="body2">
                {mapToggleButtonText}
              </Typography>
            </Button>

            {mapDetails.isMapDetailsExist ? (
              <MapContainer
                driverLocation={mapDetails.driverLocation}
                customerLocation={mapDetails.customerLocation}
              />
            ) : (
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: OutForDelivery,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice",
                  },
                }}
                height={400}
                width="100%"
              />
            )}
          </>
        );

      case DeliveryStatus.NEAR_BY:
        return (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: NearBy,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width="100%"
          />
        );

      case DeliveryStatus.ARRIVED_AT_LOCATION:
        return (
          <img
            src={ArrivedAtLocation.src || ArrivedAtLocation.default}
            alt="Arrived"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              marginBottom: "-0.5rem",
            }}
          />
        );
      case DeliveryStatus.DELIVERED:
        return (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: Delivered,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width="100%"
          />
        );

      case DeliveryStatus.NOT_DELIVERED:
        return (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: NotDelivered,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width="100%"
          />
        );

      case DeliveryStatus.CANCEL_BY_USER:
        return (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: NotDelivered,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width="100%"
          />
        );

      default:
        return (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: OrderConfirmed,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width="100%"
          />
        );
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          padding: "0",
          display: "flex",
          alignItems: "center",
          borderRadius: "10px",
          position: "unset",
        }}
      >
        {/* <img className={styles['image-wrapper']}
          alt={image.alt}
          src={image.src?.src || ''}
          className={styles['image-wrapper']}
        /> */}
        {renderImage()}
      </Box>
      {!mapDetails.isMapDetailsExist && <OrderStatusImageDesc />}
    </Box>
  );
};

export default OrderStatusImage;
