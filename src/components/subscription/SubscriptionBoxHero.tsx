import React from 'react';

const DEFAULT_BANNER_IMAGE = '/onam.png';

interface SubscriptionBoxHeroProps {
  children?: React.ReactNode;
  backgroundImage?: string;
  className?: string;
  tagline?: string;
  title?: React.ReactNode;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  trustBadge1?: string;
  trustBadge2?: string;
  imagePillText?: string;
  cardBadgeHours?: string;
  cardBadgeTitle?: string;
  cardBadgeSubtitle?: string;
}

const SubscriptionBoxHero: React.FC<SubscriptionBoxHeroProps> = ({
  children,
  backgroundImage = DEFAULT_BANNER_IMAGE,
  className = '',
  tagline = 'REGIONAL HARVEST CYCLE • WEEK 18',
  title = (
    <>
      We select the top <br />
      harvest for you and <br />
      your family.
    </>
  ),
  subtitle = 'Every week, we curate seasonal organic produce directly from certified regenerative micro-farms and deliver to your kitchen within 18 hours of harvest.',
  ctaText = 'Explore Baskets',
  onCtaClick,
  trustBadge1 = '100% Certified Organic',
  trustBadge2 = 'Picked & Shipped in 18h',
  imagePillText = '100% Certified Regenerative Soil',
  cardBadgeHours = '18h',
  cardBadgeTitle = 'FARM-TO-DOOR',
  cardBadgeSubtitle = 'Harvested fresh at sunrise'
}) => {
  return (
    <section
      className={`w-full bg-[#F5F3EE] pt-[84px] md:pt-[110px] pb-10 lg:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}
    >
      <div
        className="w-full max-w-[1332px] mx-auto min-h-[652.5px] grid grid-cols-1 lg:grid-cols-12 gap-[32px] lg:gap-[45px] items-center"
        style={{
          minHeight: '652.5px'
        }}
      >
        {/* Left Column (spans 6 of 12 columns, 643.5px width) */}
        <div className="lg:col-span-6 w-full max-w-[643.5px] py-[18px] flex flex-col justify-center items-start text-left gap-[22px]">
          {/* Eyebrow / Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9DC] border border-[#E2DBD0]">
            <span className="w-2 h-2 rounded-full bg-[#A85125]" />
            <span
              className="text-[#8D4320] text-[11px] md:text-[12px] font-bold tracking-[0.1em] uppercase"
              style={{ fontFamily: 'SofiaPro' }}
            >
              {tagline}
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-[#132B1E] font-semibold text-[38px] sm:text-[46px] lg:text-[54px] xl:text-[56px] leading-[1.08] tracking-[-0.02em]"
            style={{ fontFamily: 'Recoleta' }}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            className="text-[#4F5952] text-[16px] sm:text-[17px] md:text-[1.3vw] leading-[1.6] w-full max-w-[648px] lg:w-[628.91px] min-h-[99px] pr-0 sm:pr-[24px] lg:pr-[53.91px]"
            style={{
              fontFamily: 'SofiaPro',
              maxWidth: '648px',
              minHeight: '99px'
            }}
          >
            {subtitle}
          </p>

          {/* CTA Button */}
          <button
            type="button"
            onClick={onCtaClick}
            className="inline-flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#EAA01E] active:scale-[0.98] text-[#1C2520] font-semibold text-[14px] rounded-full transition-all duration-200 shadow-[0_8px_20px_-4px_rgba(245,166,35,0.4)] cursor-pointer mt-1"
            style={{
              width: '196.84px',
              height: '40.04px',
              borderRadius: '11248.88px',
              opacity: 1,
              transform: 'rotate(0deg)',
              fontFamily: 'SofiaPro'
            }}
          >
            <span>{ctaText}</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>

          {/* Trust Badges Row */}
          <div
            className="w-[380px] flex flex-wrap items-center gap-6 pt-5 mt-2"
            style={{
              borderTop: '1.13px solid #E4E2DD'
            }}
          >
            {/* Badge 1: 100% Certified Organic */}
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B85D26"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span
                className="text-[#243328] font-medium text-[13px] md:text-[14px]"
                style={{ fontFamily: 'SofiaPro' }}
              >
                {trustBadge1}
              </span>
            </div>

            {/* Badge 2: Picked & Shipped in 18h */}
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B85D26"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span
                className="text-[#243328] font-medium text-[13px] md:text-[14px]"
                style={{ fontFamily: 'SofiaPro' }}
              >
                {trustBadge2}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (spans 6 of 12 columns, 643.5px width x 585px height) */}
        <div
          className="lg:col-span-6 w-full max-w-[643.5px] h-[380px] sm:h-[480px] lg:h-[585px] rounded-[18px] overflow-hidden relative shadow-md"
          style={{
            borderRadius: '18px'
          }}
        >
          {/* Main Image */}
          <img src={backgroundImage} alt="Farm Fresh Harvest" className="w-full h-full object-cover" />

          {/* Top-Left Floating Pill */}
          <div className="absolute top-4 left-4 z-10 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-white/60 flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A85125"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6" />
            </svg>
            <span className="text-[#233327] text-[12px] font-semibold" style={{ fontFamily: 'SofiaPro' }}>
              {imagePillText}
            </span>
          </div>

          {/* Bottom-Right Floating Card */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 bg-white rounded-[16px] px-4 py-3 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.18)] flex items-center gap-3 border border-black/5">
            <div className="w-11 h-11 rounded-full bg-[#0E2919] text-white flex items-center justify-center font-bold text-[15px] flex-shrink-0">
              {cardBadgeHours}
            </div>
            <div className="flex flex-col text-left">
              <span
                className="text-[#B85D26] uppercase font-bold text-[10px] tracking-wider leading-none mb-1"
                style={{ fontFamily: 'SofiaPro' }}
              >
                {cardBadgeTitle}
              </span>
              <span className="text-[#223326] font-medium text-[12px] leading-tight" style={{ fontFamily: 'SofiaPro' }}>
                {cardBadgeSubtitle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
};

export default SubscriptionBoxHero;
