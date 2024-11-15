import { Box } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";

import AccountSidebarLayout from "../../../../components/AccountLayout/AccountSidebarLayout";
import { activeAccountsPageAtom, isAccountIsOpen } from "../../context/atoms";
import ActiveSidebar from "../../enums/ActiveSidebar";
import AccountIntro from "./AccountIntro";
import AccountSettings from "./AccountSettings";

const AccountMain = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);

  return (
    <AccountSidebarLayout
      isOpen={isOpen}
      title="My Account"
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Box
        className="account-main"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingBottom: "20px",
        }}
      >
        <AccountIntro />
        <AccountSettings />
      </Box>
    </AccountSidebarLayout>
  );
};

export default AccountMain;
