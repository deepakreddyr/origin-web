import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // <-- ADDED useDispatch
import ReviewItem from './ReviewItem';
import { validateCart } from '@/store/slice/CartSlice'; // <-- Import the cleaning action

// UPDATED ReviewList PROPS: Added onShowMaxQuantityToast
const ReviewList = ({ onShowMaxQuantityToast }: { onShowMaxQuantityToast: (maxQty: number) => void }) => {
  const cart = useSelector((state: any) => state.cart);
  const dispatch = useDispatch(); // <-- Initialize dispatch
  
  console.log(cart,"cart state");

  // 🛑 IMPLEMENTATION FOR STATE CLEANUP ON MOUNT
  // This hook ensures that every time the cart component loads, the Redux store is 
  // validated against the current availability data contained in the state, 
  // permanently removing items that are no longer available.
  useEffect(() => {
    // Assuming the cart state (`cart.items`) already contains the latest 
    // `ripeness_types` from the API after hydration or a fetch.
    dispatch(validateCart());
  }, [dispatch]);
  // ----------------------------------------------

  return (
    <div className="bg-[#F2EEE44D] flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:py-[4.1vw] px-0 mob:rounded-[4.1vw] rounded-[1.1vw]">
      <h3 className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] font-semibold text-[#231F20CC] px-[1.1vw] mob:px-[4.1vw] pb-[.97vw]">
        Review cart
      </h3>
      
      {cart.items?.length > 0 ? (
        <ul className="review-cart-list list-none m-0 p-0 flex flex-col gap-[0vw] w-full">
          {cart.items.map((product: any) => (
            // Iterate through each product's UOMs
            product.multiple_uoms.map((uom: any) => {
              
              // --- 🛑 CORE VALIDATION LOGIC (Display-Side) 🛑 ---
              // NOTE: This logic is now redundant if `validateCart()` works, 
              // but it's a good safety filter for immediate display before the Redux update completes.
              let cartRipenessToRender = [];
              const availableRipenessTypes = Array.isArray(uom.ripeness_types) ? uom.ripeness_types : [];

              if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
                // Filter the items in cart (cart_ripeness) against the items currently available (ripeness_types)
                cartRipenessToRender = uom.cart_ripeness.filter((ripeness: any) => 
                  availableRipenessTypes.includes(ripeness.ripeness_type)
                );
              }
              // --- END CORE VALIDATION LOGIC ---


              // Check if this UOM has valid, available ripeness types in the cart
              if (cartRipenessToRender.length > 0) {
                // Render one ReviewItem per VALID ripeness type
                return cartRipenessToRender.map((ripeness: any) => {
                  const qty = Number(ripeness.qty);
                  if (qty > 0) {
                    return (
                      <ReviewItem
                        key={`${product.id}-${uom.variant_id}-${ripeness.ripeness_type}`}
                        product={product}
                        uom={uom}
                        ripenessType={ripeness.ripeness_type}
                        onShowMaxQuantityToast={onShowMaxQuantityToast} // PASSED DOWN
                      />
                    );
                  }
                  return null;
                }).filter(Boolean);
              } else if (!uom.cart_ripeness && uom.cart_quantity > 0) { 
                // Simple item without ripeness (or if all ripeness types were filtered out and cart_quantity > 0)
                // This branch handles simple, non-ripeness items.
                return (
                  <ReviewItem
                    key={`${product.id}-${uom.variant_id}-none`}
                    product={product}
                    uom={uom}
                    ripenessType={null}
                    onShowMaxQuantityToast={onShowMaxQuantityToast} // PASSED DOWN
                  />
                );
              }
              return null;
            })
          ))}
        </ul>
      ) : (
        <div className="px-[1.1vw] mob:px-[4.1vw] py-[2vw] mob:py-[8vw] text-center">
          <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] text-gray-500">
            Your cart is empty
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;