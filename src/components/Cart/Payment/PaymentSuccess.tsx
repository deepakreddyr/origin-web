import React, { useEffect, useState, useRef } from 'react';
import Lottie from 'lottie-react';
import successAnimation from '../../../../src/assets/json/Success.json';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setIsSidebarOpen } from '@/store/slice/loginSlice';
import { resetOrderDetails } from '@/store/slice/placeOrderDetails';
import * as gtag from '@/utilities/gtag';
import { useCartStore } from '@/hooks/useCartStore';
import { clearCart } from '@/store/slice/CartSlice';
import { clearMangoCart } from '@/store/slice/MangoCartSlice';
import { clearSubscriptionCart } from '@/store/slice/SubscriptionCartSlice';
import { clearSubscriptionBoxCart } from '@/store/slice/SubscriptionBoxCartSlice';

const PaymentSuccess = (props: any) => {
  const { isMangoPage } = useCartStore();
  const { paymentModalDetails, cart } = props;
  const [timer, setTimer] = useState(5);
  const router = useRouter();
  const dispatch = useDispatch();
  const hasPlayedAudio = useRef(false);

  const total_to_pay = localStorage.getItem(isMangoPage ? 'mango_total_to_pay' : 'total_to_pay');
  // localStorage.removeItem("total_to_pay"); // Moved inside useEffect or handle properly to avoid re-runs

  useEffect(() => {
    const orderId = paymentModalDetails?.orderResponse?.order_id || 'N/A';
    const value = Number(total_to_pay) || 0;

    // Google Event
    gtag.event({
      action: 'purchase',
      category: 'Ecommerce',
      transaction_id: orderId,
      value: value,
      items:
        cart?.items?.map((item: any) => ({
          item_id: item.id,
          item_name: item.name,
          quantity: item.multiple_uoms?.reduce((sum: number, uom: any) => sum + (uom.cart_quantity || 0), 0)
        })) || []
    });

    gtag.event({
      action: 'conversion',
      send_to: 'AW-16677565060/cK4RCIynlZIcEITlvZA-',
      value: value || '',
      currency: 'INR',
      transaction_id: orderId
    });

    // Meta Purchase Event (Facebook)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: value,
        currency: 'INR',
        content_ids: cart?.items?.map((item: any) => item.id) || [orderId],
        content_type: 'product',
        num_items: cart?.totalQuantity || 0
      });
      localStorage.removeItem('total_to_pay');
      localStorage.removeItem('mango_total_to_pay');
      localStorage.removeItem('cart_items');
      localStorage.removeItem('mango_cart_items');
      localStorage.removeItem('added_free_items');
      localStorage.removeItem('mango_added_free_items');
    }

    // Play success audio only once using the primed audio from props
    if (props.successAudio?.current && !hasPlayedAudio.current) {
      props.successAudio.current.play().catch((error: any) => {
        console.error('Error playing order success audio:', error);
      });
      hasPlayedAudio.current = true;
    }
  }, [paymentModalDetails, total_to_pay, props.successAudio, cart]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      const flowType = localStorage.getItem('FLOW_TYPE');
      localStorage.removeItem('FLOW_TYPE');
      const targetUrl = `/orders/${paymentModalDetails.orderResponse.order_id}`;

      dispatch(setIsSidebarOpen(false));
      dispatch(resetOrderDetails());
      dispatch(clearCart());
      dispatch(clearMangoCart());
      dispatch(clearSubscriptionCart());
      dispatch(clearSubscriptionBoxCart());

      if (flowType === 'retry_payment') {
        window.location.href = targetUrl;
      } else {
        router.push(targetUrl);
      }
    }
  }, [timer, dispatch, paymentModalDetails.orderResponse.order_id, router]);

  return (
    <div className="flex flex-col items-center justify-center grow">
      <div className="w-[10vw] mob:w-[45vw]">
        <Lottie animationData={successAnimation} />
      </div>
      <div className="text-center pt-[1.67vw] mob:pt-[5.1vw] ">
        <p className="font-[SofiaPro] text-[1.25vw] mob:text-[5vw] text-black font-semibold ">
          Order placed successfully !
        </p>

        <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] text-[#231F2099] font-regular pt-[.97vw] mob:pt-[3.6vw] ">
          Paid
          <span className="font-semibold text-[.97vw] mob:text-[3.6vw]"></span> using{' '}
          <span className="font-semibold text-[.97vw] mob:text-[3.6vw]">{paymentModalDetails.paymentType}</span>
        </p>
        <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] mob:pt-[4.1vw] pt-[1.1vw] text-[#231F2099]">
          directing you to order Details in {timer}s.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
