import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { DateTime } from "luxon"; // Import DateTime from Luxon
import { useRouter } from "next/router";
import React from "react";

import { cartItems, isCartPageIsOpen } from "../../../CartPage/context/atoms";
import {
  activeAccountsPageAtom,
  isAccountIsOpen,
  ordersAtom,
  rateOrderAtom,
} from "../../context/atoms";
import ActiveSidebar from "../../enums/ActiveSidebar";
import type { Order } from "../../types/Order";
import fabricateReOrderItemsList from "../../utils/fabricateReOrderItemsList";
import NoData from "./NoData";
import styles from "./style.module.css";
import OrderCard from "./OrderCard";

const All = (props: { filter?: string }) => {
  const { filter } = props;
  const [orders] = useAtom(ordersAtom);
  const [, setIsCartOpen] = useAtom(isCartPageIsOpen);

  const [, setRateOrder] = useAtom(rateOrderAtom);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);
  const [, setIsOpen] = useAtom(isAccountIsOpen);
  const [, setCartItemDetails] = useAtom(cartItems);

  const router = useRouter();

  const renderItems = (order: Order) => {
    const formattedDate = order.created_at
      ? DateTime.fromMillis(order.created_at * 1000).toFormat(
          "h:mm a '-' MMM  d, yyyy "
        )
      : "";

    const onToggleCart = () => {
      setIsCartOpen((prevValue) => !prevValue);
    };

    const onReorder = async (event: any) => {
      event.stopPropagation();

      const fabricatedCartItems = await fabricateReOrderItemsList(
        String(order.order_id)
      );

      if (fabricatedCartItems) {
        setCartItemDetails(fabricatedCartItems);
        localStorage.setItem("cartItem", JSON.stringify(fabricatedCartItems));
      }

      // open cart
      onToggleCart();
    };

    const redirectOnClick = () => {
      router.push(`/home/orders/${order.order_id}`);
      setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
      setIsOpen(false);
    };

    return (
      <>
        <OrderCard order={order} />
      </>
    );
  };

  const renderOrders = () => {
    if (!orders.loading) {
      if (!orders.data) return <NoData />;
      if (!filter) return orders.data.map(renderItems);
      return orders.data
        .filter((i) => {
          return i.type === filter;
        })
        .map(renderItems);
    }
  };

  return (
    <Box className={`order-wrapper ${styles["order-wrapper"]}`}>
      {renderOrders()}
    </Box>
  );
};

export default All;
