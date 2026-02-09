import React from 'react';
import Bills from './Bills';

const BillDetails = (props: any) => {
  const { orderDetails } = props;
  const { data: item } = orderDetails;

  const totalPayableAmount = React.useMemo(() => {
    if (orderDetails?.bills !== undefined) {
      const billsLength = orderDetails.bills.length;

      if (orderDetails && Array.isArray(orderDetails.bills) && billsLength > 0) {
        let payableAmount = 0;
        orderDetails.bills.forEach((bill: any) => {
          if (bill.payment_status === 'complete') {
            payableAmount += bill.total;

            if (bill.wallet_spent) {
              payableAmount -= bill.wallet_spent;
            }

            if (bill.reward_spent) {
              payableAmount -= bill.reward_spent;
            }
          }
          if (bill.payment_status !== 'complete') {
            payableAmount += bill.total;

            if (bill.wallet_spent) {
              payableAmount -= bill.wallet_spent;
            }

            if (bill.reward_spent) {
              payableAmount -= bill.reward_spent;
            }
          }
        });
        return payableAmount;
      }
    }

    return 0;
  }, [orderDetails]);

  const totalSavings = React.useMemo(() => {
    return orderDetails.data?.items.reduce((savings: any, ite: any) => {
      const itemSavings = ite.ordered_uoms.reduce((uomSavings: any, uom: any) => {
        return uomSavings + (uom.market_price_sub_total - uom.subtotal);
      }, 0);
      return savings + itemSavings;
    }, 0);
  }, [orderDetails]);

  const renderPaymentText = () => {
    if (
      orderDetails?.payment_method === 'Cash' ||
      orderDetails?.payment_status === 'failed' ||
      orderDetails?.payment_status === 'pending'
    ) {
      return <p className="font-[sofiaPro] font-semibold text-[.97vw] mob:text-[3.6vw] text-[#231F20]">To Pay</p>;
    }
    if (orderDetails?.payment_status === 'complete' && orderDetails?.payment_method === 'Razorpay') {
      return <p className="font-[sofiaPro] font-semibold text-[.97vw] mob:text-[3.6vw] text-[#231F20]">Paid Online</p>;
    }

    return null;
  };

  const renderPayment = () => {
    return (
      <div className="flex justify-between">
        {renderPaymentText()}
        <p className="font-[sofiaPro] font-medium text-[.97vw] mob:text-[3.6vw]">₹{totalPayableAmount}</p>
      </div>
    );
  };

  const renderBillSection = (title: any, value: any, isGreen = false, canRender = true) => {
    if (!canRender) return null;
    return (
      <div className={`flex justify-between ${isGreen ? 'text-[#00855B]' : 'text-[#231F20]'}`}>
        <p className="font-[sofiaPro] font-medium text-[.97vw] mob:text-[3.6vw]">{title}</p>
        <p className="font-[sofiaPro] font-medium text-[.97vw] mob:text-[3.6vw]">{value}</p>
      </div>
    );
  };

  const renderBills = () => {
    const totalMarketPrice = orderDetails.data?.total_market_price ?? 0;
    const subTotal = orderDetails.data?.sub_total ?? 0;
    return (
      <div className="flex flex-col gap-[1.17vw] mob:gap-[3vw] ">
        {orderDetails?.bills
          .filter((bill: any) => bill.payment_method !== 'Refund')
          .map((bill: any) => (
            <div key={bill.bill_id} className="flex flex-col gap-[1.17vw] mob:gap-[3vw]">
              {totalMarketPrice > subTotal
                ? renderBillSection(`Item Total`, `₹${totalMarketPrice}`)
                : renderBillSection(`Items Total`, `₹${bill.sub_total}`)}

              {(!!bill.reward_spent || !!totalSavings || !!bill.delivery_fee || !!orderDetails?.coupon) && (
                <div className="flex justify-center w-full">
                  <hr className="w-full border-t" />
                </div>
              )}

              {renderBillSection(`Rewards`, `-₹${bill.reward_spent}`, true, !!bill.reward_spent)}
              {renderBillSection(`Savings`, `- ₹${totalSavings?.toFixed(2)}`, true, !!totalSavings)}

              {orderDetails.data?.refunds?.amount &&
                orderDetails.data?.refunds?.amount > 0 &&
                renderBillSection(`Refund`, `+ ₹${orderDetails.data?.refunds?.amount?.toFixed(2)}`, true)}
              {renderBillSection(`Delivery Fee`, `₹${bill.delivery_fee}`, true, !!bill.delivery_fee)}
              {renderBillSection(
                `Coupon Applied ${orderDetails.coupon.code}`,
                `- ₹${bill.discount}`,
                true,
                !!orderDetails?.coupon
              )}
            </div>
          ))}

        <div className="flex justify-center ">
          <hr className="w-full border-t" />
        </div>

        {renderPayment()}
      </div>
    );
  };
  return (
    <div className="bg-[#F2EEE44D] mt-[5vw] border border-[#F2EEE4] rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] p-[1.1vw]">
      <h3 className="font-bold text-[1.25vw] mob:text-[5vw]  pb-[1.1vw] mob:pb-[4.1vw] text-black opacity-80">
        Bill Details
      </h3>
      {(orderDetails.bills.filter((bill: any) => bill.payment_method !== 'Refund') || []).length > 1 ? (
        <>
          <Bills orderDetails={orderDetails} />
        </>
      ) : (
        renderBills()
      )}

      {/* Uncomment and use if needed */}
      {/* <hr className="w-[93%] ml-2 mb-4" /> */}
    </div>
  );
};

export default BillDetails;
