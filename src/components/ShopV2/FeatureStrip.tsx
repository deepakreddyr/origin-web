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
      <div className="hidden md:flex justify-between flex-wrap gap-y-5 w-full px-4 sm:px-8 text-base md:text-lg font-bold text-[#1A1A1A]">
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
      
      {/* Mobile scrolling version */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex gap-8 px-4 text-sm font-bold text-[#1A1A1A] whitespace-nowrap animate-scroll">
          {features.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 flex-shrink-0 min-w-max">
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className="w-[24px] h-[24px]"
              />
              <span>{item.label}</span>
            </div>
          ))}
          {/* Duplicate items for seamless loop */}
          {features.map((item, idx) => (
            <div key={`duplicate-${idx}`} className="flex items-center gap-3 flex-shrink-0 min-w-max">
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className="w-[24px] h-[24px]"
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .animate-scroll {
          animation: scroll 15s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default FeatureStrip;