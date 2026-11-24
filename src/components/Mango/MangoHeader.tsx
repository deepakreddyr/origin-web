import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { addressAtom, isLocationModalOpen } from '@/features/Address/context/atoms';
import { setIsSidebarOpen, setTabType, setLoginDetails } from '@/store/slice/loginSlice';
import { useCartStore } from '@/hooks/useCartStore';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
import { setRouteSourceToLs } from '@/utilities/utils';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { protectedUrl, unprotectedUrl } from '@/url';
import originLogo from '/public/assets/images/neworiginlogo.png';
import cartIcon from '/public/assets/icons/cartIcon.png';
import locationArrow from '/public/assets/svg/locationarrow.svg';
import userIcon from '/public/assets/images/userIcon.png';
import CircularProgress from '@mui/material/CircularProgress';

interface MangoHeaderProps {
  isHeaderSticky?: boolean;
  disableSkipLogin?: boolean;
}

const getCartItemCount = (cartItems: any[]) => {
  let count = 0;
  cartItems.forEach((product: any) => {
    product.multiple_uoms?.forEach((uom: any) => {
      if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
        uom.cart_ripeness.forEach((ripeness: any) => {
          const qty = Number(ripeness.qty);
          if (qty > 0) count++;
        });
      } else if (uom.cart_quantity > 0) {
        count++;
      }
    });
  });
  return count;
};

const MangoHeader = ({ isHeaderSticky = true, disableSkipLogin = false }: MangoHeaderProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [address] = useAtom(addressAtom);
  const [, setIsLocationModalOpen] = useAtom(isLocationModalOpen);
  const { cart, actions, isMangoPage } = useCartStore();
  const { setCartItems, setCartTabType } = actions;
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const cartItemCount = getCartItemCount(cart?.items || []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const getDataFromApi = useGetDataFromApi();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If mobile search is open, don't trigger handleClickOutside clearing
      if (isMobileSearchOpen) return;

      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, isMobileSearchOpen]);

  useEffect(() => {
    if (searchQuery.trim().length <= 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    setIsSearchLoading(true);
    setShowDropdown(true);
    const token = localStorage.getItem('user_token');
    const parentCategoryId = localStorage.getItem('mango_parent_category_id') || '33';

    const storeId = address.defaultAddress?.store_id || localStorage.getItem('store-id');

    let apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL +
      (token && loginDetails.isLogin ? protectedUrl['mangoSearch'] : unprotectedUrl['mangoSearch']) +
      `?query=${encodeURIComponent(searchQuery)}&parent_category_id=${parentCategoryId}`;

    if (storeId && storeId !== 'null') {
      apiUrl += `&store_id=${storeId}`;
    }

    const additionalHeaders: any = {
      'parent-category-id': parentCategoryId
    };

    if (storeId && storeId !== 'null') {
      additionalHeaders['store-id'] = storeId;
    }

    const successHandler = (data: any) => {
      console.log('[MangoSearch] response:', data);
      setSearchResults(data?.data || []);
      setShowDropdown(true);
      setIsSearchLoading(false);
    };

    const failureHandler = (error: any) => {
      console.error('[MangoSearch] error:', error);
      setIsSearchLoading(false);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  };

  const handleSelectAddress = () => {
    if (!loginDetails.isLogin) {
      if (disableSkipLogin) {
        dispatch(setIsSidebarOpen(true));
        dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      } else {
        setIsLocationModalOpen(true);
      }
      return;
    }
    dispatch(setIsSidebarOpen(true));
    setRouteSourceToLs(TabTypeConstant.ACCOUNT_MAIN);
    if (address?.address && address.address.length > 0) {
      dispatch(setTabType(TabTypeConstant.SELECT_ADDRESS));
    } else {
      dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
    }
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
      const cartItemFromLs = localStorage.getItem(isMangoPage ? 'mango_cart_items' : 'cart_items');
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

  // const handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  //   }
  // };

  const highlightMango = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(Mango)/gi);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === 'mango' ? (
            <span key={i} className="text-[#fac510]">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const renderViewAllResults = () => {
    const handleViewAll = (e: React.MouseEvent) => {
      e.preventDefault();
      router.push('/mango/products');
      setShowDropdown(false);
      setIsMobileSearchOpen(false);
    };

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleViewAll}
        onKeyDown={(e) => e.key === 'Enter' && handleViewAll(e as any)}
        className="cursor-pointer block w-full bg-white border-t border-[#f0ecd8] py-4 flex items-center justify-center text-[14px] font-bold font-[SofiaPro] hover:bg-gray-50 transition-colors"
      >
        <span className="text-[#fac510] mr-1">View all</span>
        <span className="text-black">results for </span>
        <span className="text-[#fac510] ml-1">&quot;{searchQuery}&quot;</span>
      </div>
    );
  };

  const renderSearchSkeleton = () => {
    return (
      <div className="py-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[#f0ecd8] animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/6" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderNoResults = (isDesktop: boolean) => {
    return (
      <div className={`flex flex-col items-center justify-center p-6 ${isDesktop ? 'py-6' : 'mt-[20vw]'}`}>
        <div className={`${isDesktop ? 'w-20 h-20' : 'w-[30vw] h-[30vw]'} relative mb-4`}>
          <Image src="/assets/svg/mangonosearch.svg" alt="No results" fill className="object-contain opacity-80" />
        </div>
        <span
          className={`${isDesktop ? 'text-[15px]' : 'text-[18px]'} font-bold text-black font-[SofiaPro] mb-2 text-center px-4`}
        >
          No results found for <span className="text-[#fac510]">&quot;{searchQuery}&quot;</span>
        </span>
        <span className={`${isDesktop ? 'text-[12px]' : 'text-[14px]'} text-gray-500 font-[SofiaPro] text-center px-4`}>
          We couldn&apos;t find any mangoes matching your search.
        </span>
      </div>
    );
  };

  return (
    <>
      <header
        className={`${isHeaderSticky ? 'fixed top-0' : 'absolute top-0'} left-0 w-full z-[100] bg-[#FFECA6] px-6 md:px-[7vw] py-3 flex items-center justify-between`}
      >
        <div className="flex items-center gap-1 flex-1">
          {/* Logo - Visible on mobile Only if skip-login is disabled and user is not logged in */}
          <Link
            href="/mango"
            className={`${!disableSkipLogin || loginDetails?.isLogin ? 'hidden md:flex' : 'flex'} relative w-32 h-8 md:w-60 md:h-16 flex-shrink-0 mt-[2px] md:mt-[5px]`}
          >
            <Image src={originLogo} alt="Origin Fresh" fill className="object-contain" priority />
          </Link>

          {/* Separator - Desktop only */}
          {(loginDetails?.isLogin || !disableSkipLogin) && (
            <div className="hidden md:block w-[1px] h-8 bg-black opacity-10 mx-2"></div>
          )}

          {/* Login or Address UI */}
          {(loginDetails?.isLogin || !disableSkipLogin) && (
            <button
              id="location-header-button"
              onClick={handleSelectAddress}
              className="flex items-center gap-2 group text-left max-w-[200px] md:max-w-[250px]"
            >
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <div className="relative w-3.5 h-3.5 flex-shrink-0">
                    <Image src={locationArrow} alt="Location" fill className="object-contain" />
                  </div>
                  <span
                    className="text-[13px] md:text-[13px] font-bold text-gray-900 leading-tight"
                    style={{ fontFamily: 'SofiaPro' }}
                  >
                    {address.defaultAddress?.address_name || 'Select'}
                  </span>
                </div>
                <span
                  className="text-[11px] md:text-[11px] text-gray-500 truncate mt-0.5"
                  style={{ fontFamily: 'SofiaPro' }}
                >
                  {address.defaultAddress?.address || 'Set your delivery location'}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Right side: Search, Account, Cart */}
        <div className="flex items-center gap-2.5 md:gap-10">
          {/* Search - Icon on mobile, Bar on desktop */}
          <div className="w-auto md:w-[320px] relative" ref={dropdownRef}>
            <form className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 2 && setShowDropdown(true)}
                placeholder="Search products"
                className="hidden md:block w-full bg-[#F8F4E9] rounded-[10px] pl-5 pr-20 py-2.5 text-[14px] outline-none shadow-none text-gray-700 placeholder:text-gray-400 border border-[#F0ECD8] transition-all"
                style={{ fontFamily: 'SofiaPro' }}
              />
              {/* Clear button (X) - Desktop */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hidden md:flex absolute right-12 top-1/2 -translate-y-1/2 items-center justify-center p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {/* Mobile Search Icon */}
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(true)}
                className="md:hidden w-9 h-9 flex items-center justify-center bg-[#F8F4E9] rounded-full text-gray-700 border border-[#F0ECD8]"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              {/* Desktop Search Icon inside bar */}
              <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center gap-2">
                {isSearchLoading && <CircularProgress size={16} sx={{ color: '#FFD74F' }} />}
                <button type="submit" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {/* Search Dropdown - Desktop */}
            {!isMobileSearchOpen && showDropdown && (
              <div className="absolute top-full right-0 md:left-0 w-[280px] md:w-full mt-2 bg-[#F8F4E9] rounded-[10px] shadow-xl overflow-hidden z-[110] border border-[#f0ecd8]">
                {searchResults.length > 0 ? (
                  <div className="">
                    {searchResults.slice(0, 6).map((item: any) => (
                      <Link
                        key={item.id}
                        href={`/mango/products/${encodeURIComponent(item.name.replace(/ /g, '-').toLowerCase())}?id=${item.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#f3f0e0] transition-colors group"
                        onClick={() => {
                          setShowDropdown(false);
                          setIsMobileSearchOpen(false);
                        }}
                      >
                        <div className="relative w-12 h-12 rounded-lg bg-white overflow-hidden flex-shrink-0">
                          <Image
                            src={item.website_image || originLogo}
                            alt={item.name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p
                              className="text-[14px] font-bold text-[#1B1B1B] truncate"
                              style={{ fontFamily: 'SofiaPro' }}
                            >
                              {highlightMango(item.name)}
                            </p>
                            <p className="text-[12px] font-bold text-[#1B1B1B] ml-2 whitespace-nowrap flex-shrink-0">
                              ₹ {item.multiple_uoms?.[0]?.price || 'N/A'}
                            </p>
                          </div>
                          <p className="text-[11px] text-gray-500 truncate" style={{ fontFamily: 'SofiaPro' }}>
                            {item.description || 'Premium farm fresh fruit'}
                          </p>
                        </div>
                      </Link>
                    ))}
                    {renderViewAllResults()}
                  </div>
                ) : isSearchLoading ? (
                  renderSearchSkeleton()
                ) : (
                  searchQuery.trim().length > 2 && !isSearchLoading && renderNoResults(true)
                )}
              </div>
            )}
          </div>

          {/* Mobile Icons Container */}
          <div className="flex md:hidden items-center gap-2">
            {/* Account Icon */}
            <button
              onClick={loginDetails.isLogin ? openAccount : handleProfileMenuOpen}
              className="w-9 h-9 relative bg-[#F8F4E9] rounded-full flex items-center justify-center transition-opacity border border-[#F0ECD8]"
              aria-label="Account"
            >
              <div className="w-5 h-5 relative opacity-70">
                <Image src={userIcon} alt="Account" fill className="object-contain" />
              </div>
            </button>

            {/* Cart Icon */}
            <button
              onClick={handleCartOpen}
              className="w-9 h-9 relative bg-[#F8F4E9] rounded-full flex items-center justify-center transition-colors border border-[#F0ECD8]"
              aria-label="Cart"
            >
              <div className="w-5 h-5 relative opacity-70 brightness-0">
                <Image src={cartIcon} alt="Cart" fill className="object-contain" />
              </div>
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#26B45F] text-white text-[8px] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center border border-white shadow-sm">
                  {cartItemCount}
                </div>
              )}
            </button>
          </div>

          {/* Desktop Unified Container */}
          <div className="hidden md:flex items-center bg-[#F8F4E9] rounded-[10px] border border-[#F0ECD8] px-5 py-2.5 gap-5 shadow-sm">
            {/* Account Icon */}
            <button
              onClick={loginDetails.isLogin ? openAccount : handleProfileMenuOpen}
              className="w-6 h-6 relative opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Account"
            >
              <Image src={userIcon} alt="Account" fill className="object-contain" />
            </button>

            {/* Vertical Divider */}
            <div className="w-[1px] h-6 bg-[#E0DBC5] opacity-50"></div>

            {/* Cart Icon */}
            <button
              onClick={handleCartOpen}
              className="relative w-6 h-6 flex items-center justify-center transition-colors group"
              aria-label="Cart"
            >
              <div className="w-full h-full relative opacity-60 group-hover:opacity-100 transition-opacity brightness-0">
                <Image src={cartIcon} alt="Cart" fill className="object-contain" />
              </div>
              {cartItemCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-[#26B45F] text-white text-[9px] font-bold w-[17px] h-[17px] rounded-full flex items-center justify-center border border-white shadow-sm">
                  {cartItemCount}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 bg-[#F8F4E9] z-[200] flex flex-col md:hidden">
          {/* Header with Search Input */}
          <div className="p-5 flex items-center gap-3 border-b border-[#f0ecd8] bg-[#FFECA6]">
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="p-1"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 relative">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for mangoes..."
                className="w-full bg-[#F8F4E9] rounded-[10px] pl-10 pr-12 py-3 text-[16px] outline-none border border-[#F0ECD8] font-[SofiaPro]"
              />
              {/* Clear button (X) - Mobile */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {isSearchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CircularProgress size={18} sx={{ color: '#FFD74F' }} />
                </div>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto bg-[#F8F4E9]">
            {searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/mango/products/${encodeURIComponent(item.name.replace(/ /g, '-').toLowerCase())}?id=${item.id}`}
                    className="flex items-center gap-4 px-5 py-4 border-b border-[#ece8d4] last:border-0"
                    onClick={() => {
                      setIsMobileSearchOpen(false);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="relative w-16 h-16 rounded-xl bg-white overflow-hidden shadow-sm flex-shrink-0">
                      <Image
                        src={item.image || originLogo}
                        alt={item.name}
                        fill
                        className="object-contain p-1.5"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-[16px] font-bold text-[#1B1B1B] truncate font-[SofiaPro]">
                          {highlightMango(item.name)}
                        </p>
                        <p className="text-[14px] font-bold text-[#1B1B1B] ml-2 whitespace-nowrap flex-shrink-0">
                          ₹{item.multiple_uoms?.[0]?.price || 'N/A'}
                        </p>
                      </div>
                      <p className="text-[12px] text-gray-500 truncate font-[SofiaPro]">
                        {item.description || 'Premium farm fresh fruit'}
                      </p>
                    </div>
                  </Link>
                ))}
                {renderViewAllResults()}
              </div>
            ) : isSearchLoading ? (
              renderSearchSkeleton()
            ) : searchQuery.trim().length > 2 && !isSearchLoading ? (
              renderNoResults(false)
            ) : !searchQuery.trim() ? (
              <div className="p-10 text-center opacity-40">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-gray-500 font-[SofiaPro]">Discover our sweet season</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default MangoHeader;
