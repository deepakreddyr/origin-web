import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import hamberger from '/public/assets/images/hamberger.png';
import originLogo from '/public/assets/images/neworiginlogo.png';
import userIcon from '/public/assets/images/userIcon.png';
import cartIcon from '/public/assets/icons/cartIcon.png';

import { MobileDrawer, Submenu } from '.';
import OffersRibbon from './OffersRibbon';
import { setCartItems, setCartTabType } from '@/store/slice/CartSlice';
import { setIsSidebarOpen, setLoginDetails, setTabType } from '@/store/slice/loginSlice';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
import { MainMenuType } from '@/utilities/types';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import { profileAtom } from '@/features/AccountPage/context/atoms';
import whiteDropdownIcon from '/public/assets/images/whiteDropdown.png';
import { getAddressAndStoreId } from '@/utilities/utils';

type Props = {
  mainMenuItems: MainMenuType[];
  isHeaderSticky: any;
  search?: boolean;
};

const AnimatedPlaceholder = ({ isScrolled }: { isScrolled: boolean }) => {
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
      className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${
        isScrolled ? 'text-gray-500' : 'text-white text-opacity-70'
      }`}
    >
      Search "{fruits[currentFruitIndex]}"
    </span>
  );
};

const Header = ({ mainMenuItems, isHeaderSticky, search = false }: Props) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
  const [address] = useAtom(addressAtom);
  const [profile] = useAtom(profileAtom);

  const router = useRouter();
  const isMobile = useMediaQuery(600);

  // Filter out items that shouldn't be shown in desktop header
  const excludedLabels = ['Gourmet', 'Fruit Baskets', 'Contact', 'Reviews'];
  const desktopMenuItems = mainMenuItems.filter(
    item => !excludedLabels.includes(item.label)
  );

  useEffect(() => {
    if (search && router.query.q && typeof router.query.q === 'string') {
      setCurrentSearchQuery(router.query.q);
      setSearchQuery(router.query.q);
    }

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

  const handleSelectAddress = () => {
    if (loginDetails.isLogin) {
      dispatch(setIsSidebarOpen(true));

      if (!profile?.data?.profile) {
        dispatch(setTabType(TabTypeConstant.REGISTER));
        return;
      }

      if (address.address.length > 0) {
        dispatch(setTabType(TabTypeConstant.SELECT_ADDRESS));
      } else {
        dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
      }
    } else {
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
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
    if (searchQuery.trim().length >= 2) {
      if (search) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
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

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        handleSearchClick();
      }
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
      setIsScrolled(position > 50);
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
        <div className="bg-[#FFFCDE] border-b border-gray-200 w-full sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              <div className="flex items-center">
                <button 
                  onClick={() => router.push('/shop')}
                  className="flex items-center hover:opacity-80 transition-opacity"
                  aria-label="Go to shop"
                >
                  <div className={`relative mt-[7px] ${isMobile ? 'w-32 h-12' : 'w-40 h-12'}`}>
                    <Image src={originLogo} alt="Origin" fill className="object-contain" />
                  </div>
                </button>
              </div>

              <div className="flex-1 mx-4 max-w-2xl">
                <div className="relative">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                      <svg
                        className="w-5 h-5"
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
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      className="w-full h-12 pl-12 pr-4 bg-white/80 backdrop-blur-sm border-none rounded-full 
                              focus:outline-none focus:ring-0 focus:bg-white
                              text-base font-normal text-gray-800 placeholder:text-gray-500 
                              transition-all duration-200 shadow-sm"
                      placeholder="Search"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loginDetails.isLogin ? openAccount : handleProfileMenuOpen}
                  className="p-2.5 hover:bg-white hover:bg-opacity-40 rounded-full transition-colors duration-200"
                  aria-label="My account"
                >
                  <div className="w-6 h-6 relative">
                    <Image src={userIcon} alt="Account" fill className="object-contain" />
                  </div>
                </button>

                <button
                  onClick={handleCartOpen}
                  className="relative p-2.5 hover:bg-white hover:bg-opacity-40 rounded-full transition-colors duration-200"
                  aria-label={`Shopping cart ${cart?.items?.length > 0 ? `(${cart.items.length} items)` : ''}`}
                >
                  {cart?.items?.length > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-green-500 text-white 
                                  text-xs font-semibold rounded-full flex items-center justify-center">
                      {cart.items.length > 99 ? '99+' : cart.items.length}
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
    <div ref={menuRef} className="fixed top-0 w-full z-20">
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#FFFCDE] shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Section - Logo */}
            <div className="flex items-center gap-4">
              {isMobile && (
                <button 
                  onClick={() => setDrawerOpen(!drawerOpen)} 
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <div className="w-6 h-6 relative">
                    <Image 
                      src={hamberger} 
                      alt="Menu" 
                      fill 
                      className="object-contain"
                      style={{ filter: isScrolled ? 'none' : 'brightness(0) invert(1)' }}
                    />
                  </div>
                </button>
              )}

              <button 
                onClick={() => router.push('/shop')}
                className="hover:opacity-80 transition-opacity"
              >
                <div className={`relative mt-[7px] ${isMobile ? 'w-32 h-10' : 'w-40 h-10'}`}>
                  <Image 
                    src={originLogo} 
                    alt="Foodstories" 
                    fill
                    className="object-contain"
                    style={{ filter: isScrolled ? 'none' : 'brightness(0) invert(1)' }}
                    priority
                  />
                </div>
              </button>
            </div>

            {/* Center Section - Navigation Menu (Desktop Only) */}
            {!isMobile && (
              <div className="flex items-center gap-8 flex-1 justify-center mx-8">
                {desktopMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={'#'}
                    onMouseEnter={() => item.submenu && setOpenSubmenu(item.label)}
                    className={`text-base font-semibold transition-colors duration-200 relative ${
                      isScrolled 
                        ? 'text-gray-900 hover:text-gray-600' 
                        : 'text-white hover:text-white hover:text-opacity-80'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Address Selection Button */}
                {isLoggedIn && (
                  <button
                    onClick={handleSelectAddress}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                      isScrolled
                        ? 'bg-white/60 hover:bg-white/80 text-gray-900'
                        : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                    }`}
                  >
                    {address.defaultAddress?.address_name ? (
                      <div className="flex items-center gap-1 max-w-[200px]">
                        <span className="font-bold text-sm truncate">
                          {address.defaultAddress?.address_name}
                        </span>
                        <span className="text-sm">-</span>
                        <span className="font-light text-sm truncate">
                          {address.defaultAddress.address}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-sm">Select Address</span>
                    )}
                    <div className="relative w-3 h-3">
                      <Image 
                        src={whiteDropdownIcon} 
                        alt="dropdown" 
                        fill
                        className="object-contain"
                        style={{ filter: isScrolled ? 'brightness(0)' : 'none' }}
                      />
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Right Section - Search, Account, Cart */}
            <div className="flex items-center gap-3">
              {/* Desktop Search Bar */}
              {!isMobile && (
                <div className="w-64">
                  <div className="relative">
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isScrolled ? 'text-gray-600' : 'text-white text-opacity-70'
                      }`}>
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
                      </div>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onClick={handleSearchFieldClick}
                        onKeyDown={handleSearchKeyDown}
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                        className={`w-full h-10 pl-10 pr-4 rounded-full border transition-all duration-200 cursor-pointer
                          focus:outline-none focus:ring-0 text-sm font-normal
                          ${isScrolled 
                            ? 'bg-white/80 backdrop-blur-sm border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white' 
                            : 'bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white placeholder:text-opacity-70 focus:bg-white/30'
                          }`}
                      />            

                      {!searchQuery && (
                        <div className="absolute left-10 top-1/2 transform -translate-y-1/2 pointer-events-none text-sm">
                          <AnimatedPlaceholder isScrolled={isScrolled} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Search Icon */}
              {isMobile && (
                <button
                  onClick={() => router.push('/search')}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <svg
                    className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`}
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

              {/* Account Icon - Always visible */}
              <button
                onClick={loginDetails.isLogin ? openAccount : handleProfileMenuOpen}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                aria-label="Account"
              >
                <div className={`w-6 h-6 relative ${isMobile ? 'w-6 h-6' : 'w-6 h-6'}`}>
                  <Image 
                    src={userIcon} 
                    alt="Account" 
                    fill 
                    className="object-contain"
                    style={{ filter: isScrolled ? 'none' : 'brightness(0) invert(1)' }}
                  />
                </div>
              </button>
              
              {/* Cart Icon - Desktop */}
              {!isMobile && (
                <button 
                  onClick={handleCartOpen} 
                  className="relative p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  {cart?.items?.length > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-green-500 text-white 
                                  text-xs font-semibold rounded-full flex items-center justify-center z-10">
                      {cart.items.length > 99 ? '99+' : cart.items.length}
                    </div>
                  )}
                  <div className="relative w-6 h-6">
                    <Image 
                      src={cartIcon} 
                      alt="Cart" 
                      fill 
                      className="object-contain"
                      style={{ filter: isScrolled ? 'none' : 'brightness(0) invert(1)' }}
                    />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cart FAB */}
      {isMobile && (
        <button
          onClick={handleCartOpen}
          className="fixed bottom-6 right-6 z-[20] bg-white p-4 rounded-full shadow-2xl border border-gray-200 hover:shadow-xl transition-shadow"
        >
          {cart?.items?.length > 0 && (
            <div className="absolute -top-2 -right-2 min-w-[24px] h-6 px-1.5 bg-green-500 text-white 
                          text-xs font-semibold rounded-full flex items-center justify-center z-10">
              {cart.items.length > 99 ? '99+' : cart.items.length}
            </div>
          )}
          <div className="relative w-6 h-6">
            <Image src={cartIcon} alt="Cart" fill className="object-contain" />
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
        topBarTransition={isScrolled}
      />

      {!isMobile &&
        desktopMenuItems.map(
          (item) =>
            item.submenu && (
              <Submenu
                key={item.label}
                submenu={item.submenu}
                isOpen={openSubmenu === item.label}
                isMobile={isMobile}
                transitionBool={isScrolled}
              />
            )
        )}
    </div>
  );
};

export default Header;