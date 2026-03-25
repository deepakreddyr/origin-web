import React from 'react';
import { useDispatch } from 'react-redux';
import { setSubscriptionItem, setIsSubscriptionActive } from '@/store/slice/SubscriptionCartSlice';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';

const SubscriptionCta = ({ item, maxQty }: { item?: any; maxQty: number }) => {
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
