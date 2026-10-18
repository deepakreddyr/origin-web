import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MOCK_SUBSCRIPTION_ITEM, SubscriptionItemData, SubscriptionUOM } from './mockSubscriptionData';
import { setSubscriptionBoxItem } from '@/store/slice/SubscriptionBoxCartSlice';
import { setLoginDetails } from '@/store/slice/loginSlice';
import { setCartTabType } from '@/store/slice/CartSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';

interface SubscriptionBuyBoxProps {
  itemData: SubscriptionItemData;
  onSelectUom?: (uom: SubscriptionUOM) => void;
  className?: string;
}

const SubscriptionBuyBox: React.FC<SubscriptionBuyBoxProps> = ({ itemData, onSelectUom, className = '' }) => {
  const dispatch = useDispatch();

  // State: Plan type ('monthly' vs 'trial')
  const [selectedPlanType, setSelectedPlanType] = useState<'monthly' | 'trial'>('monthly');

  // State: Portion size index (matches multiple_uoms: 0 = Family 2, 1 = Family 3, 2 = Family 4)
  const [selectedUomIndex, setSelectedUomIndex] = useState<number>(0);

  const selectedUom =
    itemData.multiple_uoms?.[selectedUomIndex] ||
    itemData.multiple_uoms?.[0] ||
    MOCK_SUBSCRIPTION_ITEM.multiple_uoms[0];

  // Resolve price based on plan type and portion size
  const isMonthly = selectedPlanType === 'monthly';
  const currentPrice = isMonthly ? (selectedUom?.price ?? 0) : (selectedUom?.single_price ?? selectedUom?.price ?? 0);
  const originalPrice = isMonthly
    ? selectedUom?.market_price || selectedUom?.original_price || (selectedUom?.price ? selectedUom.price * 1.15 : null)
    : null;
  const perDelivery = selectedUom?.per_delivery ?? Math.round(currentPrice / 4);

  const handlePortionSelect = (index: number) => {
    setSelectedUomIndex(index);
    if (onSelectUom && itemData.multiple_uoms?.[index]) {
      onSelectUom(itemData.multiple_uoms[index]);
    }
  };

  const handleSubscribeClick = () => {
    // 1. Package Subscription Box item payload
    const payload = {
      id: itemData.id,
      item_code: itemData.item_code,
      name: itemData.display_title || itemData.name,
      image: itemData.image,
      variant_id: selectedUom?.variant_id || 0,
      uom_id: selectedUom?.uom_id || 0,
      unit: selectedUom?.unit || '',
      weight: selectedUom?.weight || '',
      plan_type: selectedPlanType,
      plan_title: isMonthly
        ? `${itemData.subscription_details?.title || 'Monthly Crate'} (${itemData.subscription_details?.description || '4 Sunday Deliveries'})`
        : `${itemData.single_trail?.title || 'Single Trial'} (${itemData.single_trail?.description || 'One-off 1 Sunday'})`,
      price: currentPrice,
      single_price: selectedUom?.single_price ?? currentPrice,
      per_delivery: perDelivery,
      quantity: 1,
      harvest_items: selectedUom?.harvest_items || []
    };

    // 2. Dispatch to dedicated SubscriptionBoxCartSlice
    dispatch(setSubscriptionBoxItem(payload));

    // 3. Open Cart Drawer
    dispatch(
      setLoginDetails({
        isSidebarOpen: true,
        tabType: TabTypeConstant.CART
      })
    );
    dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
  };

  return (
    <div
      className={`w-full lg:w-[480px] xl:w-[528.75px] shrink-0 bg-white rounded-[18px] p-5 sm:p-6 lg:p-[27px] flex flex-col gap-[18px] shadow-[0px_2px_14px_rgba(0,0,0,0.04)] border border-[#EBE8E0] text-left ${className}`}
    >
      {/* Top Tag & Ratings */}
      <div className="flex items-center justify-between w-full">
        {/* Community Favorite Tag */}
        <span
          className="bg-[#FDF0E9] text-[#C25E2E] text-[10.5px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
          style={{ fontFamily: 'SofiaPro' }}
        >
          {itemData.tags?.[0] || 'COMMUNITY FAVORITE • BEST VALUE'}
        </span>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-[13px] text-[#132B1E]" style={{ fontFamily: 'SofiaPro' }}>
          <span className="text-[#C25E2E] font-bold">★ {itemData.ratings?.average_ratings || 4.94}</span>
          <span className="text-[#7A837A]">({itemData.ratings?.review_count || 318} reviews)</span>
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h1
          className="text-[#132B1E] font-semibold text-[34px] sm:text-[38px] leading-[1.12] mb-2"
          style={{ fontFamily: 'Recoleta' }}
        >
          {itemData.display_title || itemData.name}
        </h1>
        <p className="text-[#556057] text-[14.5px] leading-[22px]" style={{ fontFamily: 'SofiaPro' }}>
          {itemData.item_description}
        </p>
      </div>

      {/* Select Plan Type */}
      <div>
        <span
          className="text-[#7A837A] uppercase font-bold text-[10.5px] tracking-[0.1em] block mb-2"
          style={{ fontFamily: 'SofiaPro' }}
        >
          SELECT PLAN TYPE
        </span>
        <div className="grid grid-cols-2 gap-3">
          {/* Option 1: Monthly Crate */}
          <button
            type="button"
            onClick={() => setSelectedPlanType('monthly')}
            className={`p-3.5 rounded-[14px] text-left transition-all cursor-pointer relative border ${
              isMonthly
                ? 'bg-white border-2 border-[#C25E2E] shadow-xs'
                : 'bg-[#F9F7F2] border-[#E8E4DA] hover:bg-white'
            }`}
          >
            {itemData.subscription_details?.discount_label && (
              <span
                className="absolute top-2.5 right-2.5 bg-[#EA5824] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] uppercase tracking-wider"
                style={{ fontFamily: 'SofiaPro' }}
              >
                {itemData.subscription_details.discount_label}
              </span>
            )}
            <span className="text-[#132B1E] font-bold text-[14.5px] block mb-0.5" style={{ fontFamily: 'SofiaPro' }}>
              {itemData.subscription_details?.title || 'Monthly Crate'}
            </span>
            <span className="text-[#7A837A] text-[12px] block" style={{ fontFamily: 'SofiaPro' }}>
              {itemData.subscription_details?.description || '4 Sunday Deliveries'}
            </span>
          </button>

          {/* Option 2: Single Trial */}
          <button
            type="button"
            onClick={() => setSelectedPlanType('trial')}
            className={`p-3.5 rounded-[14px] text-left transition-all cursor-pointer border ${
              !isMonthly
                ? 'bg-white border-2 border-[#C25E2E] shadow-xs'
                : 'bg-[#F9F7F2] border-[#E8E4DA] hover:bg-white'
            }`}
          >
            <span className="text-[#132B1E] font-bold text-[14.5px] block mb-0.5" style={{ fontFamily: 'SofiaPro' }}>
              {itemData.single_trail?.title || 'Single Trial'}
            </span>
            <span className="text-[#7A837A] text-[12px] block" style={{ fontFamily: 'SofiaPro' }}>
              {itemData.single_trail?.description || 'One-off 1 Sunday'}
            </span>
          </button>
        </div>
      </div>

      {/* Portion Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[#7A837A] uppercase font-bold text-[10.5px] tracking-[0.1em]"
            style={{ fontFamily: 'SofiaPro' }}
          >
            PORTION SIZE
          </span>
          <span className="text-[#C25E2E] font-medium text-[12px]" style={{ fontFamily: 'SofiaPro' }}>
            Yields ~{selectedUom?.weight || '3.2 kg'} / week
          </span>
        </div>

        {/* Portion Buttons */}
        <div className="flex items-center gap-2">
          {(itemData.multiple_uoms || []).map((uom, idx) => {
            const isSelected = selectedUomIndex === idx;
            const isFamily2 = uom.unit ? uom.unit.includes('2') : idx === 0;
            const isFamily3 = uom.unit ? uom.unit.includes('3') : idx === 1;
            const isFamily4 = uom.unit ? uom.unit.includes('4') : idx === 2;

            const numLabel = isFamily2 ? '2' : isFamily3 ? '3' : '4–6';
            const textLabel = isFamily2 ? 'Ideal couple' : isFamily3 ? 'small family' : 'Persons';

            return (
              <button
                key={uom.variant_id}
                type="button"
                onClick={() => handlePortionSelect(idx)}
                className={`flex-1 py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#132B1E] text-white border-[#132B1E] shadow-sm'
                    : 'bg-[#F4F1EA] text-[#132B1E] border-transparent hover:bg-[#EBE7DE]'
                }`}
                style={{ fontFamily: 'SofiaPro' }}
              >
                <span className="font-bold text-[13px]">{numLabel}</span>
                <span className={`text-[12px] ${isSelected ? 'text-white/80' : 'text-[#7A837A]'}`}>{textLabel}</span>
                {isFamily3 && <span className="text-[12px] leading-none">🧺</span>}
                {isFamily4 && (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    className={isSelected ? 'text-white/80' : 'text-[#7A837A]'}
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Delivery Slot Banner */}
      <div className="bg-[#FAF5EC] border border-[#F2E8D2] rounded-[14px] p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#FAC510] text-[#132B1E] flex items-center justify-center flex-shrink-0 shadow-xs">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[#132B1E] font-bold text-[12.5px] leading-tight" style={{ fontFamily: 'SofiaPro' }}>
            Sunday Morning Delivery Slot
          </span>
          <span className="text-[#7A837A] text-[11.5px] leading-tight mt-0.5" style={{ fontFamily: 'SofiaPro' }}>
            Arrives between 6:30 AM – 10:30 AM in chilled box.
          </span>
        </div>
      </div>

      {/* Price & Delivery Note */}
      <div className="bg-[#FAF8F3] rounded-[16px] p-4 flex items-center justify-between border border-[#F0EBE0]/60">
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-2">
            <span
              className="text-[#132B1E] font-bold text-[34px] sm:text-[36px] leading-none"
              style={{ fontFamily: 'SofiaPro' }}
            >
              ₹{currentPrice.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-[#9BA39B] line-through text-[16px]" style={{ fontFamily: 'SofiaPro' }}>
                ₹{Math.round(originalPrice).toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[#C25E2E] text-[12px] font-medium mt-1.5" style={{ fontFamily: 'SofiaPro' }}>
            {isMonthly
              ? `Includes 4 weekly dispatches (₹${perDelivery.toLocaleString()} / delivery)`
              : 'One-off Sunday harvest dispatch'}
          </span>
        </div>

        {/* Free Crate Delivery Tag */}
        <div className="bg-[#C6F6D5] text-[#1E3F2F] text-[10px] font-bold px-2.5 py-1.5 rounded-[6px] uppercase tracking-wider text-center leading-tight">
          FREE CRATE <br /> DELIVERY
        </div>
      </div>

      {/* Main Subscribe Button */}
      <div className="flex flex-col gap-2 items-center w-full">
        <button
          type="button"
          onClick={handleSubscribeClick}
          className="w-full h-[52px] rounded-full bg-[#FAC510] hover:bg-[#E5B40E] active:scale-[0.99] text-[#132B1E] font-bold text-[15px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          style={{ fontFamily: 'SofiaPro' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>
            Subscribe Basket — ₹{currentPrice.toLocaleString()} {isMonthly ? '/ Month' : '/ Sunday'}
          </span>
        </button>

        {/* Freshness Refund Tag */}
        <div className="flex items-center gap-1.5 text-[11.5px] text-[#7A837A]" style={{ fontFamily: 'SofiaPro' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          <span>100% Freshness refund</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBuyBox;
