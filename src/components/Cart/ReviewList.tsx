import React from 'react';
import { useSelector } from 'react-redux';
import ReviewItem from './ReviewItem';

const ReviewList = (props: any) => {
  const cart = useSelector((state: any) => state.cart);

  return (
    <div className=" bg-[#F2EEE44D] flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:py-[4.1vw] px-0 mob:rounded-[4.1vw] rounded-[1.1vw]">
      <h3 className="font-[stinger] text-[1.1vw] mob:text-[4.1vw] font-semibold text-[#231F20CC] px-[1.1vw] mob:px-[4.1vw] pb-[.97vw] ">
        Review cart
      </h3>
      <ul className="review-cart-list list-none m-0 p-0 flex flex-col gap-[0vw] w-full">
        {cart.items?.map((item: any) => <ReviewItem item={item} key={item.id} />)}
      </ul>
    </div>
  );
};

export default ReviewList;
