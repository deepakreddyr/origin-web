import { Box, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React, { useEffect } from 'react';

import Arrow from '../../../../../public/assets/svg/arrow-right.svg';
import LogoutIcon from '../../../../../public/assets/svg/logout.svg';
import { activeAccountsPageAtom, isAccountIsOpen, profileAtom } from '../../context/atoms';
import ActiveSidebar from '../../enums/ActiveSidebar';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { login } from '@/components/Login/context/atom';
import { LoginAtom } from '@/components/Login/types/LoginAtom';
import { useDispatch } from 'react-redux';
import { setLoginDetails, setTabType } from '@/store/slice/loginSlice';
import { getAddress } from '../../services/getAddress';
import { addressAtom } from '@/features/Address/context/atoms';
import { clearCart } from '@/store/slice/CartSlice';

const AccountSettings = () => {
  const [, setIsOpen] = useAtom(isAccountIsOpen);
  const [address, setAddress] = useAtom(addressAtom);
  const [profile, setProfileAtom] = useAtom(profileAtom);

  const dispatch = useDispatch();

  // useEffect(() => {
  //     getAddress(setAddress)
  // }, [])

  const list = [
    {
      title: 'Your Orders',
      desc: 'Order history & Statues',
      onClick: () => {
        dispatch(setTabType(TabTypeConstant.YOUR_ORDERS));
      }
    },
    {
      title: 'Addresses',
      desc: 'Manage & add new address',
      onClick: () => {
        dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
      }
    },

    {
      title: 'Settings',
      desc: 'Notifications & Account informations',
      onClick: () => {
        dispatch(setTabType(TabTypeConstant.SETTING));
      }
    },
    {
      title: 'Help',
      desc: 'FAQs & Support',
      onClick: () => {
        dispatch(setTabType(TabTypeConstant.HELP_FAQ));
      }
    },
    {
      title: 'Log Out',
      desc: '',
      onClick: () => {
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
        setAddress({
          loading: false,
          success: false,
          error: false,
          address: null,
          defaultAddress: null
        });
        setProfileAtom({ loading: false, success: false, error: false, data: null });
      }
    }
    // {
    //   title: 'Rewards',
    //   desc: 'View your rewards collected',
    //   onClick: () => {
    //     setActiveAccountsPage(ActiveSidebar.YOUR_REWARDS);
    //   },
    // },
    // {
    //   title: 'Saved Payment Methods',
    //   desc: 'Manage your saved Wallets, & Bank cards',
    //   onClick: () => {
    //     setActiveAccountsPage(ActiveSidebar.YOUR_ORDERS);
    //   },
    // },
  ];

  return (
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
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
          margin: 0,
          listStyleType: 'none',
          li: {
            borderRadius: '10px',
            backgroundColor: '#F8F4E9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '15px 20px 15px',
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
              border: '1px solid #00855B'
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
          <Box key={`${item}-${i}`} component="li" className="account-list-item" onClick={item.onClick}>
            <Box className="account-list-info">
              <Typography
                variant="body1"
                component="h5"
                sx={{
                  fontFamily: 'SofiaPro',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: item.title === 'Log Out' ? '#C70000' : '#000'
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'SofiaPro',
                  fontSize: '12px',
                  fontWeight: '400',
                  color: '#231F20CC'
                }}
                variant="body2"
                component="span"
              >
                {item.desc}
              </Typography>
            </Box>
            <Box component="figure">
              <Image src={item.title === 'Log Out' ? LogoutIcon : Arrow} alt="Icon" />
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        component="ul"
        className="account-list accont-seetings"
        sx={{
          borderTop: '1px solid rgba(0, 0, 0, 0.04)'
        }}
      ></Box>
    </Box>
  );
};

export default AccountSettings;
