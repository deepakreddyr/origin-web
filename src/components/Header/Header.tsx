import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import hamburger from '/public/assets/images/hamburger.png';
import originLogo from '/public/assets/images/neworiginlogo.png';
import userIcon from '/public/assets/images/userIcon.png';
import cartIcon from '/public/assets/icons/cartIcon.png';

// --- NEW IMPORTS REQUIRED FOR LOCATION FUNCTIONALITY ---
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import { profileAtom } from '@/features/AccountPage/context/atoms';
import whiteDropdownIcon from '/public/assets/images/whiteDropdown.png';
// --------------------------------------------------------

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
  search?: boolean;
  transparentColor?: 'black'; // NEW PROP
};

// HELPER FUNCTION: Calculate total cart line items from nested structure
const getCartItemCount = (cartItems: any[]) => {
  let count = 0;

  cartItems.forEach((product: any) => {
    product.multiple_uoms?.forEach((uom: any) => {
      if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
        // Count each ripeness type as a separate line item
        uom.cart_ripeness.forEach((ripeness: any) => {
          const qty = Number(ripeness.qty);
          if (qty > 0) {
            count++;
          }
        });
      } else if (uom.cart_quantity > 0) {
        // Count simple items (no ripeness)
        count++;
      }
    });
  });

  return count;
};

const AnimatedPlaceholder = () => {
  const fruits = ['enoki', 'apple', 'mango', 'orange', 'grapes', 'cherry', 'onion'];
  const [currentFruitIndex, setCurrentFruitIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentFruitIndex((prevIndex) => (prevIndex === fruits.length - 1 ? 0 : prevIndex + 1));
        setIsVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, [fruits.length]);

  return (
    <span className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      Search for '{fruits[currentFruitIndex]}'
    </span>
  );
};

