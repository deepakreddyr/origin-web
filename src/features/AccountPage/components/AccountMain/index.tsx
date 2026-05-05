import { Box } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';

import AccountSidebarLayout from '../../../../components/AccountLayout/AccountSidebarLayout';
import { activeAccountsPageAtom, isAccountIsOpen } from '../../context/atoms';
import ActiveSidebar from '../../enums/ActiveSidebar';
import AccountIntro from './AccountIntro';
import AccountSettings from './AccountSettings';
import SidebarWrapper from '@/components/Login/components/SidebarWrapper';
import { trackEvent, timeEvent, stopTrackTime } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';

const AccountMain = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);

  React.useEffect(() => {
    trackEvent(AnalyticsEvents.ACCOUNT);
    timeEvent(AnalyticsEvents.TRACK_NEED_HELP); // Reusing as general account timing if needed
    return () => {
      stopTrackTime(AnalyticsEvents.TRACK_NEED_HELP);
    };
  }, []);

  const onClickBackButton = () => {};
  let isBackButtonEnable = true;
  return (
    <Box
      // className="account-main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        paddingBottom: '20spx'
      }}
    >
      {/* <AccountSidebarLayout
                isOpen={isOpen}
                title="My Account"
                onClose={() => {
                    setIsOpen(false)
                }}
            > */}

      <AccountIntro />
      <AccountSettings />
      {/* </AccountSidebarLayout> */}
    </Box>
  );
};

export default AccountMain;
