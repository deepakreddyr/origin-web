import { Box, Button, IconButton, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React from 'react';

import Account from '../../assets/account.svg';
import Edit from '../../assets/edit.svg';
import { activeAccountsPageAtom, profileAtom } from '../../context/atoms';
import ActiveSidebar from '../../enums/ActiveSidebar';
import { useDispatch } from 'react-redux';
import { setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';

const AccountIntro = () => {
  const [profile] = useAtom(profileAtom);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);
  const dispatch = useDispatch();
  return (
    <Box
      sx={{
        borderRadius: '16px',
        backgroundColor: 'none',
        border: '1px solid #F2EEE4',
        padding: '15px 20px 15px',
        display: 'flex',
        gap: '12px'
      }}
    >
      <Image src={Account} alt="account" />

      <Box
        className="account-intro"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          width: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20
          }}
          className="edit-account"
        >
          <Typography
            sx={{
              fontFamily: 'SofiaPro',
              fontWeight: '600',
              fontSize: '16px'
            }}
            component="span"
            variant="body1"
          >
            {profile.data?.name}
          </Typography>
          <IconButton
            className="p-0"
            onClick={() => {
              dispatch(setTabType(TabTypeConstant.EDIT_ACCOUNT));
              // setActiveAccountsPage(ActiveSidebar.EDIT_ACCOUNT)
            }}
          >
            <Image src={Edit} alt="edit" />
          </IconButton>
        </Box>
        <Box
          className="account-contact"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Typography
            variant="body2"
            component="span"
            sx={{
              color: 'rgba(0, 0, 0, 0.60)',
              fontWeight: '400',
              fontFamily: 'SofiaPro',
              fontSize: '12px'
            }}
          >
            {profile.data?.phone}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            sx={{
              color: 'rgba(0, 0, 0, 0.60)',
              fontWeight: '400',
              borderLeft: 'rgba(0, 0, 0, 0.30) 2px solid',
              paddingLeft: '4px',
              fontFamily: 'SofiaPro',
              fontSize: '12px'
            }}
          >
            {profile.data?.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountIntro;
