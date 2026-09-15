import React from 'react';

const HomeSkeleton = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Banner Skeleton */}
      <section className="hero">
        <div className="media media--hero skeleton-shimmer" style={{ borderRadius: 0, height: '100vh' }} />
      </section>

      {/* OGRecommends Skeleton */}
      <section className="section-pad !pb-0 texture-paper">
        <div className="wrap">
          <div className="flex items-end justify-between mb-[32px]">
            <div>
              <div className="w-[100px] h-[16px] skeleton-shimmer mb-2 rounded-full" />
              <div className="w-[250px] h-[36px] skeleton-shimmer rounded-lg" />
            </div>
            <div className="w-[80px] h-[20px] skeleton-shimmer rounded-full hidden md:block" />
          </div>

          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="min-w-[280px] md:min-w-[320px] flex-shrink-0 flex flex-col gap-3">
                <div className="w-full aspect-[3/4] skeleton-shimmer rounded-[24px]" />
                <div className="w-3/4 h-[24px] skeleton-shimmer rounded-md" />
                <div className="w-1/2 h-[16px] skeleton-shimmer rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Categories Skeleton */}
      <section className="section-pad section-pad--tight-b texture-paper">
        <div className="wrap">
          <div className="mb-[32px]">
            <div className="w-[140px] h-[16px] skeleton-shimmer mb-2 rounded-full" />
            <div className="w-[300px] h-[40px] skeleton-shimmer rounded-lg" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col gap-[15px]">
                <div className="aspect-[4/5] w-full rounded-[16px] skeleton-shimmer" />
                <div className="w-1/2 h-[20px] skeleton-shimmer rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner Skeleton */}
      <section className="section-pad-sm section-pad-sm--tight-t section-pad-sm--tight-b texture-cream">
        <div className="wrap">
          <div
            className="promo-banner promo-banner--compact skeleton-shimmer h-[100px] md:h-[80px]"
            style={{ border: 'none' }}
          />
        </div>
      </section>
    </div>
  );
};

export default HomeSkeleton;
