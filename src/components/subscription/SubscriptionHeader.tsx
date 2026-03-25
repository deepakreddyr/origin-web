import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setSubscriptionItem, setIsSubscriptionActive } from '@/store/slice/SubscriptionCartSlice';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';

const SubscriptionHeader = ({ item, maxQty }: { item?: any; maxQty: number }) => {
  const dispatch = useDispatch();

  const handleOrderNow = () => {
    const itemPrice = item?.price_inclusive_of_all_taxes ?? item?.multiple_uoms?.[0]?.price ?? 89;
    const cartItem = item
      ? {
          id: item.id,
          item_code: item.item_code,
          variant_id: item?.multiple_uoms?.[0]?.variant_id || '',
          uom_id: item?.multiple_uoms?.[0]?.uom_id || '',
          name: item.name,
          image: item.image,
          price: itemPrice,
          price_inclusive_of_all_taxes: itemPrice,
          quantity: item?.multiple_uoms?.[0]?.minimum_quantity || 1,
          minimum_quantity: item?.multiple_uoms?.[0]?.minimum_quantity || 1,
          max_qty: item?.multiple_uoms?.[0]?.maximum_quantity || item.max_qty || 10,
          stepper_quantity: item?.multiple_uoms?.[0]?.stepper_quantity || 1,
          combo_items: item.combo_items ?? []
        }
      : {
          id: 1,
          variant_id: 1,
          uom_id: 1,
          item_code: 'SUBSCRIPTION_PLAN',
          name: 'Subscription Plan',
          image: '/assets/images/neworiginlogo.png',
          price: 89,
          quantity: 1,
          minimum_quantity: 1,
          max_qty: 10,
          stepper_quantity: 1
        };

    dispatch(setSubscriptionItem(cartItem));
    dispatch(setIsSubscriptionActive(true));
    dispatch(setTabType(TabTypeConstant.CART));
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
    <header className="fixed top-0 left-0 z-[100] w-full px-6 md:px-[56px] py-5 flex items-center justify-between bg-[#FCF2B7] shadow-sm">
      <div className="flex items-center">
        <Image
          src="/assets/images/neworiginlogo.png"
          alt="Origin Fresh"
          width={160}
          height={45}
          className="h-8 md:h-10 w-auto object-contain"
        />
      </div>

      <button
        className="bg-black text-[#FCF2B7] px-6 md:px-8 py-2 md:py-2.5 rounded-[10px] font-[800] text-[0.8rem] md:text-[0.95rem] uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors"
        style={{ fontFamily: 'SofiaPro' }}
        onClick={handleOrderNow}
      >
        ORDER NOW
      </button>
    </header>
  );
};

export default SubscriptionHeader;
