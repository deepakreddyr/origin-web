// import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";

import AccountSidebarLayout from "../../../../components/AccountLayout/AccountSidebarLayout";
import {
  activeAccountsPageAtom,
  activeSupportChatAtom,
  isAccountIsOpen,
  supportChatAtom,
} from "../../context/atoms";
import ActiveSidebar from "../../enums/ActiveSidebar";
import { getSupportChat } from "../../services/getSupprtChat";
import ChatScreen from "../ChatScreen";

const SupportChat = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);
  const [, setSupportChat] = useAtom(supportChatAtom);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);
  const [activeSupportChat, setActiveSupportChat] = useAtom(
    activeSupportChatAtom
  );

  React.useEffect(() => {
    if (activeSupportChat) getSupportChat(setSupportChat, activeSupportChat);
  }, []);

  return (
    <AccountSidebarLayout
      isOpen={isOpen}
      title="Support"
      onClose={() => {
        setActiveSupportChat(null);
        setIsOpen(false);
      }}
      onBack={() => {
        setActiveSupportChat(null);
        setActiveAccountsPage(ActiveSidebar.HELP_FAQ);
      }}
    >
      <Typography
        sx={{
          mb: "1rem",
          mt: "1rem",
        }}
      >
        Order Id: {activeSupportChat}
      </Typography>
      <ChatScreen />
    </AccountSidebarLayout>
  );
};

export default SupportChat;
