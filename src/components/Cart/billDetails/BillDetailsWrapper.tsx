import { couponDetailsInitialState } from '@/constants';
import {
  setAmountToPay,
  setCouponDetails,
  setDiscountAmount,
  setIsProceedButtonEnabled
} from '@/store/slice/CartSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BillDetailsWrapper = (props: any) => {
  const { billDetails } = props;
  const cart = useSelector((state: any) => state.cart);
  const { couponDetails } = cart;
  const dispatch = useDispatch();
  const billsList: any = [
    {
      name: 'Item total',
      value: cart.totalOriginalPrice,
      isVisible: true,
      color: 'black'
    },
    {
      name: 'Savings',
      value: cart.totalOriginalPrice - cart.totalPrice,
      isVisible: cart.totalOriginalPrice - cart.totalPrice > 0,
      color: 'green'
    },
    {
      name: 'Coupon used',
      value: cart.discountAmount,
      isVisible: Boolean(cart.discountAmount),
      color: 'green'
    },
    {
      name: 'Delivery fee',
      value: billDetails.delivery_charge,
      freeDeliveryCharge: billDetails.free_delivery_charge,
      isVisible: true,
      color: 'green'
    },
    {
      name: 'To Pay',
      value: cart.discountAmount ? cart.amountToPay : cart.totalPrice,
      isVisible: true,
      color: 'black'
    }
  ];

  useEffect(() => {
    let amountTobePaid;
    const { totalPrice, amountToPay, discountAmount } = cart;
    if (billDetails.delivery_charge > 0) {
      amountTobePaid = totalPrice + billDetails.delivery_charge;
    } else {
      amountTobePaid = totalPrice;
    }
    if (couponDetails.code && couponDetails.isValid === 1) {
      if (amountToPay < couponDetails.min_cart_value) {
        amountTobePaid = amountTobePaid + discountAmount;
        dispatch(setDiscountAmount(0));
        dispatch(setCouponDetails(couponDetailsInitialState));
        return;
      } else {
        amountTobePaid = amountTobePaid - discountAmount;
      }
    }
    dispatch(setIsProceedButtonEnabled(amountTobePaid > cart.cart_minimum));
    dispatch(setAmountToPay(amountTobePaid));
    localStorage.setItem("total_to_pay",cart.amountToPay)
  }, [couponDetails, cart, billDetails]);

  return (
    <div className=" bg-[#F2EEE44D]  flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:p-[4.1vw] mob:rounded-[4.1vw] rounded-[1.1vw]">
      <h3 className="font-[stinger] text-[1.1vw] mob:text-[4.1vw] mob:pb-[1.5vw] pb-[.6vw] font-semibold text-[#231F20CC]">
        Bill details
      </h3>
      <ul className="p-0 flex flex-col mob:gap-[1vw] gap-[.3vw]">
        <li className="p-0 first:border-b last:border-t  last:border-t-[#F2EEE4]  first:border-b-[#F2EEE4] first:pb-[.4vw]  last:pt-[.8vw] mob:last:pt-[1.6vw] mob:mt-[1vw] mob:first:mb-[1.2vw] mob:pb-[1vw] last:mt-[.4vw] first:mb-[.6vw] pb-[.3vw]">
          <div className="flex items-center text-black justify-between">
            <div>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Item total</p>
            </div>
            <div>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">₹{cart.totalOriginalPrice}</p>
            </div>
          </div>
        </li>
        {cart.totalOriginalPrice - cart.totalPrice > 0 && (
          <li className="p-0 first:border-b last:border-t  last:border-t-[#F2EEE4]  first:border-b-[#F2EEE4] first:pb-[.4vw]  last:pt-[.8vw] mob:last:pt-[1.6vw] mob:mt-[1vw] mob:first:mb-[1.2vw] mob:pb-[1vw] last:mt-[.4vw] first:mb-[.6vw] pb-[.3vw]">
            <div className="flex items-center text-secondary justify-between">
              <div>
                <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Savings</p>
              </div>
              <div>
                <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
                  ₹{cart.totalOriginalPrice - cart.totalPrice}
                </p>
              </div>
            </div>
          </li>
        )}
        {cart.discountAmount > 0 && (
          <li className="p-0 first:border-b last:border-t  last:border-t-[#F2EEE4]  first:border-b-[#F2EEE4] first:pb-[.4vw]  last:pt-[.8vw] mob:last:pt-[1.6vw] mob:mt-[1vw] mob:first:mb-[1.2vw] mob:pb-[1vw] last:mt-[.4vw] first:mb-[.6vw] pb-[.3vw]">
            <div className="flex items-center text-secondary justify-between">
              <div>
                <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Coupon used</p>
              </div>
              <div>
                <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
                  ₹{Math.round(cart.discountAmount)}
                </p>
              </div>
            </div>
          </li>
        )}
        <li className="p-0 first:border-b last:border-t  last:border-t-[#F2EEE4]  first:border-b-[#F2EEE4] first:pb-[.4vw]  last:pt-[.8vw] mob:last:pt-[1.6vw] mob:mt-[1vw] mob:first:mb-[1.2vw] mob:pb-[1vw] last:mt-[.4vw] first:mb-[.6vw] pb-[.3vw]">
          <div className="flex items-center text-secondary justify-between">
            <div>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Delivery fee</p>
            </div>
            <div>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
                {billDetails.free_delivery_charge && (
                  <span className="text-black-op-60 font-regular line-through">
                    ₹{billDetails.free_delivery_charge}
                  </span>
                )}{' '}
                {billDetails.delivery_charge === 0 ? 'FREE' : `₹${billDetails.delivery_charge}`}
              </p>
            </div>
          </div>
        </li>
        <li className="p-0 first:border-b last:border-t  last:border-t-[#F2EEE4]  first:border-b-[#F2EEE4] first:pb-[.4vw]  last:pt-[.8vw] mob:last:pt-[1.6vw] mob:mt-[1vw] mob:first:mb-[1.2vw] mob:pb-[1vw] last:mt-[.4vw] first:mb-[.6vw] pb-[.3vw]">
          <div className="flex items-center text-black justify-between">
            <div>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">To Pay</p>
            </div>
            <div>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
                {/* ₹{cart.discountAmount ? cart.amountToPay : cart.totalPrice} */}₹{cart.amountToPay}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    // <div className=" bg-[#F2EEE44D]  flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:p-[4.1vw] mob:rounded-[4.1vw] rounded-[1.1vw]">
    //   <h3 className="font-[stinger] text-[1.1vw] mob:text-[4.1vw] mob:pb-[1.5vw] pb-[.6vw] font-semibold text-[#231F20CC]">
    //     Bill details
    //   </h3>
    //   <ul className="p-0 flex flex-col mob:gap-[1vw] gap-[.3vw]">
    //     {billsList.map((item: any) => (
    //       <li className="p-0 first:border-b last:border-t  last:border-t-[#F2EEE4]  first:border-b-[#F2EEE4] first:pb-[.4vw]  last:pt-[.8vw] mob:last:pt-[1.6vw] mob:mt-[1vw] mob:first:mb-[1.2vw] mob:pb-[1vw] last:mt-[.4vw] first:mb-[.6vw] pb-[.3vw]">
    //         {item.isVisible && item.value !== 0 && (
    //           <div
    //             className={`flex items-center ${item.color === 'black' ? 'text-black' : 'text-secondary'}  justify-between`}
    //           >
    //             <div>
    //               <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">{item.name}</p>
    //             </div>
    //             <div>
    //               <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
    //                 {item.freeDeliveryCharge && (
    //                   <span className="text-black-op-60 font-regular line-through">{item.freeDeliveryCharge}</span>
    //                 )}{' '}
    //                 {item.name === 'Delivery fee' ? (item.value === 0 ? 'FREE' : `₹${item.value}`) : `₹${item.value}`}
    //               </p>
    //             </div>
    //           </div>
    //         )}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
};

export default BillDetailsWrapper;
