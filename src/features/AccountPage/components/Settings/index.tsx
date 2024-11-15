import { useAtom } from "jotai";
import React from "react";

import AccountSidebarLayout from "../../../../components/AccountLayout/AccountSidebarLayout";
import { activeAccountsPageAtom, isAccountIsOpen } from "../../context/atoms";
import ActiveSidebar from "../../enums/ActiveSidebar";
import AccountSettings from "./AccountSettings";
// import RemoveAccount from './RemoveAccount';

const Settings = () => {
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);

  return (
    <AccountSidebarLayout
      isOpen={isOpen}
      title="Settings"
      onClose={() => {
        setIsOpen(false);
        setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
      }}
      onBack={() => {
        if (isDeleting) {
          setIsDeleting(false);
          return;
        }
        setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
      }}
    >
      <AccountSettings
        deleteState={[isDeleting, setIsDeleting]}
        setIsOpen={setIsOpen}
      />
    </AccountSidebarLayout>
  );
};

export default Settings;
