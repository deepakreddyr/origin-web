import { useAtom } from "jotai";
import React from "react";

import AccountSidebarLayout from "../../../../components/AccountLayout/AccountSidebarLayout";
import {
  activeAccountsPageAtom,
  isAccountIsOpen,
  ordersAtom,
} from "../../context/atoms";
import ActiveSidebar from "../../enums/ActiveSidebar";
import { getOrders } from "../../services/getOrders";
import All from "./All";

const YourOrders = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);
  const [, setOrders] = useAtom(ordersAtom);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);

  React.useEffect(() => {
    getOrders(setOrders);
  }, []);
  return (
    <AccountSidebarLayout
      isOpen={isOpen}
      title="Your Orders"
      onClose={() => {
        setIsOpen(false);
      }}
      onBack={() => {
        setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
      }}
    >
      <All />
    </AccountSidebarLayout>
  );
};

export default YourOrders;
