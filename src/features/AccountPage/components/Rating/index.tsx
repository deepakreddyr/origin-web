import { useAtom } from 'jotai';
import React from 'react';

import AccountSidebarLayout from '../../../../components/AccountLayout/AccountSidebarLayout';
import {
  activeAccountsPageAtom,
  isAccountIsOpen,
  rateOrderAtom,
} from '../../context/atoms';
import ActiveSidebar from '../../enums/ActiveSidebar';
// import Rate from './Rate';
import RatingTabs from './RatingTabs';

const Rating = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);
  const [, setRateOrder] = useAtom(rateOrderAtom);

  return (
    <AccountSidebarLayout
      isOpen={isOpen}
      title="Rating"
      onClose={() => {
        setIsOpen(false);
        setRateOrder(null);
      }}
      onBack={() => {
        setActiveAccountsPage(ActiveSidebar.YOUR_ORDERS);
        setRateOrder(null);
      }}
    >
      {/* <Rate /> */}

      <RatingTabs />
    </AccountSidebarLayout>
  );
};

export default Rating;
