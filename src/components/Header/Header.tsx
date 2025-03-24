import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  Menu,
  MenuItem,
  Container,
  useTheme
} from '@mui/material';
import originLogo from '/public/assets/images/originLogo.png';
import hamberger from '/public/assets/images/hamberger.png';
import Link from 'next/link';
import { OriginCartIcon, OriginChevronDown, OriginLogoDark, OriginMenuIcon } from '@/Icons/OriginIcons';
import classNames from 'classnames';
import { MobileDrawer, Submenu, Logo, MenuItems, SearchBar } from '.';
import OriginButton from '../OriginButton';
import { MainMenuType } from '@/utilities/types';
import { Marquee } from '@devnomic/marquee';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
import { login } from '../Login/context/atom';
import type { LoginAtom } from '../Login/types/LoginAtom';
import userIcon from '/public/assets/images/userIcon.png';
import Dropdown from '../OriginDropDown/OriginDropDown';
import { useAtom } from 'jotai';
import OffersRibbon from './OffersRibbon';
import useDeviceType from '@/hooks/useDeviceType';
import Image from 'next/image';
import { activeAccountsPageAtom, isAccountIsOpen, profileAtom } from '@/features/AccountPage/context/atoms';
import ActiveSidebar from '@/features/AccountPage/enums/ActiveSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { isCartPageIsOpen } from '@/features/CartPage/context/atoms';
import cartIcon from '/public/assets/icons/cartIcon.png';
import { setIsSidebarOpen, setLoginDetails, setTabType } from '@/store/slice/loginSlice';
import { useServerInsertedHTML } from 'next/navigation';
import { setCartItems, setCartTabType } from '@/store/slice/CartSlice';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import { useRouter } from 'next/router';
import InputSearchbar from './InputSearchbar';
type Props = {
  mainMenuItems: MainMenuType[];
  isHeaderSticky: any;
};

