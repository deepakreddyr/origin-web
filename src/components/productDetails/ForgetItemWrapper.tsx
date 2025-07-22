import React, { useRef } from 'react';
import ItemCard from '../shared/ItemCard';
import arrowIcon from '/public/assets/images/arrow.png';
import Image from 'next/image';
const ForgetItemWrapper = (props: any) => {
  const { productDetails } = props;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400, // Adjust the scroll distance as needed
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400, // Adjust the scroll distance as needed
        behavior: 'smooth'
      });
    }
  };
  if (productDetails.upsell_items.length === 0) return null;
  return (
    <div className="border rounded-[1.1vw] border-beige-200 p-[1.1vw] mt-[5vw]">
      <p className="font-[SofiaPro] text-[1.25vw] font-semibold text-black-op-80">Forgot to add?</p>
      <div
        style={{ background: 'linear-gradient(90deg, #25874D 0%, rgba(37, 135, 77, 0) 100%)' }}
        className="w-full h-[3px] mt-[.6vw]"
      ></div>
      <div className="flex items-center relative my-[2.1vw]">
        <button
          onClick={scrollLeft}
          className="w-[4.67vw] rotate-180 left-[-2.2vw] absolute z-[1]"
          aria-label="Scroll Left"
        >
          <Image src={arrowIcon} alt="" />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-y-scroll gap-[1.67vw] scrollbar-none noscrollbar w-full mx-2"
        >
          {productDetails.upsell_items.map((item: any) => (
            <ItemCard itemDetails={item} key={item.id} />
          ))}
        </div>
        <button onClick={scrollRight} className="w-[4.67vw]  right-[-2.2vw] absolute z-[1]" aria-label="Scroll Right">
          <Image src={arrowIcon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default ForgetItemWrapper;
