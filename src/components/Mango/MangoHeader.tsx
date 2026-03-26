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
import originLogo from '/public/assets/images/neworiginlogo.png';
import cartIcon from '/public/assets/icons/cartIcon.png';
import locationArrow from '/public/assets/svg/locationarrow.svg';

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={`${isHeaderSticky ? 'fixed top-0' : 'absolute top-0'} left-0 w-full z-[100] bg-[#FFECA6] px-12 md:px-[7vw] py-3 flex items-center justify-between`}
    >
      <div className="flex items-center gap-1 flex-1">
        {/* Logo */}
        <Link href="#" className="relative w-40 h-12 md:w-60 md:h-16 flex-shrink-0 mt-[5px]">
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

      {/* Right side: Search and Cart */}
      <div className="flex items-center gap-10">
        {/* Search Bar */}
        <div className="w-[320px] hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
              className="w-full bg-[#F8F4E9] rounded-xl px-5 py-2.5 text-[14px] outline-none shadow-none text-gray-700 placeholder:text-gray-400"
              style={{ fontFamily: 'SofiaPro' }}
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Cart Icon */}
        <button
          onClick={handleCartOpen}
          className="relative w-12 h-12 bg-[#FFD74F] rounded-full flex items-center justify-center transition-colors"
        >
          <div className="w-6 h-6 relative">
            <Image src={cartIcon} alt="Cart" fill className="object-contain brightness-0" />
          </div>
          <div className="absolute top-[5px] right-[10px] bg-[#26B45F] text-white text-[9px] font-normal w-[15px] h-[15px] rounded-full flex items-center justify-center">
            {cartItemCount}
          </div>
        </button>
      </div>
    </header>
  );
};

export default MangoHeader;
