'use client';

import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Arrow from '../../../../../public/assets/svg/arrow-right.svg';
import LogoutIcon from '../../../../../public/assets/svg/logout.svg';
import { activeAccountsPageAtom, isAccountIsOpen, profileAtom } from '../../context/atoms';
import ActiveSidebar from '../../enums/ActiveSidebar';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { setLoginDetails, setTabType } from '@/store/slice/loginSlice';
import { getAddress } from '../../services/getAddress';
import { addressAtom } from '@/features/Address/context/atoms';
import { clearCart } from '@/store/slice/CartSlice';
import { setRouteSourceToLs } from '@/utilities/utils';
import { trackMixpanelEvent } from '@/utilities/mixpanel';
import { AnalyticsEvents } from '@/utilities/mixpanelEvents';

const AccountSettings = () => {
  const [, setIsOpen] = useAtom(isAccountIsOpen);
  const [address, setAddress] = useAtom(addressAtom);
  const [profile, setProfileAtom] = useAtom(profileAtom);
  const dispatch = useDispatch();

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleLogout = () => {
    // Track logout event before clearing session
    trackMixpanelEvent(AnalyticsEvents.LOGOUT);

    dispatch(
      setLoginDetails({
        isLogin: false,
        user: null,
        tabType: TabTypeConstant.ENTER_MOBILE_NUMBER,
        isSidebarOpen: false
      })
    );
    dispatch(clearCart());
    localStorage.clear();
    sessionStorage.clear();

    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }

    setAddress({
      loading: false,
      success: false,
      error: false,
      address: null,
      defaultAddress: null
    });

    setProfileAtom({
      loading: false,
      success: false,
      error: false,
      data: null
    });

    // Hard refresh so all API data and auth state is completely cleared
    window.location.reload();
  };

  const list = [
    {
      title: 'My Orders',
      desc: 'Order history & Status',
      onClick: () => {
        setRouteSourceToLs(TabTypeConstant.ACCOUNT_MAIN);
        dispatch(setTabType(TabTypeConstant.YOUR_ORDERS));
      }
    },
    {
      title: 'Addresses',
      desc: 'Add & manage address',
      onClick: () => {
        setRouteSourceToLs(TabTypeConstant.ACCOUNT_MAIN);
        dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
      }
    },
    {
      title: 'Settings',
      desc: 'Account related settings and info',
      onClick: () => {
        setRouteSourceToLs(TabTypeConstant.ACCOUNT_MAIN);
        dispatch(setTabType(TabTypeConstant.SETTING));
      }
    },
    {
      title: 'Help',
      desc: 'FAQs & Support',
      onClick: () => {
        setRouteSourceToLs(TabTypeConstant.ACCOUNT_MAIN);
        dispatch(setTabType(TabTypeConstant.HELP_FAQ));
      }
    },
    {
      title: 'Log Out',
      desc: '',
      onClick: () => setOpenConfirm(true)
    }
  ];

  return (
    <>
      <Box
        className="account-list-group"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          ul: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: 0,
            margin: 0,
            listStyleType: 'none',
            li: {
              borderRadius: '10px',
              backgroundColor: '#F8F4E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px 20px',
              cursor: 'pointer',
              border: '1px solid #F8F4E9',
              minHeight: 62,
              '.account-list-info': {
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                span: {
                  fontWeight: 'normal',
                  display: 'block',
                  color: 'rgba(0, 0, 0, 0.50)'
                }
              },
              figure: {
                flexShrink: 0,
                width: 12,
                height: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 0
              },
              '&:hover': {
                borderColor: '#00855B'
              }
            },
            '&:not(:first-child)': {
              paddingTop: '20px'
            }
          }
        }}
      >
        <Box component="ul" className="account-list">
          {list.map((item, i) => (
            <Box key={i} component="li" className="account-list-item" onClick={item.onClick}>
              <Box className="account-list-info">
                <Typography
                  variant="body1"
                  component="p"
                  sx={{
                    fontFamily: 'SofiaPro',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: item.title === 'Log Out' ? '#C70000' : '#000'
                  }}
                >
                  {item.title}
                </Typography>
                {item.desc && (
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      fontFamily: 'SofiaPro',
                      fontSize: '12px',
                      fontWeight: '400',
                      color: '#231F20CC'
                    }}
                  >
                    {item.desc}
                  </Typography>
                )}
              </Box>
              <Box component="figure">
                <Image src={item.title === 'Log Out' ? LogoutIcon : Arrow} alt="Icon" />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title" sx={{ fontWeight: 600 }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description" sx={{ color: '#555' }}>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirm(false)}
            sx={{
              fontWeight: 600,
              color: '#333',
              borderColor: '#ccc'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenConfirm(false);
              handleLogout();
            }}
            color="error"
            variant="contained"
            sx={{ fontWeight: 600 }}
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccountSettings;