const Header = ({ mainMenuItems, isHeaderSticky, search = false, transparentColor = 'black' }: Props) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [topBarTransition, setTopBarTransition] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpaque, setIsOpaque] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useDispatch();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const cart = useSelector((state: any) => state.cart);

  // Calculate cart item count from nested structure
  const cartItemCount = getCartItemCount(cart?.items || []);

  // --- NEW LOCATION HOOKS ---
  const [address] = useAtom(addressAtom);
  const [profile] = useAtom(profileAtom);
  // --------------------------

  const router = useRouter();
  const isMobile = useMediaQuery(600);
  const isShopPage = router.pathname === '/';
  const isTransparentHeader = isShopPage && !isOpaque && isMobile;

  // Helper function to get icon filter based on transparent color
  const getIconFilter = () => {
    if (!isTransparentHeader) return '';
    return transparentColor === 'black' ? 'brightness-0' : 'brightness-0 invert';
  };

  // Helper function to get text color class
  const getTextColor = () => {
    if (!isTransparentHeader) return 'text-gray-900';
    return transparentColor === 'black' ? 'text-black' : 'text-white';
  };

  // Helper function to get location button styles
  const getLocationButtonStyles = () => {
    if (!isTransparentHeader) return 'bg-black/5 text-gray-900';
    return transparentColor === 'black' ? 'bg-black/10 text-black' : 'bg-white/30 text-white';
  };

  // Helper function to get location icon color
  const getLocationIconColor = () => {
    if (!isTransparentHeader) return 'text-gray-700';
    return transparentColor === 'black' ? 'text-black' : 'text-white';
  };

  // Helper function to get dropdown icon color
  const getDropdownIconColor = () => {
    if (!isTransparentHeader) return 'text-gray-500';
    return transparentColor === 'black' ? 'text-black' : 'text-white';
  };

  // Helper function to get search bar styles
  const getSearchBarStyles = () => {
    if (!isTransparentHeader) return 'bg-[#F8F4E9] border border-gray-200 text-black';
    return transparentColor === 'black' ? 'bg-black/10 text-black border-none' : 'bg-white/30 text-white border-none';
  };

  // Helper function to get search icon color
  const getSearchIconColor = () => {
    if (!isTransparentHeader) return 'text-gray-400';
    return transparentColor === 'black' ? 'text-black' : 'text-white';
  };

  // Helper function to get search placeholder color
  const getSearchPlaceholderColor = () => {
    if (!isTransparentHeader) return 'text-gray-400';
    return transparentColor === 'black' ? 'text-black/70' : 'text-white/90';
  };

  useEffect(() => {
    if (search && router.query.q && typeof router.query.q === 'string') {
      setCurrentSearchQuery(router.query.q);
      setSearchQuery(router.query.q);
    }

    // Check login status on mount
    const token = localStorage.getItem('user_token');
    setIsLoggedIn(!!token);

    // Auto-focus search bar on search page
    if (search && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [search, router.query.q, loginDetails.tabType, isMobile]);

  const handleSearchFieldClick = () => {
    if (!search) {
      router.push('/search');
    }
  };

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

  const handleSelectAddress = () => {
    dispatch(setIsSidebarOpen(true));

    if (!loginDetails.isLogin) {
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      return;
    }

    if (address?.address && address.address.length > 0) {
      dispatch(setTabType(TabTypeConstant.SELECT_ADDRESS));
    } else {
      dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
    }
  };

  const debouncedSearch = (query: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (query.trim().length >= 2) {
        router.push(`/search?q=${encodeURIComponent(query)}`, undefined, { shallow: true });
      } else if (query.trim().length < 2) {
        router.push('/search', undefined, { shallow: true });
      }
    }, 500);
  };

  const handleSearchClick = () => {
    setIsSearchActive(true);
    if (search && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else if (!search) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (search) {
      setCurrentSearchQuery(value);
      debouncedSearch(value);
    }
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
      setTopBarTransition((position > 40 && !isMobile) || (search && !isMobile));
      setIsOpaque(position > 20 || search);
      if (position > 40) setOpenSubmenu(null);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobile && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenSubmenu(null);
      }
    };

    if (!search) {
      window.addEventListener('scroll', handleScroll);
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [isMobile, search]);

  return (
    <div
      ref={menuRef}
      className={`${isHeaderSticky ? 'fixed top-0' : 'absolute top-0'} flex items-center flex-col w-full z-[100] ${isMobile && loginDetails.isSidebarOpen ? 'hidden' : ''}`}
    >
      {/* <OffersRibbon /> */}

      <div
        className={`z-50 w-[92vw] lg:w-[80vw] mob:w-full transition-all duration-300 ${
          isMobile
            ? isTransparentHeader
              ? 'bg-transparent px-[5vw] py-[2vw]'
              : // : 'bg-[#FFF9E5] px-[5vw] py-[2vw]'
                'bg-white px-[5vw] py-[2vw] shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
            : search
              ? 'bg-transparent w-[96vw] mt-[1vw] max-w-[1920px]'
              : 'bg-white rounded-full shadow-md'
        } ${'mt-[1.1vw] mob:mt-0'} flex flex-col`}
      >
        <div className="flex items-center justify-between w-full">
          <div className={`flex items-center gap-[2vw] mob:gap-[3vw] ${isMobile ? 'flex-1' : ''}`}>
            {isMobile && (
              <button onClick={() => setDrawerOpen(!drawerOpen)} className="w-[6vw] h-[6vw] relative flex-shrink-0">
                <Image src={hamburger} alt="Menu" fill className={`object-contain ${getIconFilter()}`} />
              </button>
            )}

            <button
              onClick={() => router.push('/')}
              className={`relative flex-shrink-0 ${isMobile ? 'flex-1 flex justify-center' : ''}`}
            >
              <div className="w-[10vw] ml-[2vw] mt-2 mob:w-[35vw] mob:h-[12vw] mob:ml-0 h-[5vw] mr-[1vw] mob:mr-2 relative">
                <Image src={originLogo} alt="logo" fill className={`object-contain ${getIconFilter()}`} priority />
              </div>
            </button>

            {/* --- MOBILE LOCATION & CART --- */}
            {isMobile && (
              <div className="flex items-center gap-[3vw]">
                <button
                  onClick={handleSelectAddress}
                  className={`flex items-center gap-[1vw] px-[2vw] py-[1.5vw] rounded-full ${getLocationButtonStyles()} text-[3vw] font-medium font-[SofiaPro] max-w-[25vw]`}
                  aria-label="Select Delivery Address"
                >
                  <svg
                    className={`w-[4vw] h-[4vw] flex-shrink-0 ${getLocationIconColor()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="truncate flex-1">{address.defaultAddress?.address_name || 'Select'}</span>
                  <svg
                    className={`w-[2vw] h-[2vw] ${getDropdownIconColor()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <button
                  onClick={isLoggedIn ? openAccount : handleProfileMenuOpen}
                  className="relative p-[1vw]"
                  aria-label="Account"
                >
                  <div className="w-[6vw] h-[6vw] relative">
                    <Image src={userIcon} alt="Account" fill className={`object-contain ${getIconFilter()}`} />
                  </div>
                </button>
              </div>
            )}
            {/* ------------------------------------------------------------------ */}
          </div>

          {/* Desktop New Layout */}
          <div className={`flex items-center flex-1 mob:hidden`}>
            {/* 1. Search Bar (Moved First) */}
            <div className={`flex-1 ml-[1vw] max-w-[20vw] mr-[2.9vw]`}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onClick={handleSearchFieldClick}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    placeholder={search ? 'Search here' : ''}
                    className={`w-full h-[3vw] pl-[1.5vw] pr-[3.5vw] 
                                rounded-full border-none bg-[#F2EADA]
                                placeholder:text-black/60 text-black
                                text-[1.1vw] font-[SofiaPro] cursor-pointer 
                                focus:outline-none focus:ring-0 transition-all duration-200`}
                  />

                  {!searchQuery && !search && (
                    <div className="absolute left-[1.5vw] top-1/2 transform -translate-y-1/2 pointer-events-none text-[1.1vw] font-[SofiaPro] text-black/60 truncate max-w-[14vw]">
                      <AnimatedPlaceholder />
                    </div>
                  )}

                  {/* Search Icon inside Input */}
                  <button
                    type="submit"
                    className="absolute right-[1vw] top-1/2 transform -translate-y-1/2 bg-transparent w-[1.6vw] h-[1.6vw] flex items-center justify-center"
                  >
                    <svg
                      className="w-[1.1vw] h-[1.1vw] text-black"
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

            {/* 2. Navigation Links */}
            <div className="flex items-center gap-[1vw]">
              <Link
                href="/shop"
                className={`h-[2.4vw] px-[2vw] flex items-center justify-center rounded-full text-[1.1vw] font-medium font-[SofiaPro] transition-colors ${
                  router.pathname === '/' || router.pathname.startsWith('/shop')
                    ? 'bg-primary text-black'
                    : 'hover:bg-gray-100 text-black'
                }`}
              >
                Shop All
              </Link>
              <Link
                href="/about"
                className={`h-[2.4vw] px-[2vw] flex items-center justify-center rounded-full text-[1.1vw] font-medium font-[SofiaPro] transition-colors ${
                  router.pathname === '/about' ? 'bg-primary text-black' : 'hover:bg-gray-100 text-black'
                }`}
              >
                About Us
              </Link>

              {/* Stores button explicitely removed */}
            </div>

            {/* 3. Location Selector & Icons */}
            <div className="flex items-center gap-[1.5vw] ml-[1vw]">
              {/* Location Selector */}
              {!isMobile && (
                <button
                  onClick={handleSelectAddress}
                  className="flex items-center gap-2 px-[1.5vw] py-[0.5vw] rounded-full bg-gray-100/50 hover:bg-gray-100 text-gray-900 transition-colors max-w-[200px]"
                  aria-label="Select Delivery Address"
                >
                  <svg
                    className="w-[1vw] h-[1vw] flex-shrink-0 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {address.defaultAddress?.address_name ? (
                    <div className="flex-1 overflow-hidden relative">
                      <div className="animate-marquee whitespace-nowrap text-[1vw]">
                        <span className="font-bold">{address.defaultAddress?.address_name}</span>
                        <span className="mx-[0.5vw]">•</span>
                        <span className="font-light">{address.defaultAddress.address}</span>
                        {/* Duplicate for seamless loop */}
                        <span className="font-bold ml-[2vw]">{address.defaultAddress?.address_name}</span>
                        <span className="mx-[0.5vw]">•</span>
                        <span className="font-light">{address.defaultAddress.address}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="font-bold text-[1vw] whitespace-nowrap">Select Address</span>
                  )}
                  <svg
                    className="w-[0.6vw] h-[0.6vw] text-gray-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Account Icon */}
              {loginDetails.isLogin ? (
                <button onClick={openAccount}>
                  <div className="w-[1.5vw] h-[1.5vw] relative">
                    <Image src={userIcon} alt="account icon" fill className="object-contain" />
                  </div>
                </button>
              ) : (
                <button onClick={handleProfileMenuOpen}>
                  <div className="w-[1.5vw] h-[1.5vw] relative">
                    <Image src={userIcon} alt="account icon" fill className="object-contain" />
                  </div>
                </button>
              )}

              {/* Separator */}
              <div className="h-[1.5vw] w-[1px] bg-gray-300"></div>

              {/* Cart Icon */}
              <button onClick={handleCartOpen} className="relative">
                {cartItemCount > 0 && (
                  <div className="absolute top-[-0.5vw] -right-[0.5vw] w-[1.1vw] h-[1.1vw] text-[0.7vw] rounded-full bg-[#27ae60] border border-white text-white font-[sofiaPro] flex items-center justify-center z-[10]">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </div>
                )}
                <div className="relative w-[1.5vw] h-[1.5vw]">
                  <Image src={cartIcon} alt="cart-icon" fill className="object-contain" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        {isMobile && (
          <div className="mt-[3vw] px-[0vw]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative ">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onClick={handleSearchFieldClick}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className={`w-full h-[12vw] pl-[12vw] pr-[4vw] rounded-full text-[4vw] font-[SofiaPro] transition-all duration-300 outline-none ${getSearchBarStyles()}`}
                />
                {!searchQuery && (
                  <div
                    className={`absolute left-[12vw] top-1/2 -translate-y-1/2  pointer-events-none text-[4vw] font-[SofiaPro] ${getSearchPlaceholderColor()}`}
                  >
                    <AnimatedPlaceholder />
                  </div>
                )}
                <div className="absolute left-[4vw] top-1/2 -translate-y-1/2">
                  <svg
                    className={`w-[5vw] h-[5vw] ${getSearchIconColor()}`}
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
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {isMobile && cartItemCount > 0 && (
        <button
          onClick={handleCartOpen}
          className="fixed bottom-[5vw] right-[5vw] z-[99] bg-white p-[4vw] rounded-full shadow-xl border border-gray-200"
        >
          <div className="absolute top-[-2vw] left-[7vw] w-[6vw] h-[6vw] text-[3vw] rounded-full bg-secondary-300 z-[1] text-white flex items-center justify-center">
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </div>
          <div className="relative w-[6vw] h-[6vw]">
            <Image src={cartIcon} alt="cart-icon" fill className="object-contain" />
          </div>
        </button>
      )}

      <MobileDrawer
        drawerOpen={drawerOpen}
        handleMobileMenuOpen={() => setDrawerOpen(!drawerOpen)}
        mainMenuItems={mainMenuItems}
        openSubmenu={openSubmenu}
        handleSubmenuToggle={(label: string) => setOpenSubmenu((prev) => (prev === label ? null : label))}
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
