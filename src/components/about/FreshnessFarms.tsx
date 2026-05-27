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
      className="bg-[#FEF5E3] rounded-[24px] p-6 lg:p-7 flex flex-col items-start border border-black/[0.02] hover:-translate-y-1 transition-all duration-300 select-none"
      style={{ boxShadow: '0px 3.41px 3.41px 0px rgba(0, 0, 0, 0.25)' }}
    >
      <div className="w-14 h-14 flex items-center justify-center mb-7 shrink-0 relative">
        <Image src={icon} alt="" width={60} height={60} className="object-contain" />
      </div>
      <h3
        className="font-[Recoleta] text-black leading-tight mb-4"
        style={{ fontWeight: 600, fontSize: '21.53px', lineHeight: '30.14px', letterSpacing: '0px' }}
      >
        {title}
      </h3>
      <p
        className="font-[SofiaPro] text-black max-w-[230px]"
        style={{ fontWeight: 400, fontSize: '19.14px', lineHeight: '23.36px', letterSpacing: '0px' }}
      >
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
      className="absolute bottom-6 left-6 bg-white rounded-[20px] shadow-[0_15px_45px_rgba(0,0,0,0.08)] px-5 py-3.5 flex items-center gap-3 z-10 border border-black/5 select-none"
    >
      <ScallopedBadgeCheck />
      <div className="flex flex-col leading-none">
        <span className="font-[Recoleta] font-bold text-[18px] text-black leading-none">100% Organic</span>
        <span className="font-[SofiaPro] font-bold text-[9px] tracking-wider text-[#7A7570] uppercase mt-[4px]">
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
    <section className="w-full bg-white py-[10vh] md:py-[12vh] px-[6vw] overflow-hidden">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-12 items-center">
        {/* ── Left Image Box ── */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[32px] md:rounded-[40px] overflow-hidden shrink-0"
          style={{ width: '591.39px', height: '784px' }}
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
        <div
          className="flex flex-col items-start justify-center"
          style={{ width: '657px', height: '784px', gap: '21.53px' }}
        >
          {/* Animated Main Title */}
          <div className="overflow-hidden w-full">
            <motion.span
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-[Recoleta] text-[#231F20]"
              style={{ fontWeight: 500, fontSize: '45.33px', lineHeight: '54.4px', letterSpacing: '-0.45px' }}
            >
              Freshness Delivered Straight
              <br />
              From Farms
            </motion.span>
          </div>

          {/* Features Grid */}
          <div
            className="grid grid-cols-[300px_300px] justify-between w-full"
            style={{ height: '650px', rowGap: '25.18px' }}
          >
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
