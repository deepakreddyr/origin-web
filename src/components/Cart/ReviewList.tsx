import React from 'react';
import { useSelector } from 'react-redux';
import ReviewItem from './ReviewItem';

const ReviewList = () => {
  const cart = useSelector((state: any) => state.cart);
  // console.log(cart, "cart");

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
              // Check if this UOM has ripeness types
              if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
                // Render one ReviewItem per ripeness type
                return uom.cart_ripeness.map((ripeness: any) => {
                  const qty = Number(ripeness.qty);
                  if (qty > 0) {
                    return (
                      <ReviewItem
                        key={`${product.id}-${uom.variant_id}-${ripeness.ripeness_type}`}
                        product={product}
                        uom={uom}
                        ripenessType={ripeness.ripeness_type}
                      />
                    );
                  }
                  return null;
                }).filter(Boolean);
              } else if (uom.cart_quantity > 0) {
                // Simple item without ripeness
                return (
                  <ReviewItem
                    key={`${product.id}-${uom.variant_id}-none`}
                    product={product}
                    uom={uom}
                    ripenessType={null}
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