import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import produceImg from '/public/assets/images/about/handpicked.webp';

// ── Icons ──

const ScallopedBadgeCheck = () => (
  <svg className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1l2.4 2.1 3.2-.3 1 3 2.8 1.6-1 3.1 1.7 2.8-2.3 2.3.3 3.2-3.1 1-1.6 2.8-3.1-1-2.8 1.7-2.3-2.3-3.2.3-1-3.1-2.8-1.6 1-3.1-1.7-2.8 2.3-2.3-.3-3.2 3.1-1 1.6-2.8 3.1 1 2.8-1.7Z" />
    <path
      d="m8.5 12.5 2.5 2.5 5-5"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Sub-component: FeatureCard ──
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className="bg-[#FEF5E3] w-[149.23px] lg:w-full h-[154.93px] lg:h-auto rounded-[14.28px] lg:rounded-[24px] pt-[17.85px] lg:pt-[28px] pr-[17.85px] lg:pr-[28px] pb-[43.55px] lg:pb-[28px] pl-[17.85px] lg:pl-[28px] gap-[9.95px] lg:gap-0 flex flex-col items-start border border-black/[0.02] hover:-translate-y-1 transition-all duration-300 select-none"
      style={{ boxShadow: '0px 3.41px 3.41px 0px rgba(0, 0, 0, 0.25)' }}
    >
      <div className="w-8 h-8 lg:w-14 lg:h-14 flex items-center justify-center mb-0 lg:mb-7 shrink-0 relative">
        <Image src={icon} alt="" width={60} height={60} className="object-contain" />
      </div>
      <h3 className="font-[Recoleta] text-black leading-tight mb-0 lg:mb-4 font-[600] text-[14px] lg:text-[21.53px] lg:leading-[30.14px]">
        {title}
      </h3>
      <p className="font-[SofiaPro] text-black max-w-full lg:max-w-[230px] font-[400] text-[10px] lg:text-[19.14px] leading-[14px] lg:leading-[23.36px]">
        {description}
      </p>
    </motion.div>
  );
};

// ── Sub-component: FloatingOrganicCard ──
const FloatingOrganicCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 bg-white rounded-[12px] lg:rounded-[20px] shadow-[0_15px_45px_rgba(0,0,0,0.08)] px-3 py-2 lg:px-5 lg:py-3.5 flex items-center gap-2 lg:gap-3 z-10 border border-black/5 select-none"
    >
      <div className="w-5 h-5 lg:w-7 lg:h-7 shrink-0">
        <ScallopedBadgeCheck />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-[Recoleta] font-bold text-[12px] lg:text-[18px] text-black leading-none">
          100% Organic
        </span>
        <span className="font-[SofiaPro] font-bold text-[7px] lg:text-[9px] tracking-wider text-[#7A7570] uppercase mt-[4px]">
          Certified Quality
        </span>
      </div>
    </motion.div>
  );
};

// ── Main Component ──
const FreshnessFarms = () => {
  const features = [
    {
      icon: '/assets/svg/FreshnessFarms1.svg',
      title: 'Zero Waste',
      description: 'Composting 100% of organic ware -house residue for soil health.'
    },
    {
      icon: '/assets/svg/FreshnessFarms2.svg',
      title: '100% Bio-packaging',
      description: 'Plastic-free compostable materials protect every delivery.'
    },
    {
      icon: '/assets/svg/FreshnessFarms3.svg',
      title: '40% Less Water',
      description: 'Precision drip irrigation saves vital resources across partner farms.'
    },
    {
      icon: '/assets/svg/FreshnessFarms4.svg',
      title: 'Fair Trade+',
      description: 'Guaranteeing 25% higher income than standard market rates.'
    }
  ];

  return (
    <section className="w-full bg-white pt-[30px] pr-[16px] pb-[40px] pl-[16px] lg:py-[12vh] lg:px-[6vw] overflow-hidden">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:grid lg:grid-cols-[0.9fr_1.1fr] gap-[20px] lg:gap-12 items-center">
        {/* ── Left Image Box ── */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[24px] lg:rounded-[40px] overflow-hidden shrink-0 w-full h-[520px] lg:w-[591.39px] lg:h-[784px]"
        >
          <Image
            src={produceImg}
            alt="Produce Display Rack"
            fill
            className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-700 ease-out"
            priority
            sizes="(max-width: 1024px) 100vw, 591px"
          />
          {/* Floating Elements */}
          <FloatingOrganicCard />
        </motion.div>

        {/* ── Right Content Box ── */}
        <div className="flex flex-col items-start justify-center w-full lg:w-[657px] h-auto lg:h-[784px] gap-[20px] lg:gap-[21.53px]">
          {/* Animated Main Title */}
          <div className="overflow-hidden w-full">
            <motion.span
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-[Recoleta] text-[#231F20] font-[500] text-[24px] lg:text-[45.33px] leading-[28.8px] lg:leading-[54.4px] tracking-[-0.24px] lg:tracking-[-0.45px]"
            >
              Freshness Delivered Straight
              <br />
              From Farms
            </motion.span>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-[300px_300px] justify-center lg:justify-start w-[326.82px] mx-auto lg:mx-0 lg:w-full h-[323.34px] lg:h-[650px] gap-[12.53px] lg:gap-[25.18px]">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={0.2 + i * 0.15}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreshnessFarms;
