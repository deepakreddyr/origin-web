import React, { memo, useState, useRef } from 'react';

const RefundCard = ({ refund, activeIndex, totalCards }: { refund: any; activeIndex: number; totalCards: number }) => {
  const referenceId = refund.rrn_number || refund.arn_number;
  const [isExpanded, setIsExpanded] = useState(false);

  const hasRefundItems = refund.refund_items && refund.refund_items.length > 0;
  const hasMoreItems = hasRefundItems && refund.refund_items.length > 3;
  const visibleItems = isExpanded ? refund.refund_items : refund.refund_items?.slice(0, 3);

  if (!hasRefundItems) {
    return (
      <div className="bg-[#E6F2EA] flex flex-col border border-[#B4E0D4] rounded-[16px] p-[16px] gap-[8px] w-full h-full box-border">
        <div className="flex justify-between items-center mb-0">
          <p className="text-[#25874D] font-[Recoleta] font-bold text-[1.38vw] mob:text-[5vw] mb-0">Refund</p>
          <p className="font-medium text-[15px] text-[#25874D] font-[sofiaPro] mb-0">₹ {refund.amount}</p>
        </div>
        <p className="text-[13px] text-[#231f20cc] leading-[18px] font-[sofiaPro] mb-0">
          {refund.message ||
            "Your refund will be completed within 5-10 business days. Verify your bank statement if it's delayed."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#DCF3E8] flex flex-col border border-[#B4E0D4] rounded-[16px] p-[16px] gap-[14px] w-full h-full box-border">
      <div className="flex justify-between items-center mb-0">
        <p className="text-[#25874D] font-[Recoleta] font-bold text-[1.38vw] mob:text-[5vw] mb-0">Refund</p>

        {totalCards > 1 && (
          <div className="flex gap-[4px] items-center">
            {Array.from({ length: totalCards }).map((_, idx) => (
              <div
                key={idx}
                className={`h-[6px] rounded-[4px] transition-all duration-300 ${
                  activeIndex === idx ? 'w-[16px] bg-[#25874D]' : 'w-[6px] bg-[#A3D5B9]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {hasRefundItems && (
        <div className="bg-[#FBF9F6] rounded-[8px] p-[10px] flex flex-col min-h-[150px] grow">
          <p className="font-semibold text-[14px] text-[#1B1B1B] mb-[8px] font-[sofiaPro]">Refund for:</p>

          <div className="flex flex-col gap-[8px]">
            {visibleItems.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-start">
                <p className="text-[13px] text-[#4A4A4A] font-[sofiaPro] flex-1 pr-[8px] mb-0">{item.name}</p>
                <div className="flex items-center gap-[12px]">
                  <span className="text-[13px] text-[#4A4A4A] whitespace-nowrap font-[sofiaPro] w-[35px] text-left">
                    {item.qty != null ? `× ${item.qty}` : ''}
                  </span>
                  <p className="text-[13px] text-[#1B1B1B] font-medium font-[sofiaPro] min-w-[45px] text-right mb-0">
                    ₹ {item.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {hasMoreItems && (
            <div className="flex items-center cursor-pointer mt-[8px]" onClick={() => setIsExpanded(!isExpanded)}>
              <p className="text-[12px] text-[#25874D] font-semibold font-[sofiaPro] mb-0">
                {isExpanded ? 'Show less' : 'Show more'}
              </p>
              <svg
                className={`w-[16px] h-[16px] text-[#25874D] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}

          <div className="mt-auto pt-[16px]">
            <div className="h-[1px] bg-[#E0E0E0] mb-[8px]" />
            <div className="flex justify-between items-center">
              <p className="font-bold text-[14px] text-[#1B1B1B] font-[sofiaPro] mb-0">Total</p>
              <p className="font-semibold text-[14px] text-[#1B1B1B] font-[sofiaPro] mb-0">₹ {refund.amount}</p>
            </div>
          </div>
        </div>
      )}

      {refund.refund_reason && (
        <div className="bg-white rounded-[100px] px-[12px] py-[4px] inline-flex self-start">
          <p className="text-[12px] text-[#4A4A4A] font-medium font-[sofiaPro] mb-0">Reason: {refund.refund_reason}</p>
        </div>
      )}

      {(refund.message || referenceId) && (
        <div className="flex flex-col gap-[4px]">
          {refund.message && (
            <p className="text-[13px] text-[#4A4A4A] leading-[18px] font-[sofiaPro] mb-0">{refund.message}</p>
          )}
          {referenceId && <p className="text-[12px] text-[#757575] font-[sofiaPro] mb-0">Ref ID: {referenceId}</p>}
        </div>
      )}
    </div>
  );
};

const RefundWrapper = (props: any) => {
  const { refundList } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!refundList || refundList.length === 0) return null;

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      setActiveIndex(index);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-full relative overflow-hidden">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden gap-[1.1vw] mob:gap-[4.1vw] w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleScroll}
      >
        {refundList.map((refund: any, index: number) => (
          <div key={index} className="snap-start shrink-0 w-full h-full">
            <RefundCard refund={refund} activeIndex={activeIndex} totalCards={refundList.length} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(RefundWrapper);
