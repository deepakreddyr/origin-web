import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import successAnimation from '../../../../src/assets/json/Success.json';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setIsSidebarOpen } from '@/store/slice/loginSlice';
import { resetOrderDetails } from '@/store/slice/placeOrderDetails';
import { clearCart } from '@/store/slice/CartSlice';
const PaymentSuccess = (props: any) => {
  const { paymentModalDetails } = props;
  const [timer, setTimer] = useState(5);
  const router = useRouter();
  const dispatch = useDispatch();
  const total_to_pay= localStorage.getItem("total_to_pay")
  localStorage.removeItem("total_to_pay")
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown); // Cleanup interval on component unmount
    } else {
      localStorage.removeItem('FLOW_TYPE');
      router.push(`/orders/${paymentModalDetails.orderResponse.order_id}`);
      dispatch(setIsSidebarOpen(false));
      dispatch(resetOrderDetails());
      dispatch(clearCart());
    }
  }, [timer]);

  return (
    <div className="flex flex-col items-center justify-center  grow">
      <div className="w-[10vw]">
        <Lottie animationData={successAnimation} />
      </div>
      <div className="text-center pt-[1.67vw] mob:pt-[5.1vw] ">
        <p className="font-[SofiaPro] text-[1.25vw] mob:text-[5vw] text-black font-semibold ">
          Order placed successfully !
        </p>

        {/* <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] text-[#231F2099] font-regular pt-[.97vw] mob:pt-[3.6vw] ">
          Paid
          <span className="font-semibold text-[.97vw] mob:text-[3.6vw]">
            {' '}
            ₹{total_to_pay}{' '}
          </span>using{' '}
          <span className="font-semibold text-[.97vw] mob:text-[3.6vw]">{paymentModalDetails.paymentType}</span>
        </p>
        <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] mob:pt-[4.1vw] pt-[1.1vw] text-[#231F2099]">
          directing you to order Details in {timer}s.
        </p> */}
      </div>
    </div>
  );
};

export default PaymentSuccess;
