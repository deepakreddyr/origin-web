import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import produceImg from '/public/assets/images/about/handpicked.webp';

// ── Icons ──
const RecycleIcon = () => (
  <svg
    className="w-5 h-5 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const LeafIcon = () => (
  <svg
    className="w-5 h-5 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 2 8a7 7 0 0 1-10 10z" />
    <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
  </svg>
);

const DropletIcon = () => (
  <svg
    className="w-5 h-5 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
  </svg>
);

const BanknoteIcon = () => (
  <svg
    className="w-5 h-5 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

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
  icon: React.ReactNode;
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
      className="bg-[#FEF9E9] rounded-[24px] p-6 lg:p-7 flex flex-col items-start border border-black/[0.02] hover:-translate-y-1 transition-all duration-300 select-none"
      style={{ boxShadow: '0px 3.41px 3.41px 0px rgba(0, 0, 0, 0.25)' }}
    >
      <div className="w-10 h-10 rounded-[10px] bg-[#FFB600] flex items-center justify-center mb-5 shrink-0">{icon}</div>
      <h3 className="font-[Recoleta] font-bold text-lg lg:text-xl text-[#231F20] mb-2 leading-tight">{title}</h3>
      <p className="font-[SofiaPro] font-regular text-[13.5px] lg:text-[14px] text-[#00000099] leading-relaxed">
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

// ── Sub-component: HotListLogo ──
const HotListLogo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      className="absolute bottom-6 right-6 bg-white border-2 border-[#E53935] text-[#E53935] p-2.5 flex flex-col items-center justify-center font-[Recoleta] z-10 select-none rounded shadow-sm scale-95"
    >
      <span className="text-[6.5px] tracking-widest uppercase font-[SofiaPro] font-bold leading-none mb-[2px]">
        The
      </span>
      <span className="text-[10px] font-black uppercase tracking-tight leading-none mb-[2px]">Hot List</span>
      <span className="text-[7.5px] tracking-widest uppercase font-[SofiaPro] font-bold leading-none">Daily</span>
    </motion.div>
  );
};

// ── Main Component ──
const FreshnessFarms = () => {
  const features = [
    {
      icon: <RecycleIcon />,
      title: 'Zero Waste',
      description: 'Composting 100% of organic ware -house residue for soil health.'
    },
    {
      icon: <LeafIcon />,
      title: '100% Bio-packaging',
      description: 'Plastic-free compostable materials protect every delivery.'
    },
    {
      icon: <DropletIcon />,
      title: '40% Less Water',
      description: 'Precision drip irrigation saves vital resources across partner farms.'
    },
    {
      icon: <BanknoteIcon />,
      title: 'Fair Trade+',
      description: 'Guaranteeing 25% higher income than standard market rates.'
    }
  ];

  return (
    <section className="w-full bg-white py-[10vh] md:py-[12vh] px-[6vw] overflow-hidden">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
        {/* ── Left Image Box ── */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[4/3] md:aspect-[1.15] lg:aspect-[0.95] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
        >
          <Image
            src={produceImg}
            alt="Produce Display Rack"
            fill
            className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-700 ease-out"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Floating Elements */}
          <FloatingOrganicCard />
          <HotListLogo />
        </motion.div>

        {/* ── Right Content Box ── */}
        <div className="flex flex-col items-start justify-center">
          {/* Animated Main Title */}
          <div className="overflow-hidden mb-10">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-[Recoleta] font-bold text-[8.5vw] md:text-[5vw] lg:text-[3.8vw] leading-[1.15] text-[#231F20]"
            >
              Freshness Delivered
              <br />
              Straight From Farms
            </motion.h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
