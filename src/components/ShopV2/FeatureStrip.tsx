'use client';

import React from 'react';
import Image from 'next/image';

const features = [
  {
    icon: '/assets/icons/sourced-ethically.svg',
    label: 'Sourced Ethically',
  },
  {
    icon: '/assets/icons/harvest-home.svg',
    label: 'Harvest to Home in 12 hrs',
  },
  {
    icon: '/assets/icons/quality-check.svg',
    label: '5-Step Quality Check',
  },
  {
    icon: '/assets/icons/fair-price.svg',
    label: 'Fair Price Promise',
  },
];

const FeatureStrip = () => {
  return (
    <div className="w-full bg-[#FBF9F1] border-t border-b border-gray-200 py-4">
      <div className="flex justify-between flex-wrap gap-y-5 w-full px-4 sm:px-8 text-base md:text-lg font-bold text-[#1A1A1A]">
        {features.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 min-w-[200px]">
            <Image
              src={item.icon}
              alt={item.label}
              width={28}
              height={28}
              className="w-[28px] h-[28px]"
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureStrip;
