import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { setSubscriptionItem, setIsSubscriptionActive } from '@/store/slice/SubscriptionCartSlice';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
// import { User } from 'lucide-react';
import userIcon from '/public/assets/images/userIcon.png';

const SubscriptionHeader = ({ item, maxQty }: { item?: any; maxQty: number }) => {
  const dispatch = useDispatch();
  const loginDetails = useSelector((state: any) => state.loginDetails);

  const handleOrderNow = () => {
    if (!item) return;
    const itemPrice = item?.price_inclusive_of_all_taxes ?? item?.multiple_uoms?.[0]?.price ?? 89;
    const cartItem = {
      id: item?.id,
      item_code: item?.item_code,
      variant_id: item?.multiple_uoms?.[0]?.variant_id || '',
      uom_id: item?.multiple_uoms?.[0]?.uom_id || '',
      name: item?.name,
      image: item?.image,
      price: itemPrice,
      price_inclusive_of_all_taxes: itemPrice,
      quantity: item?.multiple_uoms?.[0]?.minimum_quantity || 1,
      minimum_quantity: item?.multiple_uoms?.[0]?.minimum_quantity || 1,
      max_qty: item?.multiple_uoms?.[0]?.maximum_quantity || item?.max_qty || 10,
      stepper_quantity: item?.multiple_uoms?.[0]?.stepper_quantity || 1,
      combo_items: item?.combo_items ?? []
    };

    dispatch(setSubscriptionItem(cartItem));
    dispatch(setIsSubscriptionActive(true));
    dispatch(setTabType(TabTypeConstant.CART));
    dispatch(setIsSidebarOpen(true));
  };

  const handleAccountClick = () => {
    if (loginDetails.isLogin) {
      dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));
    } else {
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
    }
    dispatch(setIsSidebarOpen(true));
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 z-[100] w-full px-6 md:px-[80px] py-5 flex items-center justify-between bg-[#FCF2B7] shadow-sm">
      <div className="flex items-center mt-2">
        <Image
          src="/assets/images/neworiginlogo.png"
          alt="Origin Fresh"
          width={160}
          height={45}
          className="h-8 md:h-14 w-auto object-contain"
        />
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button
          className="bg-black text-[#FCF2B7] px-6 md:px-12 py-2 md:py-3 rounded-[10px] md:rounded-[15px] font-[800] text-[0.8rem] md:text-[1.5rem] uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors"
          style={{ fontFamily: 'SofiaPro' }}
          onClick={handleOrderNow}
        >
          ORDER NOW
        </button>

        <button
          className="bg-[#EBDD8D] hover:bg-[#DBCB7D] transition-colors rounded-full w-10 md:w-14 h-10 md:h-14 flex items-center justify-center p-2 md:p-3"
          onClick={handleAccountClick}
          aria-label="Account"
        >
          <Image src={userIcon} alt="User" width={30} height={30} />
        </button>
      </div>
    </header>
  );
};

export default SubscriptionHeader;
