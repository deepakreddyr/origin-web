import Image from 'next/image';
import { useState } from 'react';
import toggleIcon from '/public/assets/svg/toggle.svg';
const ToggleBill = (props: any) => {
  const { bill, totalSavings, orderDetails } = props;
  const [isToggleOn, setIsToggleON] = useState(false);

  const handleToggle = () => {
    setIsToggleON(!isToggleOn);
  };

  const renderBills = () => {
    if (!isToggleOn) return null;
    return (
      <div className="">
        <div className="flex justify-between py-[.4vw] mob:py-[1vw]">
          <p className="font-medium text-[.97vw] mob:text-[3.6vw] font-slab text-[#414141]">Item Total</p>
          <p className="font-semibold text-[.97vw] mob:text-[3.6vw] font-slab">₹{bill.sub_total}</p>
        </div>
        {!!totalSavings && (
          <div className="flex justify-between mt-1">
            <p className="font-medium text-[.97vw] mob:text-[3.6vw] font-slab text-[#00855B]">Savings</p>
            <p className="font-semibold text-[.97vw] mob:text-[3.6vw] font-slab text-[#00855B]">
              -₹{totalSavings}
            </p>
          </div>
        )}
        {bill.reward_spent !== null && (
          <div>
            <div className="flex justify-between mt-1">
              <p className="font-medium text-[.97vw] mob:text-[3.6vw] font-slab text-[#00855B]">Rewards</p>
              <p className="font-semibold text-[.97vw] mob:text-[3.6vw] font-slab text-[#00855B]">
                -₹{bill.reward_spent}
              </p>
            </div>
            {orderDetails.data?.coupon && (
              <div className="flex justify-between mt-1">
                <p className="font-medium text-[.97vw] font-slab mob:text-[3.6vw] text-[#00855B]">
                  Coupon Applied {orderDetails.data.coupon.code}
                </p>
                <p className="font-semibold text-[.97vw] font-slab mob:text-[3.6vw] text-[#00855B]">
                  -₹{bill.discount}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPayment = () => {
    return (
      <div className="flex justify-between py-[.5vw] mob::py-[1.5vw] ">
        <p className="font-medium text-[.97vw] mob:text-[3.6vw] font-slab text-[#414141]">TO PAY</p>
        <p className="font-semibold font-slab mob:text-[3.6vw] text-[.97vw]">₹{bill?.total}</p>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <ul className="pl-0">
        <li className="flex items-center gap-[.6vw] mob:gap-[2vwa] pl-0  mob:pt-[4.1vw] pt-[1.1vw]">
          <p className="font-semibold font-slab text-[.97vw] mob:text-[3.6vw] ">Bill ID: {bill.bill_id}</p>
          <button onClick={handleToggle}>
            <Image
              className={`${isToggleOn ? 'rotate-180' : 'rotate-0'} transition-all ease-in-out `}
              src={toggleIcon}
              alt=""
            />
          </button>
        </li>
        {renderPayment()}
        {renderBills()}
      </ul>
    );
  };

  return renderContent();
};

export default ToggleBill;
