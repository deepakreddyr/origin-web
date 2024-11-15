import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";

import {
  activeAccountsPageAtom,
  activeSupportChatAtom,
  isAccountIsOpen,
} from "../../../AccountPage/context/atoms";
import ActiveSidebar from "../../../AccountPage/enums/ActiveSidebar";
// import CancelOrderCounter from '../../../OrderDetailsMobileView/components/CancelOrderCounter';
import BackImage from "../../assets/back.svg";
// import CancelOrderCounter from '../CancelOrderCounter';

interface Props {
  orderId: string | number;
}

const OrderStatusHeader = (props: Props) => {
  const { orderId } = props;
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);
  const [, setActiveSupportChat] = useAtom(activeSupportChatAtom);
  const [, setIsAccountOpen] = useAtom(isAccountIsOpen);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.5rem",
        background: "none",
      }}
    >
      <Box>
        <Box
          sx={{
            color: "#000000",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image src={BackImage} alt="back" />
          <Typography
            sx={{
              marginLeft: "1rem",
              fontFamily: "Lexend",
              fontWeight: "500",
              fontSize: "20px!important",
            }}
          >
            Order Details
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            marginLeft: "2rem",
          }}
        >
          <Typography
            sx={{
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: "16px",

              color: "#7D786D",
            }}
          >
            Order ID 782631
          </Typography>
          {/* <Badge color="secondary" badgeContent=" " variant="dot" /> */}
          <Typography
            sx={{
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: "16px",
              marginLeft: "1.5rem",
              color: "#7D786D",
            }}
          >
            Today 11:05am
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: " flex-end",
        }}
      >
        {/* <CancelOrderCounter /> */}
        <Typography
          sx={{
            fontFamily: "Lexend",
            fontSize: "14px!important",
            color: "#00855B",
            border: "2px solid #F2EEE4",
            padding: "0.4rem 1rem",
            borderRadius: "16px",
            marginLeft: "0.5rem",
            backgroundColor: "#fffcf4",
            cursor: "pointer",
          }}
          onClick={() => {
            setActiveSupportChat(String(orderId));
            setActiveAccountsPage(ActiveSidebar.SUPPORT_CHAT);
            setIsAccountOpen(true);
          }}
        >
          HELP
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderStatusHeader;
