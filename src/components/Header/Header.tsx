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
import { addressAtom, isLocationModalOpen } from '@/features/Address/context/atoms';
import { profileAtom } from '@/features/AccountPage/context/atoms';
import { couponList as couponListAtom } from '@/features/CouponPage/context/atoms';
import whiteDropdownIcon from '/public/assets/images/whiteDropdown.png';
import { setRouteSourceToLs } from '@/utilities/utils';
// --------------------------------------------------------

import { MapPin, ChevronDown } from 'lucide-react';
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
  transparentColor?: 'black' | 'white';
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

const Header = ({ mainMenuItems, isHeaderSticky = true, search = false, transparentColor }: Props) => {
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
  const [couponsState] = useAtom(couponListAtom);
  const [, setIsLocationModalOpen] = useAtom(isLocationModalOpen);
  // --------------------------

  const router = useRouter();
  const isMobile = useMediaQuery(600);
  const isShopPage = router.pathname === '/';
  // Transparent header on mobile or when transparentColor is provided, if not opaque
  const isTransparentHeader = isMobile && !isOpaque && (isShopPage || !!transparentColor);
  const isBlackMode = transparentColor === 'black';

  // Helper function to get icon filter based on transparent color
  const getIconFilter = () => {
    if (!isTransparentHeader) return '';
    return isBlackMode ? 'brightness-0' : 'brightness-0 invert';
  };

  // Helper function to get text color class
  const getTextColor = () => {
    if (!isTransparentHeader) return 'text-gray-900';
    return isBlackMode ? 'text-black' : 'text-white';
  };

  // Helper function to get location button styles
  const getLocationButtonStyles = () => {
    if (!isTransparentHeader) return 'bg-black/5 text-gray-900';
    return isBlackMode ? 'bg-black/10 text-black' : 'bg-black/30 text-white';
  };

  // Helper function to get location icon color
  const getLocationIconColor = () => {
    if (!isTransparentHeader) return 'text-gray-700';
    return isBlackMode ? 'text-black' : 'text-white';
  };

  // Helper function to get dropdown icon color
  const getDropdownIconColor = () => {
    if (!isTransparentHeader) return 'text-gray-500';
    return isBlackMode ? 'text-black' : 'text-white';
  };

  // Helper function to get separator color
  const getSeparatorColor = () => {
    if (!isTransparentHeader) return 'bg-gray-300';
    return isBlackMode ? 'bg-black/20' : 'bg-white/30';
  };

  // Helper function to get search bar styles
  const getSearchBarStyles = () => {
    if (!isTransparentHeader) return 'bg-[#F8F4E9] border border-gray-200 text-black';
    return isBlackMode ? 'bg-black/10 text-black border-none' : 'bg-black/30 text-white border-none';
  };

  // Helper function to get search icon color
  const getSearchIconColor = () => {
    if (!isTransparentHeader) return 'text-gray-400';
    return isBlackMode ? 'text-black' : 'text-white';
  };

  // Helper function to get search placeholder color
  const getSearchPlaceholderColor = () => {
    if (!isTransparentHeader) return 'text-gray-400';
    return isBlackMode ? 'text-black/70' : 'text-white/90';
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
    if (!loginDetails.isLogin) {
      setIsLocationModalOpen(true);
      return;
    }

    dispatch(setIsSidebarOpen(true));
    setRouteSourceToLs(TabTypeConstant.ACCOUNT_MAIN);

    // If addresses are still loading from launch API, default to SELECT_ADDRESS
    // so the sidebar shows a loading state rather than "no addresses found"
    if (address.loading || (address?.address && address.address.length > 0)) {
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
    <header
      ref={menuRef}
      className={`sticky top-0 z-[70] bg-[rgba(250,246,236,0.86)] backdrop-blur-[14px] backdrop-saturate-[1.4] border-b border-black/10 w-full transition-all duration-300 ${
        isMobile && loginDetails.isSidebarOpen ? 'hidden' : ''
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-[clamp(24px,5vw,72px)] flex items-center justify-between py-[28px] mob:py-[20px] relative">
        {/* Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="block md:hidden text-[24px] leading-none -mt-2"
            >
              ☰
            </button>
          )}
          <Link
            href="/"
            className="font-Recoleta font-semibold text-[21px] flex items-center tracking-[0.01em] mob:mt-2 mt-3"
          >
            <div className="relative w-[120px] h-[26px]">
              <Image src={originLogo} alt="Origin Fresh" fill className="object-contain object-left" priority />
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        {!isMobile && !search && (
          <nav className="flex items-center gap-[34px] text-[14px] font-semibold text-ink-soft absolute left-1/2 -translate-x-1/2">
            <Link
              href="/"
              className={`relative py-1 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:bg-brand-yellow-400 after:transition-all after:duration-300 ${router.pathname === '/' ? 'after:right-0' : 'after:right-[100%] hover:after:right-0'}`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={`relative py-1 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:bg-brand-yellow-400 after:transition-all after:duration-300 ${router.pathname === '/shop' ? 'after:right-0' : 'after:right-[100%] hover:after:right-0'}`}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className={`relative py-1 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:bg-brand-yellow-400 after:transition-all after:duration-300 ${router.pathname === '/about' ? 'after:right-0' : 'after:right-[100%] hover:after:right-0'}`}
            >
              About
            </Link>
            <Link
              href="/events"
              className={`relative py-1 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:bg-brand-yellow-400 after:transition-all after:duration-300 ${router.pathname === '/events' ? 'after:right-0' : 'after:right-[100%] hover:after:right-0'}`}
            >
              Events
            </Link>
          </nav>
        )}

        {/* Desktop Search Bar (only on search page) */}
        {!isMobile && search && (
          <div className="flex-1 flex justify-center max-w-[600px] mx-auto px-4 relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full bg-white border border-[rgba(25,23,18,0.12)] rounded-full py-[12px] pl-[44px] pr-[20px] focus:outline-none focus:border-black font-Recoleta text-[16px] text-black shadow-sm"
            />
            <div className="absolute left-[28px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  if (search) setCurrentSearchQuery('');
                  debouncedSearch('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-[28px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                aria-label="Clear search"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-[14px]">
          {/* Desktop Address Selector */}
          {!isMobile && (
            <button
              id="location-header-button"
              onClick={handleSelectAddress}
              disabled={address.loading}
              className={`flex items-center gap-[6px] px-3 py-1.5 rounded-full bg-cream hover:bg-[#F2EEE4] transition-colors border border-black/5 ${address.loading ? 'opacity-50 pointer-events-none' : ''}`}
              aria-label="Select Delivery Address"
            >
              <MapPin size={16} className="text-brand-yellow-500" />
              <span className="truncate max-w-[180px] text-[13px] font-semibold text-ink">
                {address.defaultAddress?.address_name || 'Select Location'}
              </span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
          )}

          {/* Search Icon */}
          {!search && (
            <button
              onClick={handleSearchFieldClick}
              className="relative w-[22px] h-[22px] text-ink hover:text-brand-yellow-400 transition-colors ml-2"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          )}

          {/* User Account */}
          <button
            onClick={isLoggedIn ? openAccount : handleProfileMenuOpen}
            className="relative w-[22px] h-[22px] ml-[4px]"
          >
            <Image src={userIcon} alt="Account" fill className="object-contain" />
          </button>

          {/* Cart */}
          <button onClick={handleCartOpen} className="relative w-[24px] h-[24px] ml-[4px]">
            {cartItemCount > 0 && (
              <div className="absolute top-[-6px] right-[-8px] w-[16px] h-[16px] text-[10px] rounded-full bg-[#27ae60] text-white flex items-center justify-center z-10 font-bold border border-white">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </div>
            )}
            <Image src={cartIcon} alt="Cart" fill className="object-contain" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row (if mobile and search is needed, or just let them click search icon) */}
      {isMobile && search && (
        <div className="px-[5vw] pb-[3vw]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onClick={handleSearchFieldClick}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full h-[12vw] pl-[12vw] pr-[4vw] rounded-full text-[4vw] font-SofiaPro bg-white border border-black/10 outline-none"
            />
            {!searchQuery && (
              <div className="absolute left-[12vw] top-1/2 -translate-y-1/2 pointer-events-none text-[4vw] text-gray-400 font-SofiaPro">
                <AnimatedPlaceholder />
              </div>
            )}
            <div className="absolute left-[4vw] top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-[5vw] h-[5vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Drawer & Submenus */}
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
    </header>
  );
};

export default Header;
