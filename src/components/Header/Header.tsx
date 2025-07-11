import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import hamberger from '/public/assets/images/hamberger.png';
import originLogo from '/public/assets/images/originLogo.png';
import userIcon from '/public/assets/images/userIcon.png';
import cartIcon from '/public/assets/icons/cartIcon.png';

import { MobileDrawer, Submenu } from '.';
import OffersRibbon from './OffersRibbon';
import { setCartItems, setCartTabType } from '@/store/slice/CartSlice';
import { setIsSidebarOpen, setLoginDetails, setTabType } from '@/store/slice/loginSlice';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
import { MainMenuType } from '@/utilities/types';

type Props = {
  mainMenuItems: MainMenuType[];
  isHeaderSticky: any;
};

const Header = ({ mainMenuItems, isHeaderSticky }: Props) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [topBarTransition, setTopBarTransition] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const cart = useSelector((state: any) => state.cart);

  const router = useRouter();
  const isMobile = useMediaQuery(600);

  const handleProfileMenuOpen = () => {
    dispatch(
      setLoginDetails({
        ...loginDetails,
        isSidebarOpen: true,
        tabType: TabTypeConstant.ENTER_MOBILE_NUMBER
      })
    );
  };

  const openAccount = () => {
    dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));
    dispatch(setIsSidebarOpen(true));
  };

  const handleCartOpen = () => {
    dispatch(
      setLoginDetails({
        ...loginDetails,
        isSidebarOpen: true,
        tabType: TabTypeConstant.CART
      })
    );

    if (cart?.items?.length === 0) {
      const cartItemFromLs = localStorage.getItem('cart_items');
      const cartItemsParsed = cartItemFromLs ? JSON.parse(cartItemFromLs) : [];
      if (cartItemsParsed.length > 0) {
        dispatch(setCartItems(cartItemsParsed));
        dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
      } else {
        dispatch(setCartTabType(TabTypeConstant.EMPTY_CART));
      }
    } else {
      dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setTopBarTransition(position > 40 && !isMobile);
      if (position > 40) setOpenSubmenu(null);
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

  return (
    <div ref={menuRef} className={`z-[10] ${isHeaderSticky ? 'fixed top-[0]' : 'absolute'} flex items-center flex-col w-full`}>
      <OffersRibbon />

      {/* Header bar */}
      <div
        className={`bg-white shadow-[4px_4px_32px_0px_rgba(0,0,0,0.08)] w-[80vw] mob:w-full mob:py-[4.1vw] mob:px-[5vw] px-[1.6vw] py-[1vw] ${
          topBarTransition ? 'mt-[-1vw]' : 'mt-[1.1vw] mob:mt-0'
        } transition-all rounded-full mob:rounded-none flex items-center justify-between`}
      >
        <div className="flex items-center gap-[3vw]">
          <button onClick={() => setDrawerOpen(!drawerOpen)} className="w-[5vw] hidden mob:block h-[4vw] relative">
            <Image src={hamberger} alt="hamberger" />
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-[7vw] mob:w-[16vw] mob:h-[8vw] h-[4vw] mr-[4vw] top-[.2vw] relative"
          >
            <Image src={originLogo} alt="logo" />
          </button>
        </div>

        <div className="flex items-center gap-[1.1vw]">
          <div className="flex items-center gap-[2vw] pr-[5vw] mob:hidden">
            <Link
              href="/shop"
              className="h-[2.4vw] px-[2vw] flex items-center justify-center rounded-full bg-primary text-black text-[1.1vw] font-medium font-[SofiaPro]"
            >
              Shop All
            </Link>
            <Link href="/about" className="text-black text-[1.1vw] font-medium font-[SofiaPro]">
              About us
            </Link>
          </div>

          {loginDetails.isLogin ? (
            <button onClick={openAccount}>
              <div className="w-[1.25vw] mob:w-[5.128vw] mob:h-[5.128vw] h-[1.25vw] relative">
                <Image src={userIcon} alt="account icon" />
              </div>
            </button>
          ) : (
            <button
              onClick={handleProfileMenuOpen}
              className="border-[1px] border-black h-[2.4vw] mob:h-max px-[1.17vw] mob:px-[5.1vw] mob:py-[1.5vw] rounded-full text-black text-[1.1vw] mob:text-[4.1vw] font-medium font-[SofiaPro]"
            >
              Login
            </button>
          )}

          {!isMobile && (
            <>
              <div className="h-[1.67vw] mob:h-[7vw] w-[.1vw] mob:w-[.3vw] mob:mx-[2vw] bg-black-op-30"></div>
              <button onClick={handleCartOpen} className="relative pr-[1.67vw]">
                {cart?.items?.length > 0 && (
                  <div className="absolute top-[-.6vw] left-[.7vw] w-[1.25vw] h-[1.25vw] text-[.78vw] rounded-full bg-secondary-300 z-[1] text-white font-[sofiaPro] flex items-center justify-center">
                    {cart?.items?.length}
                  </div>
                )}
                <div className="relative w-[1.25vw] h-[1.25vw] z-0">
                  <Image src={cartIcon} alt="cart-icon" />
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Floating Cart on Bottom Right for Mobile */}
      {isMobile && (
        <button
          onClick={handleCartOpen}
          className="fixed bottom-[5vw] right-[5vw] z-[99] bg-white p-[4vw] rounded-full shadow-xl border border-gray-200"
        >
          {cart?.items?.length > 0 && (
            <div className="absolute top-[-2vw] left-[7vw] w-[6vw] h-[6vw] text-[3vw] rounded-full bg-secondary-300 z-[1] text-white flex items-center justify-center">
              {cart.items.length}
            </div>
          )}
          <div className="relative w-[6vw] h-[6vw]">
            <Image src={cartIcon} alt="cart-icon" />
          </div>
        </button>
      )}

      {/* Mobile Drawer */}
      <MobileDrawer
        drawerOpen={drawerOpen}
        handleMobileMenuOpen={() => setDrawerOpen(!drawerOpen)}
        mainMenuItems={mainMenuItems}
        openSubmenu={openSubmenu}
        handleSubmenuToggle={(label: string) => setOpenSubmenu((prev) => (prev === label ? null : label))}
        isMobile={isMobile}
        topBarTransition={topBarTransition}
      />

      {/* Desktop Submenus */}
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
