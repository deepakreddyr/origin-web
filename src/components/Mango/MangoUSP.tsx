import React from 'react';
import Image from 'next/image';

const MangoUSP = () => {
  const uspItems = [
    { icon: '/assets/images/uspCard1.svg', label: 'As fresh as the golden days' },
    { icon: '/assets/images/uspCard2.svg', label: 'Less than 5% wastage' },
    { icon: '/assets/images/uspCard4.svg', label: 'Sourced locally' },
    { icon: '/assets/images/uspCard3.svg', label: 'Transparent supply chain' }
  ];

  return (
    <section className="px-6 md:px-0 pt-8 md:pb-24 relative z-10">
      <div className="mx-auto grid grid-cols-2 gap-y-12 md:flex md:flex-nowrap items-center justify-center md:justify-between md:max-w-[1019px] md:gap-[100px] py-3 md:py-[12px]">
        {uspItems.map((usp, index) => (
          <div key={index} className="flex flex-col items-center gap-2 md:gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 relative">
              <Image src={usp.icon} alt={usp.label} fill className="object-contain" />
            </div>
            <p
              className="font-medium text-[#000000] text-[16px] md:text-[22px] leading-[1.3] text-center max-w-[140px] md:max-w-[200px]"
              style={{ fontFamily: 'SofiaPro' }}
            >
              {usp.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MangoUSP;
