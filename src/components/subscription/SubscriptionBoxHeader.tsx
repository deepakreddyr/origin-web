import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import { setIsSidebarOpen, setTabType, setLoginDetails } from '@/store/slice/loginSlice';
import { setCartTabType } from '@/store/slice/CartSlice';
import { useCartStore } from '@/hooks/useCartStore';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import originLogo from '/public/assets/images/neworiginlogo.png';
import cartIcon from '/public/assets/icons/cartIcon.png';
import locationArrow from '/public/assets/svg/locationarrow.svg';
import userIcon from '/public/assets/images/userIcon.png';

import { hydrateSubscriptionBoxCart } from '@/store/slice/SubscriptionBoxCartSlice';
import { setRouteSourceToLs } from '@/utilities/utils';

interface SubscriptionBoxHeaderProps {
  isHeaderSticky?: boolean;
}

const SubscriptionBoxHeader: React.FC<SubscriptionBoxHeaderProps> = ({ isHeaderSticky = true }) => {
  const dispatch = useDispatch();
  const [address] = useAtom(addressAtom);
  const { subscriptionBoxCart } = useCartStore();
  const loginDetails = useSelector((state: any) => state.loginDetails);

  React.useEffect(() => {
    dispatch(hydrateSubscriptionBoxCart());
  }, [dispatch]);

  const cartBadgeCount = subscriptionBoxCart?.item ? subscriptionBoxCart.totalQuantity || 1 : 0;

  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectAddress = () => {
    dispatch(setIsSidebarOpen(true));

    const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;
    const isLoggedIn = Boolean(loginDetails?.isLogin || token);

    if (!isLoggedIn) {
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      return;
    }

    setRouteSourceToLs(TabTypeConstant.ACCOUNT_MAIN);

    if (address.loading || (address?.address && address.address.length > 0)) {
      dispatch(setTabType(TabTypeConstant.SELECT_ADDRESS));
    } else {
      dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
    }
  };

  const handleAccountClick = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;
    const isLoggedIn = Boolean(loginDetails?.isLogin || token);
    if (isLoggedIn) {
      dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));
    } else {
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
    }
    dispatch(setIsSidebarOpen(true));
  };

  const handleCartClick = () => {
    dispatch(
      setLoginDetails({
        isSidebarOpen: true,
        tabType: TabTypeConstant.CART
      })
    );
    if (!subscriptionBoxCart?.item) {
      dispatch(setCartTabType(TabTypeConstant.EMPTY_CART));
    } else {
      dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
    }
  };

  return (
    <header
      className={`${
        isHeaderSticky ? 'fixed top-0' : 'relative'
      } left-0 w-full z-[100] bg-white border-b border-black/5 px-4 sm:px-6 lg:px-[54px] py-3.5 flex items-center justify-between shadow-2xs`}
    >
      {/* Left: Logo & Address Selector */}
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        {/* Origin Fresh Logo */}
        <Link
          href="/subscriptionbox"
          className="relative w-28 sm:w-36 md:w-44 h-8 md:h-10 flex-shrink-0 flex items-center"
        >
          <Image src={originLogo} alt="Origin Fresh" fill className="object-contain object-left" priority />
        </Link>

        {/* Separator - Desktop */}
        <div className="hidden md:block w-[1px] h-7 bg-black/10 mx-1"></div>

        {/* Address Selection Button */}
        <button
          type="button"
          onClick={handleSelectAddress}
          className="flex items-center gap-2 group text-left max-w-[180px] mob:max-w-[125px] xs:max-w-[170px] sm:max-w-[220px] md:max-w-[280px] cursor-pointer"
        >
          <div className="relative w-3.5 h-3.5 flex-shrink-0 mt-0.5">
            <Image src={locationArrow} alt="Location" fill className="object-contain" />
          </div>
          <div className="flex flex-col overflow-hidden leading-tight">
            <span
              className="text-[12.5px] sm:text-[13px] font-bold text-[#132B1E] truncate group-hover:text-[#8D4320] transition-colors"
              style={{ fontFamily: 'SofiaPro' }}
            >
              {address.defaultAddress?.address_name || 'Select'}
            </span>
            <span
              className="text-[10.5px] sm:text-[11px] text-[#7A837A] truncate mt-0.5"
              style={{ fontFamily: 'SofiaPro' }}
            >
              {address.defaultAddress?.address || 'Set your delivery location'}
            </span>
          </div>
        </button>
      </div>

      {/* Right Side: Search, Account & Cart */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Search Bar (Desktop) */}
        <div className="hidden md:block w-[220px] lg:w-[280px] relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products"
            className="w-full bg-[#F3EFE6] rounded-[10px] pl-4 pr-9 py-2 text-[13px] outline-none text-[#132B1E] placeholder:text-[#9A9E9A] border border-[#E8E2D5] focus:border-[#C25E2E] transition-all font-[SofiaPro]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Desktop Unified Account & Cart Container */}
        <div className="hidden md:flex items-center bg-[#F3EFE6] rounded-[10px] border border-[#E8E2D5] px-4 py-2 gap-4 shadow-2xs">
          {/* Account Icon */}
          <button
            type="button"
            onClick={handleAccountClick}
            className="w-5 h-5 relative opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Account"
          >
            <Image src={userIcon} alt="Account" fill className="object-contain" />
          </button>

          {/* Vertical Divider */}
          <div className="w-[1px] h-5 bg-black/10"></div>

          {/* Cart Icon */}
          <button
            type="button"
            onClick={handleCartClick}
            className="relative w-5 h-5 flex items-center justify-center transition-colors group cursor-pointer"
            aria-label="Cart"
          >
            <div className="w-full h-full relative opacity-60 group-hover:opacity-100 transition-opacity brightness-0">
              <Image src={cartIcon} alt="Cart" fill className="object-contain" />
            </div>
            {cartBadgeCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-[#16A34A] text-white text-[9px] font-bold w-[17px] h-[17px] rounded-full flex items-center justify-center border border-white shadow-xs">
                {cartBadgeCount}
              </div>
            )}
          </button>
        </div>

        {/* Mobile Icons Container */}
        <div className="flex md:hidden items-center gap-2">
          {/* Account Icon Button */}
          <button
            type="button"
            onClick={handleAccountClick}
            className="w-9 h-9 relative bg-[#F3EFE6] border border-[#E8E2D5] rounded-full flex items-center justify-center cursor-pointer"
            aria-label="Account"
          >
            <div className="w-4 h-4 relative opacity-70">
              <Image src={userIcon} alt="Account" fill className="object-contain" />
            </div>
          </button>

          {/* Cart Icon Button */}
          <button
            type="button"
            onClick={handleCartClick}
            className="w-9 h-9 relative bg-[#F3EFE6] border border-[#E8E2D5] rounded-full flex items-center justify-center cursor-pointer"
            aria-label="Cart"
          >
            <div className="w-4 h-4 relative opacity-70 brightness-0">
              <Image src={cartIcon} alt="Cart" fill className="object-contain" />
            </div>
            {cartBadgeCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-[#16A34A] text-white text-[8px] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center border border-white shadow-xs">
                {cartBadgeCount}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default SubscriptionBoxHeader;
