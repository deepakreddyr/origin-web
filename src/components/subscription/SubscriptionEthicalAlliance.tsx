import React from 'react';

interface SubscriptionEthicalAllianceProps {
  className?: string;
}

const SubscriptionEthicalAlliance: React.FC<SubscriptionEthicalAllianceProps> = ({ className = '' }) => {
  return (
    <section className={`w-full bg-[#EAE8E3] py-12 lg:py-20 px-4 sm:px-6 lg:px-[54px] ${className}`}>
      <div
        className="w-full max-w-[1332px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center"
        style={{
          width: '100%',
          maxWidth: '1332px',
          minHeight: '502.4182434082031px',
          opacity: 1,
          transform: 'rotate(0deg)',
          rowGap: '45px',
          columnGap: '45px'
        }}
      >
        {/* Left Column (spans 6 of 12 columns) */}
        <div className="lg:col-span-6 w-full h-[360px] sm:h-[420px] lg:h-[502.4182434082031px] relative rounded-[24px] overflow-hidden shadow-sm bg-[#EAE6DE]">
          {/* Farm Photograph */}
          <img
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1400&q=85"
            alt="Growers harvesting organic produce"
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Top-Left Floating Badge */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/60">
            {/* Rosette Certificate Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#8D4320] flex-shrink-0">
              <path
                d="M12 2l2.3 2.1 3.1-.3 1.2 2.9 3 1.4-.4 3.1 2 2.6-2 2.6.4 3.1-3 1.4-1.2 2.9-3.1-.3L12 22l-2.3-2.1-3.1.3-1.2-2.9-3-1.4.4-3.1-2-2.6 2-2.6-.4-3.1 3-1.4 1.2-2.9 3.1.3L12 2z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="text-[#132B1E] font-semibold text-[12px] sm:text-[13px] whitespace-nowrap"
              style={{ fontFamily: 'SofiaPro' }}
            >
              Direct from certified heirloom growers
            </span>
          </div>

          {/* Bottom Docked Floating Card */}
          <div
            className="absolute bottom-3.5 sm:bottom-[18px] left-1/2 z-10 bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-white/80 flex flex-col justify-center"
            style={{
              width: 'calc(100% - 32px)',
              maxWidth: '607.5px',
              height: '57.71249771118164px',
              paddingTop: '9px',
              paddingRight: '9px',
              paddingBottom: '9px',
              paddingLeft: '16px',
              borderRadius: '13.5px',
              opacity: 1,
              transform: 'translateX(-50%) rotate(0deg)'
            }}
          >
            <span
              className="text-[#8D4320] font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.14em] leading-none mb-1"
              style={{ fontFamily: 'SofiaPro' }}
            >
              SOIL TO DOORSTEP
            </span>
            <p
              className="text-[#132B1E] text-[12px] sm:text-[13.5px] font-medium leading-none m-0 truncate"
              style={{ fontFamily: 'SofiaPro' }}
            >
              Picked at sunrise, delivered by twilight within 90 miles.
            </p>
          </div>
        </div>

        {/* Right Column: Editorial & Metric Cards (spans 6 of 12 columns) */}
        <div className="lg:col-span-6 w-full lg:h-[502.4182434082031px] flex flex-col justify-between items-start text-left py-1">
          {/* Top Editorial Group */}
          <div>
            {/* Eyebrow / Kicker */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8D4320"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <path d="M7 20h10" />
                <path d="M12 20v-8" />
                <path d="M12 12c0-4 4-6 7-6 0 4-2 7-7 6z" />
                <path d="M12 12c0-3-3-5-6-5 0 3 2 6 6 5z" />
              </svg>
              <span
                className="text-[#8D4320] font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.14em]"
                style={{ fontFamily: 'SofiaPro' }}
              >
                ETHICAL REGENERATIVE ALLIANCE
              </span>
            </div>

            {/* Main Headline */}
            <h2
              className="text-[#132B1E] font-semibold text-[30px] sm:text-[38px] lg:text-[45px] mb-3 sm:mb-4 tracking-tight"
              style={{
                fontFamily: 'Recoleta',
                fontWeight: 600,
                fontSize: '45px',
                lineHeight: '56.25px',
                letterSpacing: '-0.68px',
                verticalAlign: 'middle'
              }}
            >
              Experience naturally good produce, grown without compromises.
            </h2>

            {/* Description Paragraph */}
            <p
              className="text-[#556057] mb-6 max-w-[560px]"
              style={{
                fontFamily: 'SofiaPro',
                fontWeight: 400,
                fontSize: '18px',
                lineHeight: '27px',
                letterSpacing: '0px',
                verticalAlign: 'middle'
              }}
            >
              We go the extra mile to ensure that what reaches your plate is the most authentic, nutrient-dense version
              of every vegetable. We bypass industrial cold-storage intermediaries and guarantee 35% higher compensation
              directly to our grower families.
            </p>
          </div>

          {/* Bottom Metrics & CTA Group */}
          <div className="w-full">
            {/* Two Metric / Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
              {/* Stat Card 1: 100% */}
              <div className="bg-white rounded-[16px] p-5 sm:p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[#EBE8E0] flex flex-col justify-center">
                <span
                  className="text-[#132B1E] font-bold text-[32px] sm:text-[36px] leading-none mb-1.5"
                  style={{ fontFamily: 'Recoleta' }}
                >
                  100%
                </span>
                <span
                  className="text-[#556057] text-[13px] sm:text-[14px] leading-snug font-medium"
                  style={{ fontFamily: 'SofiaPro' }}
                >
                  Chemical &amp; Pesticide Free Soil
                </span>
              </div>

              {/* Stat Card 2: 14 Micro-Farms */}
              <div className="bg-white rounded-[16px] p-5 sm:p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[#EBE8E0] flex flex-col justify-center">
                <span
                  className="text-[#964219] font-bold text-[28px] sm:text-[32px] leading-none mb-1.5"
                  style={{ fontFamily: 'Recoleta' }}
                >
                  14 Micro-Farms
                </span>
                <span
                  className="text-[#556057] text-[13px] sm:text-[14px] leading-snug font-medium"
                  style={{ fontFamily: 'SofiaPro' }}
                >
                  Within 90 miles radius
                </span>
              </div>
            </div>

            {/* Action Link */}
            <a
              href="#testing-standards"
              className="group inline-flex items-center gap-2.5 text-[#132B1E] font-bold text-[14px] sm:text-[15px] hover:text-[#8D4320] transition-colors duration-200"
              style={{ fontFamily: 'SofiaPro' }}
            >
              <span>Read about our certified testing standards</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform group-hover:translate-x-1 transition-transform duration-200"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionEthicalAlliance;
