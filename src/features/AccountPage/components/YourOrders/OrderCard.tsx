import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { Order } from "../../types/Order";
import ActiveSidebar from "../../enums/ActiveSidebar";
import styles from "./style.module.css";
import { useAtom } from "jotai";
import { activeAccountsPageAtom, isAccountIsOpen } from "../../context/atoms";
import { DateTime } from "luxon"; // Import DateTime from Luxon

interface Props {
  order: Order;
}

const OrderCard = (props: Props) => {
  const { order } = props;
  const router = useRouter();
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);
  const [, setIsOpen] = useAtom(isAccountIsOpen);

  const formattedDate = order.created_at
    ? DateTime.fromMillis(order.created_at * 1000).toFormat(
        "h:mm a '-' MMM  d, yyyy "
      )
    : "";

  const redirectOnClick = () => {
    // router.push(`/home/orders/${order.order_id}`);
    alert("to be integrated the product details pages");
    setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
    setIsOpen(false);
  };
  const renderStatus = () => {
    if (order.status === "Delivered") {
      return (
        <Typography
          sx={{
            background: "rgba(35, 31, 32, 0.12)",
            color: "#231F20",
            padding: "0.3rem 0.7rem",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "SofiaPro",
          }}
        >
          DELIVERED
        </Typography>
      );
    }
    if (
      order.status === "Not Delivered" ||
      order.status === "Rejected by admin"
    ) {
      return (
        <Typography
          sx={{
            background: "rgba(199, 0, 0, 0.12)",
            color: "#C70000",
            padding: "0.3rem 0.7rem",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "SofiaPro",
          }}
        >
          NOT DELIVERED
        </Typography>
      );
    }
    return (
      <Typography
        sx={{
          background: "rgba(37, 135, 77, 0.12)",
          color: "#25874D",
          padding: "0.3rem 0.7rem",
          border: "none",
          borderRadius: "624px",
          fontSize: "12px",
          fontWeight: 700,
          fontFamily: "SofiaPro",
        }}
      >
        IN PROGRESS
      </Typography>
    );
  };
  return (
    <Box
      key={order.order_id}
      component="ul"
      className={`order-list ${styles["order-list"]}`}
      onClick={redirectOnClick}
      sx={{ cursor: "pointer", background: "var(--Beige-Light-100, #F8F4E9)" }}
    >
      <Box
        component="li"
        className={`order-list-item ${styles["order-list-item"]}`}
      >
        <Box
          className={`order-list-item-body ${styles["order-list-item-body"]}`}
        >
          <Box
            className={`order-list-item-order-id ${styles["order-list-item-order-id"]}`}
          >
            <Typography
              variant="body2"
              component="span"
              sx={{ fontWeight: 700, fontFamily: "SofiaPro", fontSize: "14px" }}
            >
              {`ORDER ID ${order.order_id}`}
            </Typography>
            {renderStatus()}
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 400,
              fontFamily: "SofiaPro",
              fontSize: "13px",
              color: "#000000CC",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitLineClamp: 2,
            }}
          >
            {order.item_details}
          </Typography>
        </Box>
        <Box
          className={`order-list-item-footer ${styles["order-list-item-footer"]}`}
        >
          <Typography
            sx={{
              color: "#231F2099",
              fontSize: "13px",
              fontFamily: "SofiaPro",
              fontWeight: 500,
            }}
          >{` Ordered at  ${formattedDate}`}</Typography>
          <Typography
            variant="body2"
            component="span"
            sx={{
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            Total ₹{order.total}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderCard;
