import React, { memo, useState, useRef } from 'react';

const RefundCard = ({ refund, activeIndex, totalCards }: { refund: any; activeIndex: number; totalCards: number }) => {
  const referenceId = refund.rrn_number || refund.arn_number;
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMoreItems = refund.refund_items && refund.refund_items.length > 3;
  const visibleItems = isExpanded ? refund.refund_items : refund.refund_items?.slice(0, 3);

  return (
    <div className="bg-[#DCF3E8] flex flex-col border border-[#B4E0D4] rounded-[16px] p-[16px] gap-[14px] w-full h-full">
      <div className="flex justify-between items-center mb-0">
        <p className="text-[#25874D] font-[Recoleta] font-bold text-[1.38vw] mob:text-[5vw] mb-0">Refund</p>

        {totalCards > 1 && (
          <div className="bg-white rounded-full px-[12px] py-[4px] flex items-center justify-center border border-[#B4E0D4]">
            <p className="text-[#25874D] font-semibold font-[sofiaPro] text-center text-[1vw] mob:text-[3.5vw] mb-0 mt-[3px]">
              {activeIndex + 1}/{totalCards}
            </p>
          </div>
        )}
      </div>

      {refund.refund_items && refund.refund_items.length > 0 && (
        <div className="bg-[#FBF9F6] rounded-[8px] p-[10px] flex flex-col min-h-[140px] mob:min-h-[150px]">
          <div className="flex flex-col gap-[12px]">
            <p className="font-bold font-[sofiaPro] text-black text-[1vw] mob:text-[3.8vw] mb-0">Refund for:</p>

            <div className="flex flex-col gap-[8px]">
              {visibleItems.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <p className="text-black/70 font-[sofiaPro] font-medium text-[.9vw] mob:text-[3.5vw]">{item.name}</p>
                  <p className="text-black/70 font-[sofiaPro] font-medium text-[.9vw] mob:text-[3.5vw]">
                    ₹ {item.amount ? Number(item.amount).toFixed(2).replace(/\.00$/, '') : 0}
                  </p>
                </div>
              ))}

              {hasMoreItems && (
                <div
                  className="flex items-center justify-center gap-[4px] mt-[4px] cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <p className="text-[#25874D] font-[sofiaPro] font-semibold text-[.9vw] mob:text-[3.5vw]">
                    {isExpanded ? 'Show less' : 'Show more'}
                  </p>
                  <svg
                    className={`w-[1vw] h-[1vw] mob:w-[4vw] mob:h-[4vw] text-[#25874D] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[12px] mt-auto pt-[12px]">
            <div className="border-b border-black/10"></div>
            <div className="flex justify-between">
              <p className="font-bold font-[sofiaPro] text-black text-[1.1vw] mob:text-[4vw]">Total</p>
              <p className="font-bold font-[sofiaPro] text-black text-[1.1vw] mob:text-[4vw]">₹ {refund.amount}</p>
            </div>
          </div>
        </div>
      )}

      {refund.refund_reason && (
        <div className="bg-white rounded-[.5vw] mob:rounded-[2vw] px-[.8vw] py-[.4vw] mob:px-[3vw] mob:py-[1.5vw] self-start">
          <p className="text-black/70 font-semibold font-[sofiaPro] text-[.85vw] mob:text-[3.2vw]">
            Reason: {refund.refund_reason}
          </p>
        </div>
      )}

      {refund.message && (
        <p className="text-black/70 font-[sofiaPro] text-[.95vw] mob:text-[3.5vw] leading-[1.4]">{refund.message}</p>
      )}

      {referenceId && (
        <p className="text-black/70 font-[sofiaPro] text-[.95vw] mob:text-[3.5vw]">
          Reference ID: <span className="font-bold text-black">{referenceId}</span>
        </p>
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
