import React from 'react';

interface SubscriptionProvenanceBannerProps {
  className?: string;
}

const SubscriptionProvenanceBanner: React.FC<SubscriptionProvenanceBannerProps> = ({ className = '' }) => {
  return (
    <section className={`w-full ${className}`}>
      <div className="w-full bg-[#1A3828] text-white rounded-[20px] p-5 sm:p-6 lg:p-7 flex flex-col md:flex-row items-center gap-6 shadow-md text-left">
        {/* Farm Photo */}
        <div className="w-full md:w-[220px] h-[160px] sm:h-[180px] rounded-[14px] overflow-hidden flex-shrink-0 bg-[#0F2218]">
          <img
            src="https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=85"
            alt="Green Earth Organics Baramati"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Provenance Details */}
        <div className="flex flex-col justify-between items-start text-left flex-grow">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="bg-[#2D5A42] text-[#A3E5C0] text-[10.5px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{ fontFamily: 'SofiaPro' }}
            >
              PROVENANCE VERIFIED
            </span>
            <span className="text-white/70 text-[11.5px] font-medium" style={{ fontFamily: 'SofiaPro' }}>
              38 km from Hub
            </span>
          </div>

          {/* Heading */}
          <h3
            className="text-white font-semibold text-[22px] sm:text-[26px] leading-tight mb-2"
            style={{ fontFamily: 'Recoleta' }}
          >
            Green Earth Organics, Baramati
          </h3>

          {/* Bio */}
          <p
            className="text-white/80 text-[13.5px] sm:text-[14px] leading-[22px] mb-3 max-w-[750px]"
            style={{ fontFamily: 'SofiaPro' }}
          >
            Cultivated under traditional jeevamrut soil nourishment with natural multi-crop companion farming. Zero
            chemical synthetic fertilizers, tested and certified every 90 days.
          </p>

          {/* Certificate Link */}
          <a
            href="#soil-certificate"
            className="inline-flex items-center gap-1.5 text-[#68D391] hover:text-[#9AE6B4] font-bold text-[13px] transition-colors"
            style={{ fontFamily: 'SofiaPro' }}
          >
            <span>View Soil Test Certificate</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionProvenanceBanner;
