import Image from 'next/image';
import React from 'react';
import processingIcon from '/public/assets/images/order/processing.png';
import completedIcon from '/public/assets/images/order/completed.png';
const RefundStatusWidget = (props: any) => {
  const { refundDetails } = props;
  function convertTimestampToDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  }
  return (
    <div className="border bg-[#F2EEE44D] border-beige-200 p-[1.1vw] mob:p-[4.1vw] mob:rounded-[3vw] rounded-[.83vw]">
      <div className="flex items-center justify-between border-b border-b-beige-200 pb-[.97vw] mb-[.97vw] ">
        <div>
          <p className="font-slab font-semibold text-[1.1vw] mob:text-[4.1vw] text-[#231F20]">Refund Amount:</p>
          <p className="font-slab font-medium text-[.97vw] mob:text-[3.6vw] text-black-op-80  mob:pt-[2vw] pt-[.4vw] ">
            {' '}
            ₹{refundDetails.amount}
          </p>
        </div>
        <div className="flex items-center gap-[.6vw] mob:gap-[2vw] ">
          <div className="relative w-[1.389vw] mob:w-[6vw] mob:h-[6vw] h-[1.389vw] ">
            <Image src={refundDetails.arn_number ? completedIcon : processingIcon} alt="refund icon" />
          </div>
          <p
            style={{ color: refundDetails.rrn_number ? '#25874D' : '#DC6F3F' }}
            className="font-slab font-medium text-[.83vw] mob:text-[3vw] "
          >
            {refundDetails.rrn_number ? 'Refund Completed' : 'Refund under process'}
          </p>
        </div>
      </div>
      <div>
        <div className=" border-b border-b-beige-200 pb-[.97vw] mob:pb-[3.6vw] mob:mb-[3.6vw] mb-[.97vw]">
          <p className="font-slab font-medium text-[.83vw] mob:text-[3vw] text-black-op-80 ">To: Source</p>
          <p className="font-slab font-medium text-[.83vw] mob:text-[3vw] mob:pt-[1vw] pt-[.3vw] text-black-op-80">
            Refunded on: {convertTimestampToDate(refundDetails.initiated_at)}{' '}
          </p>
        </div>
        <div>
          <div className="flex items-start gap-[.6vw] mob:gap-[2vw] ">
            <div className="h-[4vw] flex flex-col items-center mob:gap-[.75vw] gap-[.2vw]">
              <div>
                <div className="bg-secondary w-[1.1vw] mob:w-[4.1vw] mob:h-[4.1vw] h-[1.1vw] rounded-full text-white flex items-center justify-center ">
                  <p className="text-[.78vw] mob:text-[3vw] font-bold">✓</p>
                </div>
              </div>
              <div
                style={{ background: refundDetails.rrn_number ? '#25874D' : '#A5A2A0' }}
                className="w-[1px]  h-full  "
              ></div>
            </div>

            <div>
              <p className="font-slab font-semibold  text-secondary text-[.97vw] mob:text-[3.6vw]">
                Refund initiated
              </p>
              <p className="text-black-op-60 font-slab  font-medium text-[.83vw] mob:text-[3vw] ">
                {convertTimestampToDate(refundDetails.initiated_at)}
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-start gap-[.6vw] mt-[.3vw] mob:gap-[2vw]">
            <div className="h-[4vw] flex flex-col items-center mob:gap-[.75vw] gap-[.2vw]">
              <div>
                <div
                  style={{ background: refundDetails.rrn_number ? '#25874D' : '#231F2066' }}
                  className="bg-secondary w-[1.1vw] h-[1.1vw] mob:w-[4.1vw] mob:h-[4.1vw] rounded-full text-white flex items-center justify-center "
                >
                  {refundDetails.rrn_number && <p className="text-[.78vw] mob:text-[3vw] font-bold">✓</p>}
                </div>
              </div>
            </div>

            <div>
              <p
                style={{ color: refundDetails.rrn_number ? '#25874D' : '#231F2066' }}
                className="font-slab font-semibold   text-[.97vw] mob:text-[3.6vw]  mt-[-.2vw] "
              >
                {refundDetails.rrn_number
                  ? `Refund credited to your account`
                  : 'Refund will be credited to your account'}
              </p>
              {refundDetails.completed_at && (
                <p className="text-black-op-60 font-slab  font-medium text-[.83vw] mob:text-[3vw] ">
                  {convertTimestampToDate(refundDetails.completed_at)}
                </p>
              )}
              <p
                style={{ color: refundDetails.rrn_number ? '#25874D' : '#231F2066' }}
                className="font-slab font-medium  text-black-op-50 text-[.8vw] mob:text-[3vw] mob:mt-[.75vw] mt-[.2vw]"
              >
                {refundDetails.rrn_number
                  ? `Your RRN Number is ${refundDetails.rrn_number} and the refund is completed , will reflect in 5 - 10 days`
                  : refundDetails.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundStatusWidget;
