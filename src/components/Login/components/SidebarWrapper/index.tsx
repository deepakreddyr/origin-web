import { ArrowBack } from "@mui/icons-material";
import { Box, Drawer, IconButton, styled, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";

import LocationIcon from "../../../../../public/assets/svg/location-serviceable.svg";
import Cross from "../../../../../public/assets/svg/xmark.svg";
import { login } from "../../context/atom";
import type { LoginAtom } from "../../types/LoginAtom";
import { TabTypeConstant } from "../../constants/tabTypeContent";

const CustomSidebarDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    maxWidth: 480,
    width: "100%",
    backgroundColor: "none",
    boxShadow: "-5px 0px 14px 0px rgba(0, 0, 0, 0.12)",
    display: "flex",
    flexDirection: "column",
    height: "100svh",
    overflow: "auto",
  },
});

interface Props {
  children: any;
  onClickBackButton: () => void;
  isBackButtonEnable: boolean;
  loginDetails: any;
}

const SidebarWrapper = (props: Props) => {
  const { children, onClickBackButton, isBackButtonEnable } = props;
  const [loginDetails, setLoginDetails] = useAtom(login);

  const getHeaderSidebarName = () => {
    switch (loginDetails.tabType) {
      case TabTypeConstant.ENTER_MOBILE_NUMBER:
        return "Login / Sign up";

      case TabTypeConstant.ENTER_OTP:
        return "Login / Sign up";

      case TabTypeConstant.REGISTER:
        return "Registration";

      default:
        return "Login / Sign up";
    }
  };

  if (!loginDetails.isLoginSidebarOpen) return <React.Fragment />;

  return (
    <CustomSidebarDrawer
      anchor="right"
      className="sidebar sidebar-right"
      open={loginDetails.isLoginSidebarOpen}
      onClose={() => {
        setLoginDetails((prevDetails: LoginAtom) => ({
          ...prevDetails,
          isLoginSidebarOpen: false,
        }));
      }}
    >
      <Box
        className="sidebar_header"
        sx={{
          height: 78,
          display: "flex",
          alignItems: "flex-center",
          justifyContent: "center",
          width: "100%",
          position: "sticky",
          paddingLeft: 2,
          paddingRight: 2,
          top: 0,
          borderBottom: "1px solid #F2EEE4",
          padding: "1rem",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        {isBackButtonEnable && (
          <Box
            className="sidebar_header_inner"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              mr: "10px",
            }}
          >
            <IconButton
              onClick={() => {
                onClickBackButton();
              }}
            >
              <ArrowBack />
            </IconButton>
          </Box>
        )}
        <Box
          className="sidebar_header_inner"
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{
              fontFamily: "Stinger",
              fontSize: "24px !important",
              fontWeight: 700,
            }}
          >
            {getHeaderSidebarName()}
          </Typography>
          <IconButton
            onClick={() => {
              setLoginDetails((prevDetails: LoginAtom) => ({
                ...prevDetails,
                isLoginSidebarOpen: false,
              }));
            }}
          >
            <Image src={Cross} alt="cross" />
          </IconButton>
        </Box>
      </Box>
      <Box
        className="sidebar_body"
        sx={{
          display: "flex",
          marginTop: "2rem",
          justifyContent: "center",
          flex: 1,
          paddingLeft: 2,
          paddingRight: 2,
          width: "100%",
        }}
      >
        <Box
          className="sidebar_body_inner"
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 400,
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
      {/* this is kept on intention */}
      {/* <Box
        className="sidebar_footer"
        sx={{
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          size="small"
          sx={{
            gap: 1,
            fontSize: 12,
            border: "none",
            borderRadius: "48px",
            backgroundColor: "#F2EEE4",
            color: "#231F20",
            padding: "0.7rem",
          }}
        >
          <Image src={LocationIcon} alt="Location Icon" />
          Let’s check your location is serviceable
        </Button>
      </Box> */}
    </CustomSidebarDrawer>
  );
};

export default SidebarWrapper;
