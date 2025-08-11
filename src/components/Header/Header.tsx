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

// Animated Placeholder Component
const AnimatedPlaceholder = () => {
  const fruits = ['enoki', 'apple', 'mango', 'orange', 'grapes', 'cherry', 'onion'];
  const [currentFruitIndex, setCurrentFruitIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentFruitIndex((prevIndex) => 
          prevIndex === fruits.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 300); // Half of the fade duration
      
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      Search for '{fruits[currentFruitIndex]}'
    </span>
  );
};

const Header = ({ mainMenuItems, isHeaderSticky }: Props) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [topBarTransition, setTopBarTransition] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const cart = useSelector((state: any) => state.cart);

  const router = useRouter();
  const isMobile = useMediaQuery(600);

  const handleSearchFieldClick = () => {
    router.push("/search");
  }

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

  const handleSearchClick = () => {
    setIsSearchActive(true);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearchClick();
    }
  };

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      if (searchQuery.trim() === '') {
        setIsSearchActive(false);
      }
    }, 150);
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
    <div ref={menuRef} className={`z-[10] ${isHeaderSticky ? 'fixed top-[1.1vw]' : 'absolute'} flex items-center flex-col w-full z-50`}>
      <OffersRibbon />

      {/* Header bar */}
      <div
        className={`bg-white shadow-[4px_4px_32px_0px_rgba(0,0,0,0.08)] z-50 w-[80vw] mob:w-full mob:py-[4.1vw] mob:px-[5vw] px-[1vw] py-[1vw] ${
          topBarTransition ? 'mt-[-1vw]' : 'mt-[1.1vw] mob:mt-0'
        } transition-all rounded-full mob:rounded-none flex items-center justify-between`}
      >
        <div className="flex items-center gap-[3vw]">
          <button onClick={() => setDrawerOpen(!drawerOpen)} className="w-[5vw] hidden mob:block h-[4vw] relative">
            <Image src={hamberger} alt="hamberger" />
          </button>

          <button 
            onClick={() => router.push('/shop')}
            className="w-[7vw] ml-[1vw] mob:w-[16vw] mob:h-[8vw] h-[4vw] mr-[4vw] top-[.2vw] relative"
          >
            <Image src={originLogo} alt="logo" />
          </button>
        </div>

        <div className="flex items-center gap-[1.1vw]">
          <div className="flex items-center gap-[2vw] pr-[0] mob:hidden">
            <Link
              href="/shop"
              className="h-[2.4vw] px-[2vw] flex items-center justify-center rounded-full bg-primary text-black text-[1.1vw] font-medium font-[SofiaPro]"
            >
              Shop All
            </Link>
            {/* <Link href="/about" className="text-black text-[1.1vw] font-medium font-[SofiaPro]">
              About us
            </Link> */}
          </div>

          {/* Enhanced Search Bar */}
          <div className="flex-1 max-w-[28vw] mob:max-w-[45vw]">
            <form onSubmit={handleSearchSubmit} className="relative">
              
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onClick={handleSearchFieldClick}
                  className="w-full h-[2.4vw] mob:h-max px-[1.17vw] mob:px-[5.1vw] mob:py-[1.5vw] 
                            rounded-full border border-gray-300 bg-transparent 
                            placeholder:text-gray-400 
                            text-[1.1vw] mob:text-[4.1vw] font-[SofiaPro] cursor-pointer 
                            focus:outline-none focus:ring-0 transition-all duration-200"
                />            

                {!searchQuery && (
                  <div className="absolute left-[1vw] mob:left-[3vw] top-1/2 transform -translate-y-1/2 pointer-events-none text-[1vw] mob:text-[3.5vw] font-[SofiaPro] text-gray-500">
                    <AnimatedPlaceholder />
                  </div>
                )}

                {/* Search Icon */}
                <button
                  type="submit"
                  className="absolute right-[0.6vw] mob:right-[2vw] top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-gray-100 rounded-full w-[1.6vw] h-[1.6vw] mob:w-[6vw] mob:h-[6vw] flex items-center justify-center transition-colors duration-200"
                >
                  <svg
                    className="w-[0.9vw] h-[0.9vw] mob:w-[3.5vw] mob:h-[3.5vw] text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
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