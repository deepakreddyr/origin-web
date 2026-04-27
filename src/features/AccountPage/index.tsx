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
import { useSelector } from 'react-redux';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';

const Account = () => {
  const [activeAccountsPage] = useAtom(activeAccountsPageAtom);
  const loginDetails = useSelector((state: any) => state.loginDetails);

  // Profile is fetched by GlobalLaunchListener via launch API — no separate call needed
  const renderAccountSidebars = () => {
    switch (loginDetails.tabType) {
      case TabTypeConstant.ACCOUNT_MAIN: {
        return <AccountMain />;
      }
      case TabTypeConstant.SETTING: {
        return <Settings />;
      }
      case TabTypeConstant.EDIT_ACCOUNT: {
        return <AccountEdit />;
      }
      case TabTypeConstant.MANAGE_ADDRESS: {
        return <ManageAddress />;
      }
      case TabTypeConstant.YOUR_ORDERS: {
        return <YourOrders />;
      }
      case TabTypeConstant.RATING: {
        return <Rating />;
      }
      case TabTypeConstant.YOUR_REWARDS: {
        return <YourRewards />;
      }
      case TabTypeConstant.REFER_EARN: {
        return <ReferEarn />;
      }
      case TabTypeConstant.SUPPORT_CHAT: {
        return <SupportChat />;
      }
      case TabTypeConstant.REVIEW_RATING: {
        return <Rating />;
      }

      // case ActiveSidebar.REWARD_DETAILS: {
      //   return <RewardDetails />;
      // }
      case TabTypeConstant.HELP_FAQ: {
        return <HelpFaq />;
      }
      default: {
        break;
        // return <AccountMain />
      }
    }
  };
  return <>{renderAccountSidebars()}</>;
};

export default Account;
