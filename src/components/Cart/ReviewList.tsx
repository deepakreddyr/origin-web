import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCartStore } from '@/hooks/useCartStore';
import { clearSubscriptionBoxCart } from '@/store/slice/SubscriptionBoxCartSlice';
import ReviewItem from './ReviewItem';

const ReviewList = ({ onShowMaxQuantityToast }: { onShowMaxQuantityToast: (maxQty: number) => void }) => {
  const { cart, subscriptionCart, subscriptionBoxCart, isSubscriptionBoxPage, isSubscriptionPage, actions } =
    useCartStore();
  const { validateAndCleanCart } = actions;
  const isSubscription = isSubscriptionPage && Boolean(subscriptionCart?.isSubscriptionActive);
  const isSubscriptionBox = isSubscriptionBoxPage;
  const dispatch = useDispatch();

  // ✅ VALIDATE AND CLEAN CART ON MOUNT
  useEffect(() => {
    if (!isSubscription && !isSubscriptionBox && cart.items?.length > 0) {
      dispatch(validateAndCleanCart());
    }
  }, [dispatch, isSubscription, isSubscriptionBox, cart.items?.length]);

  return (
    <div className="bg-[#F2EEE44D] flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:py-[4.1vw] px-0 mob:rounded-[4.1vw] rounded-[1.1vw]">
      <h3 className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] font-bold text-black px-[1.1vw] mob:px-[4.1vw] pb-[.97vw]">
        Review cart
      </h3>

      {isSubscriptionBox ? (
        subscriptionBoxCart?.item ? (
          <ul className="review-cart-list list-none m-0 p-0 flex flex-col gap-[0vw] w-full">
            <li className="flex items-start justify-between py-3 border-b border-[#F2EEE4] px-[1.1vw] mob:px-[4.1vw]">
              <div className="flex items-start gap-3">
                <img
                  src={subscriptionBoxCart.item.image}
                  alt={subscriptionBoxCart.item.name}
                  className="w-16 h-16 rounded-[10px] object-cover bg-white"
                />
                <div className="flex flex-col text-left">
                  <span className="font-[Recoleta] text-[15px] font-semibold text-[#132B1E]">
                    {subscriptionBoxCart.item.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="bg-[#EFE9DC] text-[#132B1E] text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {subscriptionBoxCart.item.unit} ({subscriptionBoxCart.item.weight})
                    </span>
                  </div>
                  {/* <span className="text-[#8D4320] text-[11px] font-medium mt-1">
                    {subscriptionBoxCart.item.plan_title}
                  </span> */}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-[SofiaPro] font-bold text-[15px] text-[#132B1E]">
                  ₹{subscriptionBoxCart.item.price.toLocaleString()}
                </span>
                {/* <span className="text-[#16A34A] text-[11px] font-bold mt-0.5">
                  FREE SUNDAY DELIVERY
                </span> */}
                <button
                  type="button"
                  onClick={() => dispatch(clearSubscriptionBoxCart())}
                  className="text-[#DC2626] text-[11px] font-medium mt-1.5 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Remove
                </button>
              </div>
            </li>
          </ul>
        ) : (
          <div className="px-[1.1vw] mob:px-[4.1vw] py-[2vw] mob:py-[8vw] text-center">
            <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] text-gray-500">
              Subscription box cart is empty
            </p>
          </div>
        )
      ) : isSubscription ? (
        subscriptionCart.item ? (
          <ul className="review-cart-list list-none m-0 p-0 flex flex-col gap-[0vw] w-full">
            <ReviewItem
              key={`${subscriptionCart.item.id}-subscription`}
              product={subscriptionCart.item}
              uom={{
                variant_id: subscriptionCart.item.variant_id,
                uom_id: subscriptionCart.item.uom_id,
                cart_quantity: subscriptionCart.item.quantity,
                price: subscriptionCart.item.price,
                maximum_quantity: subscriptionCart.item.max_qty,
                minimum_quantity: subscriptionCart.item.minimum_quantity,
                stepper_quantity: subscriptionCart.item.stepper_quantity,
                unit: 'Order'
              }}
              ripenessType={null}
              onShowMaxQuantityToast={onShowMaxQuantityToast}
              isFreeItem={false}
              isSubscription={true}
            />
          </ul>
        ) : (
          <div className="px-[1.1vw] mob:px-[4.1vw] py-[2vw] mob:py-[8vw] text-center">
            <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] text-gray-500">Subscription cart is empty</p>
          </div>
        )
      ) : cart.items?.length > 0 ? (
        <ul className="review-cart-list list-none m-0 p-0 flex flex-col gap-[0vw] w-full">
          {cart.items.map((product: any) =>
            product.multiple_uoms.map((uom: any) => {
              // Check if this is a free item
              const isFreeItem = product.isFreeItem || product.free || product.isFree;

              // Check if this UOM has valid ripeness types in the cart
              if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
                // Render one ReviewItem per ripeness type
                return uom.cart_ripeness
                  .map((ripeness: any) => {
                    const qty = Number(ripeness.qty);
                    if (qty > 0) {
                      return (
                        <ReviewItem
                          key={`${product.id}-${uom.variant_id}-${ripeness.ripeness_type}`}
                          product={product}
                          uom={uom}
                          ripenessType={ripeness.ripeness_type}
                          onShowMaxQuantityToast={onShowMaxQuantityToast}
                          isFreeItem={isFreeItem}
                        />
                      );
                    }
                    return null;
                  })
                  .filter(Boolean);
              } else if (uom.cart_quantity > 0 || isFreeItem) {
                // Simple item without ripeness (or free item)
                return (
                  <ReviewItem
                    key={`${product.id}-${uom.variant_id}-none`}
                    product={product}
                    uom={uom}
                    ripenessType={null}
                    onShowMaxQuantityToast={onShowMaxQuantityToast}
                    isFreeItem={isFreeItem}
                  />
                );
              }
              return null;
            })
          )}
        </ul>
      ) : (
        <div className="px-[1.1vw] mob:px-[4.1vw] py-[2vw] mob:py-[8vw] text-center">
          <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] text-gray-500">Your cart is empty</p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
