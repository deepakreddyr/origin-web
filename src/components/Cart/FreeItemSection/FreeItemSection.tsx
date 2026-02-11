'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFreeItemToCart, removeFreeItemFromCart } from '@/store/slice/CartSlice';
import LockIcon from '@mui/icons-material/Lock';

const FreeItemSection = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart);

  const freeItems = cart.freeItems || [];
  const freeItemsMov = cart.freeItemsMov || 0;
  const cartTotal = cart.totalPrice || 0;

  // Don't render if no free items available
  if (!freeItems || freeItems.length === 0) {
    return null;
  }

  const freeItem = freeItems[0]; // Display first free item
  const uom = freeItem?.multiple_uoms?.[0] || freeItem?.uom?.[0];

  if (!freeItem || !uom) {
    return null;
  }

  // Check if cart meets MOV requirement
  const isUnlocked = cartTotal >= freeItemsMov;
  const amountRemaining = Math.max(0, freeItemsMov - cartTotal);

  // Calculate progress percentage
  const progressPercentage = Math.min(100, (cartTotal / freeItemsMov) * 100);

  // Check if free item is already added to cart
  const isFreeItemAdded = cart.items.some((item: any) => item.isFreeItem && item.item_code === freeItem.item_code);

  const handleAddFreeItem = () => {
    if (isUnlocked && !isFreeItemAdded) {
      dispatch(addFreeItemToCart(freeItem));
    }
  };

  const handleRemoveFreeItem = () => {
    dispatch(removeFreeItemFromCart(freeItem.item_code));
  };

  // Get quantity to display (1 if cart_quantity is 0, else actual value)
  const displayQuantity = uom.cart_quantity > 0 ? uom.cart_quantity : 1;

  return (
    <div className="bg-[#F2EEE44D] flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:p-[4.1vw] mob:rounded-[4.1vw] rounded-[1.1vw]">
      <h3 className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] font-bold text-[#231F20CC] pb-[.97vw] mob:pb-[3vw]">
        Best deal on your cart
      </h3>

      {/* Free Item Card */}
      <div
        className="relative border-2 rounded-[1vw] mob:rounded-[3vw] p-[1vw] mob:p-[3vw] overflow-hidden"
        style={{ borderColor: isUnlocked ? '#fac510' : '#E5E7EB' }}
      >
        <div className="flex items-center justify-between gap-[1vw] mob:gap-[3vw]">
          {/* Product Image & Info */}
          <div className="flex items-center gap-[.8vw] mob:gap-[3vw]">
            <figure className="w-[4vw] h-[4vw] mob:w-[15vw] mob:h-[15vw] rounded-lg bg-[#F2EEE4] flex-shrink-0 m-0 p-1 overflow-hidden relative">
              <img
                src={freeItem.image || freeItem.logo || '/public/assets/images/shop/sampleimg2.png'}
                alt={freeItem.name || freeItem.item_name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              {/* Free Badge */}
              <div className="absolute bottom-0 left-0 bg-[#fac510] text-black text-[.6vw] mob:text-[2.5vw] font-semibold px-[.4vw] mob:px-[1.5vw] py-[.1vw] mob:py-[.5vw] rounded-tr-md">
                Free
              </div>
            </figure>

            <div className="flex flex-col">
              <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold text-[#231F20]">
                {freeItem.name || freeItem.item_name}
              </p>
              <span className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-black/60">{uom.unit}</span>
            </div>
          </div>

          {/* ADD/REMOVE Button */}
          <button
            onClick={isFreeItemAdded ? handleRemoveFreeItem : handleAddFreeItem}
            disabled={!isUnlocked && !isFreeItemAdded}
            className={`px-[1.5vw] mob:px-[5vw] py-[.5vw] mob:py-[2vw] rounded-full font-[SofiaPro] font-semibold text-[.83vw] mob:text-[3vw] transition-all ${
              isFreeItemAdded
                ? 'bg-white border border-[#231F20] text-[#231F20]'
                : isUnlocked
                  ? 'bg-[#fac510] border border-[#fac510] text-black hover:opacity-90'
                  : 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isFreeItemAdded ? 'REMOVE' : 'ADD'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-[1vw] mob:mt-[3vw] h-[.3vw] mob:h-[1vw] bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#fac510] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Status Message */}
        <div className="mt-[.8vw] mob:mt-[2.5vw] flex items-center gap-[.4vw] mob:gap-[1.5vw]">
          {isUnlocked || isFreeItemAdded ? (
            <>
              <span className="text-[1vw] mob:text-[4vw]">🎉</span>
              <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-[#231F20]">
                You've unlocked a <span className="font-bold">FREE</span> item!
              </p>
            </>
          ) : (
            <>
              <LockIcon sx={{ fontSize: '1vw', color: '#6B7280' }} className="mob:!text-[4vw]" />
              <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-[#6B7280]">
                Add <span className="font-bold">₹{amountRemaining}</span> more to get a{' '}
                <span className="font-bold">FREE</span> item
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeItemSection;
