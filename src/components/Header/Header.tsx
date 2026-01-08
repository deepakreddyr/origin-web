import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import hamberger from '/public/assets/images/hamberger.png';
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
        setCurrentFruitIndex((prevIndex) =>
          prevIndex === fruits.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 300);

    }, 2500);

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

const Header = ({ mainMenuItems, isHeaderSticky, search = false }: Props) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [topBarTransition, setTopBarTransition] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  const isShopPage = router.pathname === '/shop';

  useEffect(() => {
    if (search && router.query.q && typeof router.query.q === 'string') {
      setCurrentSearchQuery(router.query.q);
      setSearchQuery(router.query.q);
    }

    // Check login status on mount
    const token = localStorage.getItem('user_token');
    setIsLoggedIn(!!token);

  }, [search, router.query.q, loginDetails.tabType]);

  const handleSearchFieldClick = () => {
    if (!search) {
      router.push("/search");
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

  // --- LOCATION HANDLER ---
  const handleSelectAddress = () => {
    dispatch(setIsSidebarOpen(true));

    if (!isLoggedIn) {
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      return;
    }

    if (!loginDetails.isLogin) {
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      return;
    }

    if (!profile?.data?.profile) {
      dispatch(setTabType(TabTypeConstant.REGISTER));
      return;
    }

    if (address.address.length > 0) {
      dispatch(setTabType(TabTypeConstant.SELECT_ADDRESS));
    } else {
      dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
    }
  };
  // -------------------------

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
      setTopBarTransition(position > 40 && !isMobile && !search);
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

  if (search) {
    return (
      <>
        <div className="bg-[#FFF9E5] border-gray-200 w-full">
          <div className="max-w-7xl mt-5 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

              <div className="flex items-center">
                <button
                  onClick={() => router.push('/shop')}
                  className="flex items-center hover:opacity-80 transition-opacity"
                  aria-label="Go to shop"
                >
                  <div className={`relative ${isMobile ? 'w-24 h-10' : 'w-[8vw] h-10'}`}>
                    <Image src={originLogo} alt="Origin" fill className="object-contain" />
                  </div>
                </button>
              </div>

              <div className="flex-1 mx-3">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      className="w-full h-10 pl-4 pr-12 bg-white border border-gray-300 rounded-full 
                              focus:outline-none focus:ring-0 focus:border-gray-300 
                              text-sm font-medium font-[SofiaPro] placeholder:text-gray-500 
                              transition-all duration-200"
                      placeholder="Search here"
                      autoFocus
                    />

                    {searchQuery && searchQuery.length < 2 && (
                      <div className="absolute right-12 top-1/2 transform -translate-y-1/2 
                                    text-xs text-gray-400 font-[SofiaPro]">
                        {2 - searchQuery.length} more
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={searchQuery.trim().length < 2}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 
                              rounded-full bg-transparent text-gray-400 cursor-pointer"
                      aria-label="Search"
                    >
                      <svg
                        className="w-4 h-4"
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

              <div className="flex items-center gap-2">
                {loginDetails.isLogin ? (
                  <button
                    onClick={openAccount}
                    className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors duration-200"
                    aria-label="My account"
                  >
                    <div className="w-6 h-6 relative">
                      <Image src={userIcon} alt="Account" fill className="object-contain" />
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={handleProfileMenuOpen}
                    className="px-4 py-2 border border-gray-400 rounded-full text-sm font-medium font-[SofiaPro]
                             hover:bg-white hover:bg-opacity-50 transition-colors duration-200 text-gray-700"
                  >
                    Login
                  </button>
                )}

                <button
                  onClick={handleCartOpen}
                  className="relative p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors duration-200"
                  aria-label={`Shopping cart ${cartItemCount > 0 ? `(${cartItemCount} items)` : ''}`}
                >
                  {cartItemCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-300 text-white 
                                  text-xs font-medium rounded-full flex items-center justify-center">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </div>
                  )}
                  <div className="w-6 h-6 relative">
                    <Image src={cartIcon} alt="Cart" fill className="object-contain" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div ref={menuRef} className={`${isHeaderSticky ? 'fixed top-[1.1vw] mob:top-0' : 'absolute top-0'} flex items-center flex-col w-full z-20`}>
      {/* <OffersRibbon /> */}

      <div
        className={`bg-white shadow-[4px_4px_32px_0px_rgba(0,0,0,0.08)] z-50 w-[80vw] mob:w-full mob:py-[3vw] mob:px-[5vw] ${topBarTransition ? 'mt-[-1vw]' : 'mt-[1.1vw] mob:mt-0'
          } transition-all rounded-full mob:rounded-none flex items-center justify-between`}
      >
        <div className="flex items-center gap-[2vw] mob:gap-[3vw] flex-1">
          {isMobile && (
            <button onClick={() => setDrawerOpen(!drawerOpen)} className="w-[5vw] h-[4vw] relative flex-shrink-0" aria-label="Open menu">
              <Image src={hamberger} alt="" fill className="object-contain" aria-hidden="true" />
            </button>
          )}

          <button
            onClick={() => router.push('/shop')}
            className="relative flex-shrink-0"
          >
            <div className="w-[10vw] ml-[2vw] mt-2 mob:w-[25vw] mob:h-[10vw] mob:ml-0 h-[5vw] mr-[4vw] mob:mr-0 relative">
              <Image
                src={originLogo}
                alt="logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </button>

          {/* --- MOBILE LOCATION BUTTON WITH CAROUSEL (Visible next to logo) --- */}
          {isMobile && isLoggedIn && (
            <button
              onClick={handleSelectAddress}
              className="flex items-center gap-[2vw] px-[3vw] py-[1.5vw] rounded-full bg-gray-100 text-gray-900 text-[3.5vw] font-medium font-[SofiaPro] flex-1 max-w-[35vw] overflow-hidden"
              aria-label="Select Delivery Address"
            >
              <svg
                className="w-[4vw] h-[4vw] flex-shrink-0 text-black-700"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {address.defaultAddress?.address_name ? (
                <div className="flex-1 overflow-hidden relative">
                  <div className="animate-marquee whitespace-nowrap">
                    <span className="font-bold">
                      {address.defaultAddress?.address_name}
                    </span>
                    <span className="mx-[1.5vw]">•</span>
                    <span className="font-normal">
                      {address.defaultAddress.address}
                    </span>
                    {/* Duplicate for seamless loop */}
                    <span className="font-bold ml-[4vw]">
                      {address.defaultAddress?.address_name}
                    </span>
                    <span className="mx-[1.5vw]">•</span>
                    <span className="font-normal">
                      {address.defaultAddress.address}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="font-bold truncate">Address</span>
              )}
            </button>
          )}
          {/* ------------------------------------------------------------------ */}

          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            
            .animate-marquee {
              display: inline-block;
              animation: marquee 12s linear infinite;
              will-change: transform;
            }
          `}</style>
        </div>

        <div className="flex items-center gap-[1.1vw]">
          {/* --- DESKTOP LOCATION BUTTON WITH CAROUSEL (Visible before search) --- */}
          {!isMobile && isLoggedIn && (
            <button
              onClick={handleSelectAddress}
              className="flex items-center gap-2 px-[1.5vw] py-[0.5vw] rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors max-w-[200px]"
              aria-label="Select Delivery Address"
            >
              <svg
                className="w-[1vw] h-[1vw] flex-shrink-0 text-black-700"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {address.defaultAddress?.address_name ? (
                <div className="flex-1 overflow-hidden relative">
                  <div className="animate-marquee whitespace-nowrap text-[1vw]">
                    <span className="font-bold">
                      {address.defaultAddress?.address_name}
                    </span>
                    <span className="mx-[0.5vw]">•</span>
                    <span className="font-light">
                      {address.defaultAddress.address}
                    </span>
                    {/* Duplicate for seamless loop */}
                    <span className="font-bold ml-[2vw]">
                      {address.defaultAddress?.address_name}
                    </span>
                    <span className="mx-[0.5vw]">•</span>
                    <span className="font-light">
                      {address.defaultAddress.address}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="font-bold text-[1vw]">Select Address</span>
              )}
              <svg className="w-[0.6vw] h-[0.6vw] text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          )}
          {/* ------------------------------------------------------------------ */}

          <div className="flex items-center gap-[2vw] pr-[0] mob:hidden">
            <Link
              href="/shop"
              className="h-[2.4vw] px-[2vw] flex items-center justify-center rounded-full bg-primary text-black text-[1.1vw] font-medium font-[SofiaPro]"
            >
              Shop All
            </Link>
          </div>

          {/* Desktop Search Bar */}
          {!isMobile && (
            <div className="flex-1 max-w-[28vw]">
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
                    className="w-full h-[2.4vw] px-[1.17vw] 
                              rounded-full border border-gray-300 bg-transparent 
                              placeholder:text-gray-400 
                              text-[1.1vw] font-[SofiaPro] cursor-pointer 
                              focus:outline-none focus:ring-0 transition-all duration-200"
                  />

                  {!searchQuery && (
                    <div className="absolute left-[1vw] top-1/2 transform -translate-y-1/2 pointer-events-none text-[1vw] font-[SofiaPro] text-gray-500">
                      <AnimatedPlaceholder />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="absolute right-[0.6vw] top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-gray-100 rounded-full w-[1.6vw] h-[1.6vw] flex items-center justify-center transition-colors duration-200"
                  >
                    <svg
                      className="w-[0.9vw] h-[0.9vw] text-gray-600"
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
          )}

          {/* Mobile Search Icon */}
          {isMobile && (
            <button
              onClick={() => router.push('/search')}
              className="p-[2vw] hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Search"
            >
              <svg
                className="w-[5vw] h-[5vw] text-gray-600"
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
          )}

          {/* Mobile & Desktop Account/Login */}
          {loginDetails.isLogin ? (
            <button onClick={openAccount}>
              <div className="w-[1.25vw] mob:w-[5.5vw] mob:h-[5.5vw] h-[1.25vw] relative">
                <Image src={userIcon} alt="account icon" fill className="object-contain" />
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
              <div className="h-[1.67vw] w-[.1vw] bg-black-op-30"></div>
              <button onClick={handleCartOpen} className="relative pr-[1.67vw]">
                {cartItemCount > 0 && (
                  <div className="absolute top-[-.6vw] left-[.7vw] w-[1.25vw] h-[1.25vw] text-[.78vw] rounded-full bg-secondary-300 z-[1] text-white font-[sofiaPro] flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </div>
                )}
                <div className="relative w-[1.25vw] h-[1.25vw] z-0">
                  <Image src={cartIcon} alt="cart-icon" fill className="object-contain" />
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {isMobile && (
        <button
          onClick={handleCartOpen}
          className="fixed bottom-[5vw] right-[5vw] z-[99] bg-white p-[4vw] rounded-full shadow-xl border border-gray-200"
        >
          {cartItemCount > 0 && (
            <div className="absolute top-[-2vw] left-[7vw] w-[6vw] h-[6vw] text-[3vw] rounded-full bg-secondary-300 z-[1] text-white flex items-center justify-center">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </div>
          )}
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