const Header = ({ mainMenuItems, isHeaderSticky }: Props) => {
  const [profile, setProfileAtom] = useAtom(profileAtom);
  const cart = useSelector((state: any) => state.cart);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [topBarTransition, setTopBarTransition] = useState(false);
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const isMobile = useMediaQuery(600);
  const router = useRouter();
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(
      setLoginDetails({
        ...loginDetails,
        isSidebarOpen: true,
        tabType: TabTypeConstant.ENTER_MOBILE_NUMBER
      })
    );
  };

  const handleSubmenuToggle = (label: string) => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
  };
  const handleMobileMenuOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setTopBarTransition(position > 40 && !isMobile);
      if (position > 40) {
        setOpenSubmenu(null);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobile && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenSubmenu(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile]);

  const openAccount = () => {
    dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));
    dispatch(setIsSidebarOpen(true));
    // setIsAccountOpen(true)
    // setActiveAccountsPageAtom(ActiveSidebar.ACCOUNT_MAIN)
  };
  return (
    <div
      ref={menuRef}
      className={` z-[10] ${isHeaderSticky ? 'fixed top-[0]' : 'absolute'}  flex items-center flex-col w-full transform `}
    >
      <OffersRibbon />
      <div
        className={`bg-white shadow-[4px_4px_32px_0px_rgba(0,0,0,0.08)] w-[80vw] mob:w-full mob:py-[4.1vw] mob:px-[5vw] px-[1.6vw] py-[1vw]  ${topBarTransition ? 'mt-[-1vw]' : 'mt-[1.1vw] mob:mt-0 '} transition-all  rounded-full mob:rounded-none flex items-center justify-between`}
      >
        <div className="flex items-center gap-[3vw] ">
          <button onClick={() => setDrawerOpen(!drawerOpen)} className="w-[5vw] hidden mob:block h-[4vw] relative">
            <Image src={hamberger} alt="hamberger" />
          </button>
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="w-[7vw] mob:w-[16vw] mob:h-[8vw] h-[4vw] mr-[4vw] top-[.2vw] relative "
            >
              <Image src={originLogo} alt="" />
            </button>
          </div>
          {/* {!isMobile && <InputSearchbar />} */}
        </div>
        <div className="flex items-center gap-[1.1vw] ">
          <div className="flex items-center gap-[2vw] pr-[5vw] mob:hidden">
            <Link
              href={'/shop'}
              className=" h-[2.4vw] px-[2vw] flex items-center justify-center rounded-full bg-primary text-black text-[1.1vw] font-medium font-[SofiaPro]"
            >
              Shop All
            </Link>
            <Link href={'/about'} className="  text-black text-[1.1vw] font-medium font-[SofiaPro]">
              About us
            </Link>
            {/* <Link href={'/'} className=" text-black text-[1.1vw] font-medium font-[SofiaPro]">
              Stores
            </Link> */}
          </div>

          {loginDetails.isLogin && (
            <div className="flex items-center jutq">
              {/* {profile?.data?.profile && ( */}
              <button onClick={openAccount}>
                <div className="w-[1.25vw] mob:w-[5.128vw] mob:h-[5.128vw] h-[1.25vw] relative ">
                  <Image src={userIcon} alt="account icon" />
                </div>
              </button>
              {/* )} */}
            </div>
          )}
          {!loginDetails.isLogin && (
            <button
              onClick={handleProfileMenuOpen}
              className="border-[1px]  border-black h-[2.4vw] mob:h-max px-[1.17vw] mob:px-[5.1vw] mob:py-[1.5vw] rounded-full text-black text-[1.1vw] mob:text-[4.1vw] font-medium font-[SofiaPro]"
            >
              Login
            </button>
          )}
          <>
            {!isMobile && (
              <div className="h-[1.67vw] relative w-[.1vw] mob:w-[.3vw] mob:mx-[2vw] mob:h-[7vw] bg-black-op-30"></div>
            )}
            {!isMobile && (
              <button
                // onClick={() => setIsCartOpen(true)}
                onClick={() => {
                  dispatch(
                    setLoginDetails({
                      ...loginDetails,
                      isSidebarOpen: true,
                      tabType: TabTypeConstant.CART
                    })
                  );
                  if (cart?.items?.length === 0) {
                    let cartItemFromLs = localStorage.getItem('cart_items');
                    let cartItemsParsed: any;
                    if (cartItemFromLs) {
                      cartItemsParsed = JSON.parse(cartItemFromLs);
                    }
                    if (cartItemsParsed?.length > 0) {
                      dispatch(setCartItems(cartItemsParsed));
                      dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
                      return;
                    } else {
                      dispatch(setCartTabType(TabTypeConstant.EMPTY_CART));
                    }
                  } else {
                    dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
                  }
                }}
                className="relative pr-[1.67vw]"
              >
                {cart?.items?.length > 0 && (
                  <div className="absolute top-[-.6vw] mob:top-[-3vw] mob:left-[3vw] left-[.7vw] w-[1.25vw] h-[1.25vw] mob:w-[5.128vw] mob:h-[5.128vw] text-[.78vw] mob:text-[3vw] rounded-full bg-secondary-300 z-[1] text-white font-[sofiaPro] flex items-center justify-center">
                    {cart?.items?.length}
                  </div>
                )}
                <div className="relative  w-[1.25vw] h-[1.25vw] mob:w-[5.128vw] mob:h-[5.128vw] z-0 ">
                  <Image src={cartIcon} alt="cart-icon" />
                </div>
              </button>
            )}
          </>
        </div>
      </div>
      <MobileDrawer
        drawerOpen={drawerOpen}
        handleMobileMenuOpen={handleMobileMenuOpen}
        mainMenuItems={mainMenuItems}
        openSubmenu={openSubmenu}
        handleSubmenuToggle={handleSubmenuToggle}
        isMobile={isMobile}
        topBarTransition={topBarTransition}
      />
      {!isMobile &&
        mainMenuItems.map(
          (item) =>
            item.submenu && (
              <Submenu
                key={item.label}
                submenu={item.submenu}
                isOpen={openSubmenu === item.label}
                isMobile={isMobile}
                transitionBool={topBarTransition}
              />
            )
        )}
    </div>
  );
};

