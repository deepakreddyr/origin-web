import React from 'react';

interface SubscriptionGrowerSpotlightProps {
  className?: string;
}

const SubscriptionGrowerSpotlight: React.FC<SubscriptionGrowerSpotlightProps> = ({ className = '' }) => {
  return (
    <section
      className={`w-full max-w-[1440px] min-h-[396px] mob:min-h-0 py-[45px] mob:py-8 px-[54px] mob:px-4 sm:px-6 mx-auto flex justify-center items-center ${className}`}
      style={{
        width: '100%',
        maxWidth: '1440px',
        opacity: 1,
        transform: 'rotate(0deg)',
        margin: '0 auto'
      }}
    >
      {/* 3-Column Grid Container (1332px x 306px) */}
      <div
        className="w-full max-w-[1332px] min-h-[306px] mob:min-h-0 grid grid-cols-1 lg:grid-cols-3 items-stretch gap-[27px] mob:gap-5"
        style={{
          width: '100%',
          maxWidth: '1332px',
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
      >
        {/* Left Div: Grower Spotlight (Columns 1-2, 879px x 306px) */}
        <div
          className="lg:col-span-2 w-full max-w-[879px] mob:max-w-full min-h-[306px] mob:min-h-0 bg-[#F4F1EA] rounded-[13.5px] p-[27px] mob:p-5 flex flex-col sm:flex-row gap-[27px] mob:gap-5 items-center transition-shadow duration-200"
          style={{
            borderRadius: '13.5px',
            backgroundColor: '#F4F1EA',
            opacity: 1,
            transform: 'rotate(0deg)'
          }}
        >
          {/* Farmer Photo Container with Verified Badge */}
          <div className="relative w-full sm:w-[252px] h-[220px] mob:h-[200px] sm:h-[252px] rounded-[12px] overflow-hidden flex-shrink-0 bg-[#E8E4DA]">
            <img
              src="https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?auto=format&fit=crop&w=600&q=85"
              alt="Master Grower Anand Shinde"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
            {/* Verified Grower Badge */}
            <div className="absolute bottom-2.5 left-2.5 z-10 bg-[#132B1E] text-white text-[10px] font-bold tracking-[0.08em] px-2.5 py-1 rounded-[6px] uppercase shadow-xs">
              VERIFIED GROWER
            </div>
          </div>

          {/* Grower Details (Vertically Centered to the image on left) */}
          <div className="flex flex-col justify-center text-left flex-grow max-w-[533px]">
            {/* Rameshwar Orchards Section (width: 533px, gap: 4.5px) */}
            <div
              className="flex flex-col text-left justify-center w-full max-w-[533px] gap-[4.5px]"
              style={{
                opacity: 1,
                transform: 'rotate(0deg)'
              }}
            >
              {/* Location Tag */}
              <div className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8D4320"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span
                  className="text-[#8D4320] font-bold text-[12px] uppercase tracking-[0.08em]"
                  style={{ fontFamily: 'SofiaPro' }}
                >
                  Rameshwar Orchards • Nashik Valley
                </span>
              </div>

              {/* Quote / Heading */}
              <h3
                className="text-[#132B1E] font-semibold text-[22.5px] mob:text-[18px] leading-[31.5px] mob:leading-[1.3] tracking-normal m-0"
                style={{
                  fontFamily: 'Recoleta',
                  fontWeight: 600,
                  letterSpacing: '0px',
                  verticalAlign: 'middle',
                  color: '#132B1E'
                }}
              >
                &ldquo;Every vegetable has its true fragrance when the earth is fed natural compost.&rdquo;
              </h3>

              {/* Bio Paragraph */}
              <p
                className="text-[#556057] text-[15.75px] mob:text-[14px] leading-[23.63px] mob:leading-[1.5] m-0"
                style={{
                  fontFamily: 'SofiaPro',
                  fontWeight: 400,
                  letterSpacing: '0px',
                  verticalAlign: 'middle'
                }}
              >
                Master Grower Anand Shinde has nurtured heirloom tomatoes and tender leafy spinach using ancient
                jeevamrut microbial bio-fertilizers since 2014.
              </p>

              {/* Harvesting This Week Tag */}
              <p className="text-[13px] sm:text-[13.5px] leading-tight m-0 pt-0.5" style={{ fontFamily: 'SofiaPro' }}>
                <span className="font-bold text-[#132B1E]">Harvesting this week: </span>
                <span className="text-[#556057]">Vine Tomatoes, Coriander, Ridge Gourd</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Div: Customer Testimonial (Column 3, 426px x 301.3px) */}
        <div
          className="lg:col-span-1 w-full max-w-[426px] mob:max-w-full min-h-[301.3125px] mob:min-h-0 bg-[#FFFFFF] rounded-[13.5px] p-[27px] mob:p-5 flex flex-col justify-between text-left shadow-[0px_1.13px_2.25px_0px_rgba(0,0,0,0.05)] border border-[#EBE8E0]/70 transition-shadow duration-200"
          style={{
            borderRadius: '13.5px',
            gap: '24px',
            backgroundColor: '#FFFFFF',
            opacity: 1,
            transform: 'rotate(0deg)'
          }}
        >
          {/* Top: 5 Stars + Testimonial Quote */}
          <div>
            {/* 5 Filled Stars */}
            <div className="flex items-center gap-1.5 mb-3 text-[#A04A1E]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#A04A1E" stroke="#A04A1E" strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>

            {/* Testimonial Quote */}
            <p
              className="text-[#132B1E] text-[15px] sm:text-[16px] leading-[24px] sm:leading-[25px] italic m-0"
              style={{ fontFamily: 'SofiaPro' }}
            >
              &ldquo;We stopped buying superstore vegetables completely. The spinach keeps crisp for 6 whole days, and
              the tomatoes actually smell like a vegetable garden.&rdquo;
            </p>
          </div>

          {/* Bottom: Avatar + Subscriber Details */}
          <div className="flex items-center gap-3 pt-2">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
              alt="Pooja Mukhopadhyay"
              className="w-[44px] h-[44px] rounded-full object-cover flex-shrink-0 shadow-xs border border-black/5"
              loading="lazy"
            />
            <div className="flex flex-col">
              <span className="text-[#132B1E] font-bold text-[14px] leading-tight" style={{ fontFamily: 'SofiaPro' }}>
                Pooja Mukhopadhyay
              </span>
              <span className="text-[#7A837A] text-[12px] leading-tight mt-1" style={{ fontFamily: 'SofiaPro' }}>
                Subscriber for 8 Months • Kolkata
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionGrowerSpotlight;
