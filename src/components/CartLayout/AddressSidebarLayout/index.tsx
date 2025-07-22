import { Box, Drawer, IconButton, styled, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import Back from "/public/assets/svg/back.svg";

import Cross from "/public/assets/svg/xmark.svg";

const AddressSidebar = styled(Drawer)({
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

interface Props {
  children: any;
  isOpen: any;
  onClose: any;
  title: any;
  isBackEnable?: boolean;
  onBack?: () => void;
}

const AddressSidebarLayout = (props: Props) => {
  const { children, isOpen, onClose, title, onBack } = props;

  if (!isOpen) return <React.Fragment />;

  return (
    <AddressSidebar
      anchor="right"
      open={isOpen}
      className="address-sidebar-drawer"
      onClose={() => {
        onClose();
      }}
    >
      <Box
        className="account-sidebar-drawer-header"
        sx={{
          width: "100%",
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: "0px 4px 32px rgba(0, 0, 0, 0.08)",

          backgroundColor: "#FFF",
          paddingLeft: "20px",
          paddingRight: "20px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Box
          className="title-back"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {onBack && (
            <IconButton onClick={onBack}>
              <Image src={Back} alt="Back" />
            </IconButton>
          )}
          <Typography
            component="h5"
            variant="h5"
            sx={{
              fontFamily: "SofiaPro",
              fontSize: "24px !important",
              fontWeight: "600",
              paddingTop: ".8rem",
            }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={() => {
            onClose();
          }}
        >
          <Image src={Cross} alt="cross" />
        </IconButton>
      </Box>

      <Box
        className="address-sidebar-drawer-body"
        sx={{
          width: "100%",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          flexGrow: 1,
          backgroundColor: "#fff",
          "> div": {
            flexGrow: 1,
          },
        }}
      >
        {children}
      </Box>
    </AddressSidebar>
  );
};

export default AddressSidebarLayout;
