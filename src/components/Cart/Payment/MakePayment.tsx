import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import razorpayIcon from '/public/assets/images/razorpay.png';
import Image from 'next/image';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { paymentTypeList } from '@/constants';

const MakePayment = (props: any) => {
  const { placeOrderHandler } = props;
  const [showCodButton, setShowCodButton] = useState(false);
  let paymentFlow = localStorage.getItem('FLOW_TYPE') ? localStorage.getItem('FLOW_TYPE') : null;

  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const cart = useSelector((state: any) => state.cart);
  const sendDataToApi = useSendDataToApi();

  let deliveryType = placeOrderDetails.delivery_type === 'INSTANT' ? 'Delivered Today within' : 'Delivering Today';
  let deliveryTime =
    placeOrderDetails.delivery_type === 'INSTANT'
      ? '30 mins'
      : `${placeOrderDetails.deliverySlotDetails.from} - ${placeOrderDetails.deliverySlotDetails.to}`;

  let isCodEnabled =
    placeOrderDetails.delivery_type === 'INSTANT'
      ? placeOrderDetails.checkoutDetails.cod_for_immediate_delivery
      : placeOrderDetails.checkoutDetails.enable_cod;
  return (
    <>
      <div className="">
        {!paymentFlow && (
          <div className="bg-[#FFEB66] border border-[#FFDD0066] rounded-b-[1.1vw] mob:rounded-[4.1vw]  m-[-1.1vw] mob:m-[-4.1vw] mob:p-[4.2vw] p-[1.19vw] mob:mb-[4vw]  mb-[2vw] flex items-center justify-between  ">
            <p className="font-[Stinger] text-[.97vw] mob:text-[3.6vw] font-semibold  text-[#231F20CC] ">
              {deliveryType}
            </p>

            <div className="flex">
              <div className="">
                <Image src={''} alt="" />
              </div>
              <p className="font-[Stinger] text-[.97vw] mob:text-[3.6vw] font-semibold  text-[#231F20CC] ">
                {deliveryTime}
              </p>
            </div>
          </div>
        )}
        <div>
          <p className="font-[Stinger] font-semibold text-[1vw] mob:text-[4vw] text-[#231F20CC] pb-[.97vw] mob:pb-[3.6vw] ">
            Payment methods
          </p>
          <div className="flex flex-col gap-[1.1vw] mob:gap-[4.1vw]">
            {paymentTypeList.map((pay: any) => (
              <div
                className={`${pay.sub_payment_method ? 'opacity-100' : `${isCodEnabled ? 'opacity-100' : 'opacity-30'}`} cursor-pointer border border-[#F2EEE44D] hover:border-primary-100 bg-[#F2EEE44D] py-[.97vw] mob:py-[3.6vw] mob:px-[4.1vw] px-[1.1vw] mob:rounded-[3.6vw] rounded-[.97vw]  `}
                key={pay.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (pay.sub_payment_method) {
                    placeOrderHandler(pay);
                  } else {
                    if (isCodEnabled) setShowCodButton(!showCodButton);
                  }
                }}
              >
                <div className="flex items-center gap-[0.4vw] mob:gap-[1vw]">
                  <div className="w-[1.8vw] h-[1.8vw] mob:w-[5vw] mob:h-[5vw]  relative ">
                    <Image src={pay.icon} alt="" />
                  </div>
                  <div>
                    <p className="font-[SofiaPro] font-semibold text-[.83vw] mob:text-[3vw] text-secondary-400 ">
                      {pay.name}
                    </p>
                    {pay.id === 4 && (
                      <p className="font-[SofiaPro] font-semibold text-[.83vw] mob:text-[3vw] text-error pt-[.2vw] mob:pt-[1vw] ">
                        Only digital cashless payments are accepted.
                      </p>
                    )}
                  </div>
                </div>
                {showCodButton && !pay.sub_payment_method && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!pay.sub_payment_method) {
                        placeOrderHandler(pay);
                      }
                    }}
                    className="font-[SofiaPro] mt-[1.1vw] mob:mt-[4.1vw]  font-semibold mob:px-[3vw] px-[.8vw] py-[.5vw] mob:py-[2vw] mob:text-[3vw] text-[.83vw] text-white bg-secondary rounded-[.8vw]"
                  >
                    Pay on delivery
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-[.4vw] mob:gap-[2vw]">
        <p className="font-[SofiaPro] text-[.7vw] mob:text-[3vw] text-[#231F20CC]  ">
          100% Secured payments powered by
        </p>
        <div className="w-[5vw] mob:w-[18vw] mob:h-[3vw] h-[.9vw] relative ">
          <Image src={razorpayIcon} alt="" />
        </div>
      </div>
    </>
  );
};

export default MakePayment;