export default Header;

// <div
//   className={`bg-white rounded-full flex px-[2.5vw] py-[1vw] w-[80vw] shadow-[4px_4px_32px_0px_rgba(0,0,0,0.08)] `}
// >
//   <IconButton className=" mob:block hidden p-0" onClick={handleMobileMenuOpen}>
//     <OriginMenuIcon className="w-[21px] h-[18px]" />
//   </IconButton>
//   <Link href="/" className="w-[7vw] relative mob:w-[15vw] mob:h-[8vw]  h-[3.75vw]">
//     {/* <Logo /> */}
//     <Image src={originLogo} alt="origin logo" />
//   </Link>
//   <div className="flex flex-grow justify-start items-center order-3 md:order-[unset] mx-0 md:ms-[30px] md:me-4 md:basis-auto basis-full">
//     <SearchBar />
//   </div>
//   <div className="flex items-center">
//     {!isMobile && (
//       <MenuItems items={mainMenuItems} handleSubmenuToggle={handleSubmenuToggle} openSubmenu={openSubmenu} />
//     )}
//     <Box className={classNames('flex items-center flex-row-reverse gap-2 lg:flex-row lg:gap-0')}>
//       {loginDetails.user && profile?.data?.profile ? (
//         <IconButton onClick={openAccount}>
//           {/* <div className="md:w-[1.389vw]  md:h-[1.389vw] sm:w-[3.6vw] sm:h-[3.6vw] xs:w-[5.1vw] xs:h-[5.1vw]  relative"> */}
//           <div className=" w-[1.25vw] h-[1.25vw] mob:w-[4.67vw] mob:h-[4.67vw]  relative">
//             <Image src={userIcon} alt="account icon" />
//           </div>
//         </IconButton>
//       ) : (
//         <button className={'border border-black rounded-full px-[1.1vw] text-[.83vw] font-[SofiaPro] text-semibold '}>
//           Login
//         </button>
//         // <OriginButton
//         //   variant="outlined"
//         //   handleClick={handleProfileMenuOpen}
//         //   classes={{
//         //     iconButton: 'md:px-3 px-5 py-1'
//         //   }}
//         // >
//         //   <Typography variant="body1">Login</Typography>
//         // </OriginButton>
//       )}
//       <Box className="lg:block px-1 md:px-4 text-black text-opacity-40" component="span">
//         {'|'}
//       </Box>
//       <button
//         // onClick={() => setIsCartOpen(true)}
//         onClick={() => {
//           dispatch(
//             setLoginDetails({
//               ...loginDetails,
//               isSidebarOpen: true,
//               tabType: TabTypeConstant.CART
//             })
//           );
//           dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
//         }}
//         className="relative"
//       >
//         {cart?.items?.length > 0 && (
//           <div className="absolute top-[-.6vw] left-[.7vw] w-[1.25vw] h-[1.25vw] text-[.78vw] rounded-full bg-secondary-300 z-[1] text-white font-[sofiaPro] flex items-center justify-center">
//             {cart?.items?.length}
//           </div>
//         )}
//         <div className="relative  w-[1.25vw] h-[1.25vw] z-0 ">
//           <Image src={cartIcon} alt="cart-icon" />
//         </div>
//       </button>
//       {/* <OriginButton
//                           variant="iconOnly"
//                           aria-label="show 4 new items in cart"
//                           classes={{ iconButton: 'p-2 text-white' }}
//                       >
//                           <Box className="sr-only">Cart</Box>
//                           <Badge
//                               badgeContent={cart?.items?.length}
//                               classes={{ badge: 'bg-secondary-300' }}
//                               sx={{
//                                   '.MuiBadge-badge': {
//                                       fontFamily: 'SofiaPro, sans-serif',
//                                       lineHeight: '21px',
//                                   },
//                               }}
//                           >
//                               <Box component="span" className="sr-only">
//                                   {4} items in cart
//                               </Box>
//                               <OriginCartIcon className="w-5 h-[17px]" />
//                           </Badge>
//                       </OriginButton> */}
//     </Box>
//   </div>
// </div>;
