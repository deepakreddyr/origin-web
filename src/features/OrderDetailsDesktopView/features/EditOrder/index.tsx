import { Box, Button, Divider, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";

import searchIcon from "../../../../assets/svg/search.svg";
import PaymentSidebarLayout from "../../../../components/PaymentLayout/PaymentSidebarLayout";
import Watch from "../../assets/editWatch.svg";
import { isEditOrderIsOpen, orderDetailsAtom } from "../../context/atoms";
import EditOrderPaymentPage from "../PaymentPage";
import { isPaymentIsOpen } from "../PaymentPage/context/atoms";
import SearchProduct from "../SearchProduct";
import { isSearchedProductEnableAtom } from "../SearchProduct/context/atoms";
import BillDetails from "./components/BillDetails";
import ItemsList from "./components/ItemsList";
import { editOrderAtom } from "./context/atoms";
import styles from "./styles.module.css";
import getEditCartTotal from "./utils/getEditCartTotal";

const EditOrder = () => {
  const [isOpen, setIsOpen] = useAtom(isEditOrderIsOpen);
  const [isPayment, setIsPaymentOpen] = useAtom(isPaymentIsOpen);
  const [editOrder] = useAtom(editOrderAtom);
  const [order] = useAtom(orderDetailsAtom);
  const [isSearchedProductOpen, setIsSearchedProductOpen] = useAtom(
    isSearchedProductEnableAtom
  );

  const total = React.useMemo(getEditCartTotal(editOrder), [
    editOrder.orderItems,
  ]);

  const toPay = React.useMemo(() => {
    return Number(total) - Number(order?.data?.total);
  }, [order, editOrder.orderItems]);

  if (isSearchedProductOpen) return <SearchProduct />;

  if (isPayment) return <EditOrderPaymentPage />;

  const renderInput = () => {
    return (
      <Box
        className={styles["search-box"]}
        sx={{
          marginTop: "1rem",
          position: "relative",
          maxWidth: 580,
          width: "100%",
          input: {
            borderRadius: "8px",
            backgroundColor: "#F9F0DA",
            boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.04)",
            height: 46,
            border: 0,
            width: "100%",
            paddingLeft: "48px",
            fontSize: 14,
            fontWeight: "500",
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
          },
        }}
      >
        <Box
          component="figure"
          className={styles["search-box-title"]}
          sx={{
            position: "absolute",
            left: "12px",
            transform: "translateY(-50%)",
            top: "50%",
            margin: 0,
            display: "block",
            width: "20px",
            height: "20px",
          }}
        >
          <Image src={searchIcon} alt="" />
        </Box>
        <input
          type="text"
          placeholder="Search products"
          onFocus={() => {
            setIsSearchedProductOpen(true);
          }}
          // onBlur={() => {
          //   setIsSearchedProductOpen(false);
          // }}
        />
      </Box>
    );
  };

  return (
    <PaymentSidebarLayout
      isOpen={isOpen}
      title="Edit Order"
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Typography>
        Forgot something? Now you can add/Remove items from this order!
      </Typography>
      <Box className={styles["edit-box"]}>
        <Box className={styles["edit-order-counter-timer"]}>
          <Image src={Watch} alt="watch" />
          <Typography className={styles["edit-order-counter-timer-text"]}>
            Available for 30 mins
          </Typography>
        </Box>
        {!(toPay > 0) && (
          <Typography className={styles["min-text"]}>
            Add Minimum of ₹1
          </Typography>
        )}
      </Box>
      {renderInput()}
      <Divider className={styles.divider} />
      <ItemsList />
      <BillDetails />
      <Button
        variant="contained"
        disabled={!(toPay > 0)}
        onClick={() => {
          setIsPaymentOpen(true);
        }}
      >
        Proceed
      </Button>
    </PaymentSidebarLayout>
  );
};

export default EditOrder;
