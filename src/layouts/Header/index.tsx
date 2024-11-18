import { IconButton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import AccountCircle from '../../assets/svg/account-circle.svg';
import cartIcon from '../../assets/svg/cart-icon.svg';
import HeaderLogoImage from '../../assets/svg/logo-header.svg';
import searchIcon from '../../assets/svg/search.svg';
import HideOnScroll from '@/components/HideOnScroll';
import { activeAccountsPageAtom, isAccountIsOpen } from '../../features/AccountPage/context/atoms';
import ActiveSidebar from '../../features/AccountPage/enums/ActiveSidebar';
import { isCartPageIsOpen } from '../../features/CartPage/context/atoms';
import { TabTypeConstant } from '../../features/Login/constants/tabTypeContent';
import { login } from '../../features/Login/context/atom';
import type { LoginAtom } from '../../features/Login/types/LoginAtom';
import { searchedProductAtom, searchStringAtom } from '../../features/SearchResults/context/atoms';
import { getSearchedProduct } from '../../features/SearchResults/services/getSearchedProduct';
import useDeviceType from '../../hooks/useDeviceType';
import { getSearchedProductResponse } from '@/features/SearchResults/services/getSearchedProductResponse';

interface HeaderProps {
  router: any;
}

const Header = (props: HeaderProps) => {
  const [loginDetails, setLoginDetails] = useAtom(login);
  const [, setIsCartOpen] = useAtom(isCartPageIsOpen);
  const [, setIsAccountOpen] = useAtom(isAccountIsOpen);
  const [, setActiveAccountsPageAtom] = useAtom(activeAccountsPageAtom);
  const [searchString, setSearchString] = useAtom(searchStringAtom);
  const [, setSearchedProduct] = useAtom(searchedProductAtom);
  const deviceType = useDeviceType();

  const router = useRouter();
  const { query: routerQuery } = router;
  const excludedHeaderRoutes = ['/terms-condition', '/privacy-policy'];
  const isSearchDisabled = excludedHeaderRoutes.includes(router.pathname);
  const isAccountDisabled = excludedHeaderRoutes.includes(router.pathname);
  const isCartDisabled = excludedHeaderRoutes.includes(router.pathname);
  const isAppView = routerQuery.view_type === 'app';

  const openAccount = () => {
    setIsAccountOpen(true);
    setActiveAccountsPageAtom(ActiveSidebar.ACCOUNT_MAIN);
  };

  const onToggleCart = () => {
    setIsCartOpen((prevValue) => !prevValue);
  };

  const loginToggler = () => {
    setLoginDetails((prevDetails: LoginAtom) => ({
      ...prevDetails,
      isLoginSidebarOpen: !prevDetails.isLoginSidebarOpen,
      tabType: TabTypeConstant.ENTER_MOBILE_NUMBER
    }));
  };

  const renderLogo = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          '> img': {
            maxHeight: '40px'
          }
        }}
      >
        <Link href="/" passHref>
          <Image src={HeaderLogoImage} alt="logo" />
        </Link>
      </Box>
    );
  };

  const renderButtons = () => {
    if (isAppView) return null; // Hide login button if view_type=app

    if (loginDetails.user) {
      if (isAccountDisabled || isCartDisabled) {
        return (
          <Button variant="outlined" color="info" onClick={loginToggler}>
            Login
          </Button>
        );
      }
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <IconButton onClick={openAccount}>
            <Image src={AccountCircle} alt="account icon" />
          </IconButton>
          <Box
            sx={{
              height: '1rem',
              borderRight: '1px solid #231F20'
            }}
          ></Box>
          <IconButton color="info" onClick={onToggleCart}>
            <Image src={cartIcon} alt="cartIcon" />
          </IconButton>
        </Box>
      );
    }
    return (
      <Button variant="outlined" color="info" onClick={loginToggler}>
        Login
      </Button>
    );
  };

  const fetchSearchedProduct = () => {
    getSearchedProductResponse(setSearchedProduct);
  };

  const fetchSearchedProductInput = (query: string) => {
    getSearchedProduct(query, setSearchedProduct);
  };

  const renderGPSDesktopView = () => {
    return (
      <Box
        className="gps-desktop-view"
        sx={{
          width: '100%',
          alignItems: 'center',
          gap: 4,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        {renderLogo()}
        {!isSearchDisabled && (
          <Box
            className="search-product"
            sx={{
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              maxWidth: 420,
              width: '100%'
            }}
          >
            <Box
              className="search-box"
              sx={{
                position: 'relative',
                maxWidth: 420,
                width: '100%',
                input: {
                  borderRadius: '20px',
                  backgroundColor: '#F8F4E9',
                  boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.04)',
                  height: 40,
                  border: 0,
                  width: '100%',
                  paddingLeft: '16px',
                  paddingRight: '58px',
                  fontSize: 14,
                  fontWeight: '500',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none'
                  }
                }
              }}
            >
              <Box
                component="figure"
                sx={{
                  position: 'absolute',
                  right: '17px',
                  transform: 'translateY(-50%)',
                  top: '50%',
                  margin: 0,
                  display: 'block',
                  width: '20px',
                  height: '20px'
                }}
              >
                <Image src={searchIcon} alt="" />
              </Box>
              <input
                style={{
                  color: '#000'
                }}
                type="text"
                placeholder="Search products"
                onChange={(event: any) => {
                  const { value } = event.target;
                  setSearchString(value);
                  fetchSearchedProductInput(value);
                }}
                value={searchString}
                onFocus={() => {
                  fetchSearchedProduct();

                  router.push('/home/search');
                }}
              />
            </Box>
          </Box>
        )}
        {renderButtons()}
      </Box>
    );
  };

  const renderGPSMobileView = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Box>{renderLogo()}</Box>
        <Box>{renderButtons()}</Box>
      </Box>
    );
  };

  const renderGPSHeader = () => (
    <Container className="header-container">
      <Toolbar
        sx={{
          marginTop: '2rem',
          justifyContent: 'space-between',
          boxShadow: '4px 4px 32px 0px #00000014',
          borderRadius: '40px',
          padding: '1rem 2rem'
        }}
        className="toolbar"
        disableGutters
      >
        {deviceType === 'mobile' ? renderGPSMobileView() : renderGPSDesktopView()}
      </Toolbar>
    </Container>
  );
  const renderHeader = () => {
    const excludedRoutes = ['/terms-condition', '/privacy-policy'];
    if (excludedRoutes.includes(router.pathname)) {
      return null;
    }

    switch (router.pathname) {
      case '/orders/[id]':
        return null;
      default:
        return renderGPSHeader();
    }
  };

  if (router.pathname === '/orders/[id]') return <></>;
  if (router.pathname === '/') return <></>;
  if (router.pathname === '/shop') return <></>;

  return (
    <>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar
          className="header"
          sx={{
            backgroundColor: '#fff',
            height: 78,
            display: 'flex',
            justifyContent: 'center',
            zIndex: '9999'
          }}
        >
          {renderHeader()}
        </AppBar>
      </HideOnScroll>
    </>
  );
};

export default Header;
