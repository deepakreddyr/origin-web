import React from 'react';
import { useDispatch } from 'react-redux';
import { setSubscriptionItem, setIsSubscriptionActive } from '@/store/slice/SubscriptionCartSlice';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';

const SubscriptionCta = ({ item }: { item?: any }) => {
  const dispatch = useDispatch();

  const handleOrderNow = () => {
    const cartItem = item
      ? {
          id: item.id,
          item_code: item.item_code,
          name: item.name,
          image: item.image,
          price: item.price_inclusive_of_all_taxes ?? 99,
          price_inclusive_of_all_taxes: item.price_inclusive_of_all_taxes ?? 99,
          quantity: 1,
          max_qty: item.max_qty ?? 10,
          combo_items: item.combo_items ?? []
        }
      : {
          id: 1,
          item_code: 'SUBSCRIPTION_PLAN',
          name: 'Subscription Plan',
          image: '/assets/images/neworiginlogo.png',
          price: 99,
          quantity: 1,
          max_qty: 1
        };

    dispatch(setSubscriptionItem(cartItem));
    dispatch(setIsSubscriptionActive(true));
    dispatch(setTabType(TabTypeConstant.CART));
    dispatch(setIsSidebarOpen(true));
  };

  return (
    <section className="bg-white py-20 md:py-24 min-h-[432px]">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
        <p
          className="font-[500] text-[3rem] md:text-[6rem] text-black leading-[1.2] text-center md:text-left"
          style={{ fontFamily: 'Recoleta' }}
        >
          Ready to face <br /> the challenge?
        </p>

        <button
          className="bg-[#EA8E4F] text-black font-[800] border border-[1px] border-[#221F20] text-[1.2rem] md:text-[1.5rem] mt-[8.5vw] px-10 py-5 rounded-[18px] hover:bg-[#e0752d] transition-colors uppercase"
          style={{ fontFamily: 'SofiaPro' }}
          onClick={handleOrderNow}
        >
          ORDER NOW
        </button>
      </div>
    </section>
  );
};

export default SubscriptionCta;
