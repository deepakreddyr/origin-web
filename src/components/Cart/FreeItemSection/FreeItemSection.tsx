'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import LockIcon from '@mui/icons-material/Lock';
import { useCartStore } from '@/hooks/useCartStore';

const FreeItemSection = ({ onShowToast }: { onShowToast: (message: string) => void }) => {
  const { cart, actions } = useCartStore();
  const { addFreeItemToCart, removeFreeItemFromCart } = actions;
  const dispatch = useDispatch();

  const freeItems = cart.freeItems || [];
  const freeItemsMov = cart.freeItemsMov || 0;
  const cartTotal = cart.totalPrice || 0;
  const couponDetails = cart.couponDetails;

  // Don't render if no free items available
  if (!freeItems || freeItems.length === 0) {
    return null;
  }

  // Check if cart meets MOV requirement
  const isUnlocked = cartTotal >= freeItemsMov;
  const amountRemaining = Math.max(0, freeItemsMov - cartTotal);

  // Calculate progress percentage
  const progressPercentage = Math.min(100, (cartTotal / freeItemsMov) * 100);

  // Check which free item (if any) is currently in the cart
  const addedFreeItem = cart.items.find((item: any) => item.isFreeItem || item.free || item.isFree);

  const handleAddFreeItem = (item: any) => {
    if (couponDetails && couponDetails.id) {
      onShowToast('Free item cannot be added when the coupon is added');
      return;
    }

    if (isUnlocked) {
      // If a different free item is already in the cart, remove it first
      if (addedFreeItem && addedFreeItem.item_code !== item.item_code) {
        dispatch(removeFreeItemFromCart(addedFreeItem.item_code));
      }
      dispatch(addFreeItemToCart(item));
    }
  };

  const handleRemoveFreeItem = (itemCode: string) => {
    dispatch(removeFreeItemFromCart(itemCode));
  };

  return (
    <div className="bg-[#F2EEE44D] flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:p-[4.1vw] mob:rounded-[4.1vw] rounded-[1.1vw] overflow-hidden">
      <h3 className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] font-bold text-black pb-[.97vw] mob:pb-[3vw]">
        Best deal on your cart
      </h3>

      {/* Horizontally Scrollable Free Items Wrapper */}
      <div className="flex gap-[.8vw] mob:gap-[3vw] overflow-x-auto pb-[.5vw] no-scrollbar snap-x snap-mandatory">
        {freeItems.map((item: any) => {
          const uom = item?.multiple_uoms?.[0] || item?.uom?.[0];
          if (!uom) return null;

          const isCurrentlyAdded = addedFreeItem?.item_code === item.item_code;

          return (
            <div
              key={item.id}
              className={`flex-shrink-0 ${freeItems.length === 1 ? 'w-full' : 'w-[80%] mob:w-[70vw]'} snap-center border-2  border-primary rounded-[1vw] mob:rounded-[3vw] p-[1vw] mob:p-[3vw] transition-all duration-300 bg-[#F2EEE44D]`}
            >
              <div className="flex items-center justify-between gap-[1vw] mob:gap-[3vw]">
                {/* Product Image & Info */}
                <div className="flex items-center gap-[.8vw] mob:gap-[3vw]">
                  <figure className="w-[4vw] h-[4vw] mob:w-[15vw] mob:h-[15vw] rounded-lg bg-[#F2EEE4] flex-shrink-0 m-0 p-1 overflow-hidden relative">
                    <img
                      src={item.image || item.logo || '/public/assets/images/shop/sampleimg2.png'}
                      alt={item.name || item.item_name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </figure>

                  <div className="flex flex-col">
                    <p className="font-[SofiaPro] text-[.9vw] mob:text-[3.6vw] font-semibold text-[#231F20] line-clamp-2 max-w-[12vw] mob:max-w-[40vw]">
                      {item.name || item.item_name}
                    </p>
                    <span className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-black/60">{uom.unit}</span>
                    <div className="flex items-center gap-[.5vw] mob:gap-[2vw] mt-[.2vw] mob:mt-[.5vw]">
                      {/* <span className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-[#BFBFBF] line-through">
                        ₹{uom.price || uom.market_price}
                      </span> */}
                      <span className="font-[SofiaPro] text-[.7vw] mob:text-[2.5vw] font-semibold text-black bg-[#fac510] px-[.4vw] mob:px-[1.5vw] py-[.1vw] mob:py-[.5vw] rounded-md">
                        Free
                      </span>
                    </div>
                  </div>
                </div>

                {/* ADD/REMOVE Button */}
                <button
                  onClick={() => (isCurrentlyAdded ? handleRemoveFreeItem(item.item_code) : handleAddFreeItem(item))}
                  disabled={!isUnlocked && !isCurrentlyAdded}
                  className={`px-[1.2vw] mob:px-[3.5vw] py-[.5vw] mob:py-[2vw] rounded-full font-[SofiaPro] font-semibold text-[.83vw] mob:text-[3vw] flex items-center justify-center min-w-[6vw] mob:min-w-[20vw] transition-all duration-200 ${
                    isCurrentlyAdded
                      ? 'bg-white border border-[#231F20] text-[#231F20]'
                      : isUnlocked
                        ? 'bg-[#fac510] border border-[#fac510] text-black hover:opacity-90 active:scale-95'
                        : 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isCurrentlyAdded ? 'REMOVE' : 'ADD'}
                </button>
              </div>

              {/* Per-card Progress Bar */}
              <div className="mt-[.8vw] mob:mt-[2.5vw]">
                <div className="h-[.3vw] mob:h-[1vw] bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#fac510] transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Per-card Status Message */}
              <div className="mt-[.5vw] mob:mt-[2vw] flex items-center gap-[.4vw] mob:gap-[1.5vw]">
                {isUnlocked || addedFreeItem ? (
                  <>
                    {/* <span className="text-[1vw] mob:text-[4vw]">🎉 </span> */}
                    {isCurrentlyAdded ? (
                      <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-[#231F20]">
                        <span className="text-[1vw] mob:text-[4vw]">🎉 </span>
                        You've added a <span className="font-bold">FREE</span> item!
                      </p>
                    ) : addedFreeItem ? (
                      <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-red-500">
                        You can add only 1 <span className="font-bold">FREE</span> item.
                      </p>
                    ) : (
                      <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-[#231F20]">
                        <span className="text-[1vw] mob:text-[4vw]">🎉 </span>
                        You've unlocked a <span className="font-bold">FREE</span> item!
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <LockIcon sx={{ fontSize: '1vw', color: '#6B7280' }} className="mob:!text-[4vw]" />
                    <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-black">
                      Add <span className="font-bold">₹{amountRemaining}</span> more to get a{' '}
                      <span className="font-bold">FREE</span> item
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FreeItemSection;
