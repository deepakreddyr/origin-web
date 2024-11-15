import Box from '@mui/material/Box';
import { useAtom } from 'jotai';
import React from 'react';

import AccountSidebarLayout from '../../../../components/AccountLayout/AccountSidebarLayout';
import { activeAccountsPageAtom, isAccountIsOpen } from '../../context/atoms';
import ActiveSidebar from '../../enums/ActiveSidebar';
import BreakdownCoin from './BreakdownCoin';
import RewardCoin from './RewardCoin';
import TermsUse from './TermsUse';

const RewardDetails = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);

  return (
    <AccountSidebarLayout
      isOpen={isOpen}
      title="Reward Details"
      onClose={() => {
        setIsOpen(false);
      }}
      onBack={() => {
        setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
      }}
    >
      <Box
        className="reward-details"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <RewardCoin />
        <BreakdownCoin />
        <TermsUse />
      </Box>
    </AccountSidebarLayout>
  );
};

export default RewardDetails;
