import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import { setIsSidebarOpen, setTabType, setLoginDetails } from '@/store/slice/loginSlice';
import { setCartItems, setCartTabType } from '@/store/slice/CartSlice';
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

const MangoHeader = ({ isHeaderSticky = true }: MangoHeaderProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [address] = useAtom(addressAtom);
  const cart = useSelector((state: any) => state.cart);
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const cartItemCount = getCartItemCount(cart?.items || []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const getDataFromApi = useGetDataFromApi();

  useEffect(() => {
    if (!searchQuery.trim()) {
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
    const token = localStorage.getItem('user_token');
    const parentCategoryId = localStorage.getItem('mango_parent_category_id') || '33';

    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL +
      (token ? protectedUrl['mangoSearch'] : unprotectedUrl['mangoSearch']) +
      `?query=${encodeURIComponent(searchQuery)}&parent_category_id=${parentCategoryId}`;

    const additionalHeaders = {
      'parent-category-id': parentCategoryId
    };

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
    dispatch(setIsSidebarOpen(true));
    if (!loginDetails.isLogin) {
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      return;
    }
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

  return (
    <header
      className={`${isHeaderSticky ? 'fixed top-0' : 'absolute top-0'} left-0 w-full z-[100] bg-[#FFECA6] px-12 md:px-[7vw] py-3 flex items-center justify-between`}
    >
      <div className="flex items-center gap-1 flex-1">
        {/* Logo */}
        <Link href="/mango" className="relative w-40 h-12 md:w-60 md:h-16 flex-shrink-0 mt-[5px]">
          <Image src={originLogo} alt="Origin Fresh" fill className="object-contain" priority />
        </Link>

        {/* Separator */}
        <div className="hidden md:block w-[1px] h-8 bg-black opacity-10 mx-2"></div>

        {/* Location Selector */}
        <button
          onClick={handleSelectAddress}
          className="hidden md:flex items-center gap-2 group text-left max-w-[200px]"
        >
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-1.5">
              <div className="relative w-3.5 h-3.5 flex-shrink-0">
                <Image src={locationArrow} alt="Location" fill className="object-contain" />
              </div>
              <span className="text-[13px] font-bold text-gray-900 leading-tight" style={{ fontFamily: 'SofiaPro' }}>
                {address.defaultAddress?.address_name || 'Select'}
              </span>
            </div>
            <span className="text-[11px] text-gray-500 truncate mt-0.5" style={{ fontFamily: 'SofiaPro' }}>
              {address.defaultAddress?.address || 'Set your delivery location'}
            </span>
          </div>
        </button>
      </div>

      {/* Right side: Search */}
      <div className="flex items-center gap-10">
        {/* Search Bar */}
        <div className="w-[320px] hidden md:block relative">
          <form className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
              placeholder="Search products"
              className="w-full bg-[#F8F4E9] rounded-[10px] px-5 py-2.5 text-[14px] outline-none shadow-none text-gray-700 placeholder:text-gray-400 border border-transparent transition-all"
              style={{ fontFamily: 'SofiaPro' }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
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

          {/* Search Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#F8F4E9] rounded-[10px] shadow-xl overflow-hidden z-[101] border border-[#f0ecd8]">
              <div className="py-2">
                {searchResults.slice(0, 4).map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/mango/products/${encodeURIComponent(item.name.replace(/ /g, '-').toLowerCase())}?id=${item.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#f3f0e0] transition-colors group"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="relative w-12 h-12 rounded-lg bg-white overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || originLogo}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[14px] font-bold text-[#1B1B1B] truncate" style={{ fontFamily: 'SofiaPro' }}>
                          {(() => {
                            const parts = item.name.split(/(mango)/i);
                            return parts.map((part: string, i: number) =>
                              part.toLowerCase() === 'mango' ? (
                                <span key={i} className="text-[#F9C410]">
                                  {part}
                                </span>
                              ) : (
                                part
                              )
                            );
                          })()}
                        </p>
                        <p className="text-[12px] font-bold text-[#1B1B1B] ml-2">
                          ₹ {item.multiple_uoms?.[0]?.price || 'N/A'}
                        </p>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate" style={{ fontFamily: 'SofiaPro' }}>
                        {item.description || 'Premium farm fresh fruit'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="border-t border-[#f0ecd8] py-3 text-center bg-white">
                <Link
                  href="/mango/products"
                  className="text-[14px] font-bold text-[#1B1B1B]"
                  style={{ fontFamily: 'SofiaPro' }}
                  onClick={() => setShowDropdown(false)}
                >
                  <span className="text-[#F9C410]">View all</span> results for{' '}
                  <span className="text-[#F9C410]">'{searchQuery}'</span>
                </Link>
              </div>
            </div>
          )}
          {/* Click away listener overlay */}
          {showDropdown && <div className="fixed inset-0 z-[-1]" onClick={() => setShowDropdown(false)}></div>}
        </div>

        {/* Account & Cart Unified Container */}
        <div className="flex items-center bg-[#F9F7EF] rounded-[10px] border border-[#F0ECD8] px-5 py-2.5 gap-5 shadow-sm">
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
  );
};

export default MangoHeader;
