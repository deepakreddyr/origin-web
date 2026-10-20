import React from 'react';
import { HarvestItem } from './mockSubscriptionData';

interface SubscriptionDispatchManifestProps {
  harvestItems: HarvestItem[];
  totalWeight?: string;
  className?: string;
}

const SubscriptionDispatchManifest: React.FC<SubscriptionDispatchManifestProps> = ({
  harvestItems,
  totalWeight = '4.85 kg',
  className = ''
}) => {
  return (
    <section className={`w-full text-left ${className}`}>
      {/* White Background Container */}
      <div className="w-full bg-white text-[#132B1E] rounded-[20px] p-6 sm:p-7 lg:p-8 border border-[#EBE8E0] shadow-xs">
        {/* Manifest Header */}
        <div className="flex flex-col text-left mb-8">
          {/* Kicker */}
          <div className="flex items-center gap-1.5 mb-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8D4320" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
            <span
              className="text-[#8D4320] font-bold text-[11px] uppercase tracking-[0.14em]"
              style={{ fontFamily: 'SofiaPro' }}
            >
              DISPATCH MANIFEST
            </span>
          </div>

          {/* Title + Total Weight Pill */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2
              className="text-[#132B1E] font-semibold text-[28px] sm:text-[34px] leading-tight"
              style={{ fontFamily: 'Recoleta' }}
            >
              What&apos;s in this Sunday&apos;s Harvest Box
            </h2>
            <span
              className="bg-[#EFE9DC] text-[#132B1E] font-bold text-[11.5px] px-3 py-1 rounded-full shadow-xs"
              style={{ fontFamily: 'SofiaPro' }}
            >
              Total Weight: ~{totalWeight}
            </span>
          </div>

          {/* Description */}
          <p className="text-[#556057] text-[14px] sm:text-[15px] max-w-[700px] m-0" style={{ fontFamily: 'SofiaPro' }}>
            Every item is harvested within 24 hours of dispatch from certified zero-chemical regenerative soil beds in
            Baramati and Hooghly districts.
          </p>
        </div>

        {/* Category Cards in #F5F3EE */}
        {harvestItems && harvestItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {harvestItems.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-[#F5F3EE] rounded-[16px] p-5 flex flex-col justify-between text-left border border-[#E8E4DA] shadow-xs"
                >
                  <div>
                    {/* Header: Title + Weight */}
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="text-[#132B1E] font-bold text-[16px] leading-tight m-0"
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        {item.title}
                      </h3>

                      {/* Weight Badge */}
                      {item.weight && (
                        <span
                          className="text-[#132B1E] font-bold text-[12px] bg-[#E8E4DA] px-2.5 py-1 rounded-full"
                          style={{ fontFamily: 'SofiaPro' }}
                        >
                          {item.weight}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p
                        className="text-[#556057] text-[13px] sm:text-[13.5px] leading-[20px] mb-4"
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom Tag */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {item.isSwappable ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5">
                          <polyline points="17 1 21 5 17 9" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <polyline points="7 23 3 19 7 15" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                        <span className="text-[#8D4320] font-semibold text-[11.5px]" style={{ fontFamily: 'SofiaPro' }}>
                          {item.tag || 'Swappable for Red Amaranth'}
                        </span>
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-[#1E3F2F] font-semibold text-[11.5px]" style={{ fontFamily: 'SofiaPro' }}>
                          {item.tag || 'Always Included'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#F5F3EE] rounded-[16px] p-6 text-left border border-[#E8E4DA]">
            <p className="text-[#556057] text-[14px] leading-relaxed" style={{ fontFamily: 'SofiaPro' }}>
              Specific crop allocations are updated by the farm collective after the morning harvest inspection. Every
              box is curated with certified organic staples, fresh greens, and seasonal specialties.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SubscriptionDispatchManifest;
