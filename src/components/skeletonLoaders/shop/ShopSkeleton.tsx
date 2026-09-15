import React from 'react';

const ShopSkeleton = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Banner Skeleton */}
      <section className="hero">
        <div className="w-full skeleton-shimmer" style={{ height: '45vh', minHeight: '300px' }} />
      </section>

      {/* Promo Banner Skeleton */}
      <section className="section-pad-sm section-pad-sm--tight-t section-pad-sm--tight-b texture-cream">
        <div className="wrap">
          <div className="w-full skeleton-shimmer h-[100px] md:h-[80px] rounded-[16px]" />
        </div>
      </section>

      {/* Recommended Section Skeleton */}
      <section className="section-pad !pb-[7vw] texture-paper">
        <div className="wrap">
          <div style={{ maxWidth: '560px', marginBottom: '40px' }}>
            <div className="w-[120px] h-[16px] skeleton-shimmer mb-3 rounded-full" />
            <div className="w-3/4 max-w-[360px] h-[40px] skeleton-shimmer rounded-lg" />
          </div>

          {[1, 2].map((sectionIndex) => (
            <div key={sectionIndex} className="mb-12">
              <div className="flex justify-between items-center mb-[24px]">
                <div className="w-[180px] h-[28px] skeleton-shimmer rounded-md" />
                <div className="w-[80px] h-[24px] skeleton-shimmer rounded-full hidden md:block" />
              </div>

              <div className="flex gap-[16px] md:gap-[24px] overflow-hidden pb-[16px]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex-shrink-0 w-[240px] md:w-[280px] flex flex-col gap-3">
                    <div className="w-full aspect-[3/4] skeleton-shimmer rounded-[16px] md:rounded-[24px]" />
                    <div className="w-2/3 h-[20px] skeleton-shimmer rounded-md mt-2" />
                    <div className="w-1/3 h-[16px] skeleton-shimmer rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShopSkeleton;
