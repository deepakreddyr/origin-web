import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import razorpayIcon from '/public/assets/images/razorpay.png';
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { paymentTypeList } from '@/constants';

const MakePayment = (props: any) => {
  const { placeOrderHandler } = props;
  const [showCodButton, setShowCodButton] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingPaymentId, setProcessingPaymentId] = useState(null);
  
  // Ref to track if payment is in progress (survives re-renders better than state)
  const isProcessingRef = useRef(false);

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

  // Helper function to handle payment processing
  const handlePaymentProcessing = async (paymentMethod: any) => {
    // Prevent duplicate clicks
    if (isProcessingRef.current) {
      return;
    }

    try {
      isProcessingRef.current = true;
      setProcessing(true);
      setProcessingPaymentId(paymentMethod.id);
      
      await placeOrderHandler(paymentMethod);
      
    } catch (error) {
      console.error('Payment processing failed:', error);
    } finally {
      setProcessing(false);
      setProcessingPaymentId(null);
      isProcessingRef.current = false;
      
      // Reset COD button visibility if it was a COD payment that failed
      if (!paymentMethod.sub_payment_method) {
        setShowCodButton(false);
      }
    }
  };

  return (
    <>
      <div className="">
        {!paymentFlow && (
          <div className="bg-[#FFEB66] border border-[#FFDD0066] rounded-b-[1.1vw] mob:rounded-[4.1vw]  m-[-1.1vw] mob:m-[-4.1vw] mob:p-[4.2vw] p-[1.19vw] mob:mb-[4vw]  mb-[2vw] flex items-center justify-between  ">
            <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold  text-[#231F20CC] ">
              {deliveryType}
            </p>

            <div className="flex">
              <div className="">
                <Image src={''} alt="" />
              </div>
              <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold  text-[#231F20CC] ">
                {deliveryTime}
              </p>
            </div>
          </div>
        )}
        <div>
          <p className="font-[SofiaPro] font-semibold text-[1vw] mob:text-[4vw] text-[#231F20CC] pb-[.97vw] mob:pb-[3.6vw] ">
            Payment methods
          </p>
          <div className="flex flex-col gap-[1.1vw] mob:gap-[4.1vw]">
            {paymentTypeList.map((pay: any) => (
              <div
                className={`${pay.sub_payment_method ? 'opacity-100' : `${isCodEnabled ? 'opacity-100' : 'opacity-30'}`} ${
                  processing && processingPaymentId !== pay.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } border border-[#F2EEE44D] hover:border-primary-100 bg-[#F2EEE44D] py-[.97vw] mob:py-[3.6vw] mob:px-[4.1vw] px-[1.1vw] mob:rounded-[3.6vw] rounded-[.97vw]`}
                key={pay.id}
                onClick={async (e) => {
                  e.stopPropagation();
                  
                  // Prevent clicks if processing or if this specific payment method is disabled
                  if (processing || isProcessingRef.current || (!pay.sub_payment_method && !isCodEnabled)) {
                    return;
                  }

                  // Handle online payment methods (with sub_payment_method)
                  if (pay.sub_payment_method) {
                    await handlePaymentProcessing(pay);
                  } else {
                    // Handle COD - just toggle the button visibility
                    if (isCodEnabled) {
                      setShowCodButton(!showCodButton);
                    }
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
                      {processing && processingPaymentId === pay.id && " (Processing...)"}
                    </p>
                    {pay.id === 4 && (
                      <p className="font-[SofiaPro] font-semibold text-[.83vw] mob:text-[3vw] text-error pt-[.2vw] mob:pt-[1vw] ">
                        Only digital cashless payments are accepted at your door-step.
                      </p>
                    )}
                  </div>
                </div>

                {showCodButton && !pay.sub_payment_method && isCodEnabled && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (processing || isProcessingRef.current) {
                        return;
                      }

                      await handlePaymentProcessing(pay);
                    }}
                    disabled={processing || isProcessingRef.current}
                    className={`font-[SofiaPro] mt-[1.1vw] mob:mt-[4.1vw] font-semibold mob:px-[3vw] px-[.8vw] py-[.5vw] mob:py-[2vw] mob:text-[3vw] text-[.83vw] text-white bg-secondary rounded-[.8vw] transition-all duration-200 ${
                      processing || isProcessingRef.current ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary-600'
                    }`}
                  >
                    {processing ? 'Processing...' : 'Pay on delivery'}
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