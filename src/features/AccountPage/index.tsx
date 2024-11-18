import { useAtom } from 'jotai';
import React from 'react';

import AccountEdit from './components/AccountEdit';
import AccountMain from './components/AccountMain';
import HelpFaq from './components/HelpFaq';
import ManageAddress from './components/ManageAddress';
import Rating from './components/Rating';
import ReferEarn from './components/ReferEarn';
// import RewardDetails from './components/RewardDetails';
import Settings from './components/Settings';
import SupportChat from './components/SupportSystem';
import YourOrders from './components/YourOrders';
import YourRewards from './components/YourRewards';
import { activeAccountsPageAtom, profileAtom } from './context/atoms';
import ActiveSidebar from './enums/ActiveSidebar';
import { getProfile } from './services/getProfile';

const Account = () => {
  const [, setProfileAtom] = useAtom(profileAtom);
  const [activeAccountsPage] = useAtom(activeAccountsPageAtom);

  React.useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      getProfile(setProfileAtom);
    }
  }, []);
  const renderAccountSidebars = () => {
    switch (activeAccountsPage) {
      case ActiveSidebar.ACCOUNT_MAIN: {
        return <AccountMain />;
      }
      case ActiveSidebar.SETTING: {
        return <Settings />;
      }
      case ActiveSidebar.EDIT_ACCOUNT: {
        return <AccountEdit />;
      }
      case ActiveSidebar.MANAGE_ADDRESS: {
        return <ManageAddress />;
      }
      case ActiveSidebar.YOUR_ORDERS: {
        return <YourOrders />;
      }
      case ActiveSidebar.RATING: {
        return <Rating />;
      }
      case ActiveSidebar.YOUR_REWARDS: {
        return <YourRewards />;
      }
      case ActiveSidebar.REFER_EARN: {
        return <ReferEarn />;
      }
      case ActiveSidebar.SUPPORT_CHAT: {
        return <SupportChat />;
      }
      case ActiveSidebar.REVIEW_RATING: {
        return <Rating />;
      }

      // case ActiveSidebar.REWARD_DETAILS: {
      //   return <RewardDetails />;
      // }
      case ActiveSidebar.HELP_FAQ: {
        return <HelpFaq />;
      }
      default: {
        return <AccountMain />;
      }
    }
  };

  return <>{renderAccountSidebars()}</>;
};

export default Account;
