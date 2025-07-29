import React from 'react';
import AddItemBtn from '../shared/AddItemBtn/AddItemBtn';
import Image from 'next/image';
import deleteIcon from '/public/assets/icons/deleteIcon.png';
import { removeItemFromCart } from '@/store/slice/CartSlice';
import { useDispatch, useSelector } from 'react-redux';

const ReviewItem = (props: any) => {
  const { item: product } = props;
  const calculateItemTotalPrice = (price: any, quantity: any) => {
    return price * quantity;
  };
  const dispatch = useDispatch();
  return (
    <div className="">
      {product.multiple_uoms.map((uom: any) => (
        <li
          key={uom.id}
          style={{
            background:
              uom.cart_quantity > uom.maximum_quantity
                ? 'linear-gradient(89.43deg, rgba(208, 88, 63, 0.2) 0.49%, rgba(255, 255, 255, 0) 99.51%)'
                : ''
          }}
          className="review-cart-list mob:pl-[4.1vw] mob:py-[3vw] px-[1.1vw] py-[.6vw] w-full"
        >
          <div className="flex items-center gap-[.78vw] grow mob:gap-[3vw] justify-between">
            <div className="review-cart-info flex gap-3 items-center mob:w-[60vw] grow ">
              <figure className="w-[4vw] h-[4vw] mob:w-[15vw] mob:h-[15vw] rounded-lg bg-[#F2EEE4] flex-shrink-0 m-0 p-1 overflow-hidden">
                <img
                  // className={styles.img}
                  src={product.logo}
                  alt="image"
                  style={{ width: '100%', height: '100%' }}
                />
              </figure>
              <div className="review-cart-information flex flex-col">
                <h4 className="font-[sofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold">{product?.name}</h4>
                <span className="text-black/60 text-[.83vw]  mob:text-[3vw] font-[sofiaPro]">{`${uom.unit} `}</span>
              </div>
            </div>
            {uom.is_available ? (
              <div className="flex gap-3  items-center">
                <div className="w-[5.6vw] mob:w-[21vw]">
                  <AddItemBtn
                    product={product}
                    varientId={uom.variant_id}
                    varientPrice={uom.price}
                    stepperQuantity={uom.stepper_quantity}
                    buttonType="white"
                  />
                </div>
                <div className="review-cart-counter flex flex-col items-center w-[2vw] mob:w-[12vw] ">
                  {uom.market_price && (
                    <span className="font-[sofiaPro] text-[.78vw] mob:text-[2.8vw] line-through text-[#231F2099]">
                      ₹{calculateItemTotalPrice(uom.market_price, uom.cart_quantity)}
                    </span>
                  )}
                  <span className="font-[sofiaPro] text-[.83vw] mob:text-[3.3vw]">
                    ₹{calculateItemTotalPrice(uom.price, uom.cart_quantity)}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  dispatch(removeItemFromCart(uom.variant_id));
                }}
                className="flex  items-center"
              >
                <p className="font-[SofiaPro] font-semibold text-[.83vw] mob:text-[3.3vw] text-[#C70000] whitespace-nowrap ">
                  OUT OF STOCK
                </p>
                <div className="relative w-[2.5vw] h-[2.5vw] mob:w-[6vw] mob:h-[6vw] ">
                  <Image src={deleteIcon} alt="delete icon" />
                </div>
              </button>
            )}
          </div>
          {uom.maximum_quantity > 1 && uom.cart_quantity > uom.maximum_quantity && (
            <div>
              <p className="font-[SofiaPro] text-[.83vw] mt-[.4vw] font-medium text-semibold text-danger ">
                Maximum available <span className="font-semibold">{uom.maximum_quantity}</span> . Please change the Quantity.{' '}
              </p>
            </div>
          )}
        </li>
      ))}{' '}
    </div>
  );
};

export default ReviewItem;
