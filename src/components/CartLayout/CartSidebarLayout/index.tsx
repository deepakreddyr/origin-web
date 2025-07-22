import { Box, Drawer, IconButton, styled, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

import Back from "../../../assets/svg/back.svg";
import Cross from "../../../assets/svg/xmark.svg";

const CartSidebarDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    maxWidth: 480,
    width: "100%",
    // backgroundColor: '#F9F0DA',
    boxShadow: "-5px 0px 14px 0px rgba(0, 0, 0, 0.12)",
    display: "flex",
    flexDirection: "column",
    height: "100svh",
    overflow: "auto",
  },
});

const CartSidebarLayout = (props: {
  children: any;
  isOpen: any;
  onClose: any;
  title: any;
  isBackEnable?: boolean;
  onBack?: () => void;
}) => {
  const { children, isOpen, onClose, title, onBack } = props;

  if (!isOpen) return <React.Fragment />;

  return (
    <CartSidebarDrawer
      anchor="right"
      open={isOpen}
      className="cart-sidebar-drawer"
      onClose={() => {
        onClose();
      }}
    >
      <Box
        className="cart-sidebar-drawer-header"
        sx={{
          width: "100%",
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          backgroundColor: "#FFF",
          paddingLeft: "20px",
          paddingRight: "20px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <div className="flex items-center gap-2">
          {!!onBack && (
            <IconButton
              onClick={() => {
                if (onBack) onBack();
              }}
            >
              <Image src={Back} alt="Back" />
            </IconButton>
          )}
          <Typography
            component="h3"
            variant="h5"
            sx={{
              fontFamily: "SofiaPro",
              fontSize: "24px !important",
              fontWeight: "600",
            }}
          >
            {title}
          </Typography>
        </div>
        <IconButton
          onClick={() => {
            onClose();
          }}
        >
          <Image src={Cross} alt="cross" />
        </IconButton>
      </Box>
      <Box
        className="cart-sidebar-drawer-body"
        sx={{
          width: "100%",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          height: "calc(100svh - 100px)",
        }}
      >
        {children}
      </Box>
    </CartSidebarDrawer>
  );
};

export default CartSidebarLayout;
