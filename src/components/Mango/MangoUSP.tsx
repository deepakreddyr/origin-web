import React from 'react';
import Image from 'next/image';

const MangoUSP = () => {
  const uspItems = [
    { icon: '/assets/images/uspCard1.svg', label: 'As fresh as the golden days' },
    { icon: '/assets/images/uspCard2.svg', label: 'Less than 5% wastage' },
    { icon: '/assets/images/uspCard3.svg', label: 'Transparent supply chain' },
    { icon: '/assets/images/uspCard4.svg', label: 'Sourced locally' }
  ];

  return (
    <section className="px-6 md:px-0 pb-24">
      <div className="mx-auto flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between md:w-[1019px] md:h-[158px] md:gap-[138px] py-3 md:py-[12px] pointer-events-none">
        {uspItems.map((usp, index) => (
          <div key={index} className="flex flex-col items-center gap-4 min-w-[120px]">
            <div className="w-16 h-16 relative">
              <Image src={usp.icon} alt={usp.label} fill className="object-contain" />
            </div>
            <p
              className="font-medium text-[#000000] text-[22px] leading-[1.4] text-center max-w-[200px]"
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
