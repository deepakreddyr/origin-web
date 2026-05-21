import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import farmImg from '/public/assets/images/about/farm.webp';

// ── Icons ──
const UsersIcon = () => (
  <svg
    className="w-6 h-6 text-[#7A7570]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ChartIcon = () => (
  <svg
    className="w-6 h-6 text-[#7A7570]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="17" x2="9" y2="9" />
    <line x1="13" y1="17" x2="13" y2="13" />
    <line x1="17" y1="17" x2="17" y2="11" />
  </svg>
);

const SealCheckIcon = () => (
  <svg
    className="w-6 h-6 text-[#7A7570]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2c-.874 0-1.6.516-1.916 1.258a2 2 0 0 1-2.454 1.173c-.83-.277-1.713.118-2.1.848a2 2 0 0 1-1.905 1.905c-.73.387-1.125 1.27-.848 2.1a2 2 0 0 1-1.173 2.454C1.516 10.4 1 11.126 1 12c0 .874.516 1.6 1.258 1.916a2 2 0 0 1 1.173 2.454c-.277.83.118 1.713.848 2.1a2 2 0 0 1 1.905 1.905c.387.73 1.27 1.125 2.1.848a2 2 0 0 1 2.454 1.173C10.4 22.484 11.126 23 12 23c.874 0 1.6-.516 1.916-1.258a2 2 0 0 1 2.454-1.173c.83.277 1.713-.118 2.1-.848a2 2 0 0 1 1.905-1.905c.73-.387 1.125-1.27.848-2.1a2 2 0 0 1 1.173-2.454c.242-.728.758-1.258 1.5-1.584c.73-.387 1.125-1.27.848-2.1a2 2 0 0 1-1.173-2.454a2 2 0 0 1-1.173-2.454c.277-.83-.118-1.713-.848-2.1a2 2 0 0 1-1.905-1.905c-.387-.73-1.27-1.125-2.1-.848a2 2 0 0 1-2.454-1.173C13.6 2.516 12.874 2 12 2z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const FruitIcon = () => (
  <svg
    className="w-6 h-6 text-[#7A7570]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22c4.97 0 9-4.03 9-9 0-3.12-1.56-5.88-3.95-7.53C15.86 4.6 14 3 12 3s-3.86 1.6-5.05 2.47C4.56 7.12 3 9.88 3 13c0 4.97 4.03 9 9 9z" />
    <path d="M12 3v3" />
    <path d="M12 6a4 4 0 0 1 4-4" />
  </svg>
);

// ── Sub-component: StatCard ──
interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label1: string;
  label2?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label1, label2, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className="bg-white rounded-[24px] flex flex-col items-center justify-between p-5 w-[125px] md:w-[135px] lg:w-[142px] h-[175px] md:h-[185px] lg:h-[195px] shrink-0 border border-black/5 hover:-translate-y-1 transition-all duration-300 select-none"
      style={{ boxShadow: '0px 3.41px 3.41px 0px rgba(0, 0, 0, 0.25)' }}
    >
      <div className="flex items-center justify-center pt-2">{icon}</div>
      <div className="flex flex-col items-center justify-center text-center pb-2 w-full">
        <span className="font-[Recoleta] font-bold text-[22px] md:text-[25px] text-[#137A3F] mb-1 leading-none">
          {value}
        </span>
        <div className="flex flex-col items-center leading-tight">
          <span className="font-[SofiaPro] font-bold text-[9px] md:text-[10px] tracking-wider text-[#7A7570] uppercase">
            {label1}
          </span>
          {label2 && (
            <span className="font-[SofiaPro] font-bold text-[9px] md:text-[10px] tracking-wider text-[#7A7570] uppercase">
              {label2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── Sub-component: FloatingFarmerCard ──
const FloatingFarmerCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 bg-white rounded-[20px] shadow-[0_15px_45px_rgba(0,0,0,0.08)] px-6 py-4 flex items-center gap-3 z-10 border border-black/5 select-none"
    >
      <span className="font-[Recoleta] font-bold text-2xl lg:text-3xl text-[#137A3F] leading-none">10K+</span>
      <div className="flex flex-col leading-none">
        <span className="font-[SofiaPro] font-bold text-[10px] tracking-wider text-[#7A7570] uppercase">Partner</span>
        <span className="font-[SofiaPro] font-bold text-[10px] tracking-wider text-[#7A7570] uppercase mt-[2px]">
          Farmers
        </span>
      </div>
    </motion.div>
  );
};

// ── Main Component ──
const FarmingPartners = () => {
  const stats = [
    { icon: <UsersIcon />, value: '10K+', label1: 'Partner', label2: 'Farmers' },
    { icon: <ChartIcon />, value: '100%', label1: 'Transparent' },
    { icon: <SealCheckIcon />, value: 'Fair', label1: 'Pricing' },
    { icon: <FruitIcon />, value: '150+', label1: 'Exotics' }
  ];

  return (
    <section className="w-full bg-[#FEF9E2] py-[10vh] md:py-[12vh] px-[6vw] overflow-hidden">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
        {/* ── Left Content Box ── */}
        <div className="flex flex-col items-start justify-center">
          {/* Animated Main Title */}
          <div className="overflow-hidden mb-6">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-[Recoleta] font-bold text-[9vw] md:text-[5.5vw] lg:text-[4.2vw] leading-[1.1] text-[#FFB600]"
            >
              Good food begins
              <br />
              at the source.
            </motion.h2>
          </div>

          {/* Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col items-start text-left mb-10 w-full"
          >
            <span className="font-[SofiaPro] font-regular text-base md:text-[24px] text-[#00000099] mb-1">
              We work directly with over
            </span>
            <span className="font-[Recoleta] font-bold text-[7.5vw] md:text-[4vw] lg:text-[3.2vw] text-[#137A3F] leading-none mb-5">
              10,000+ farmers
            </span>
            <p className="font-[SofiaPro] font-regular text-[15px] md:text-[24px] text-[#00000099] leading-relaxed max-w-[520px]">
              ensuring every piece of produce is sourced transparently. By cultivating close-knit relationships, we
              guarantee quality and bring you food where every detail is consistent.
            </p>
          </motion.div>

          {/* Statistics Grid */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-4 w-full scrollbar-none">
            {stats.map((stat, i) => (
              <StatCard
                key={stat.label1}
                icon={stat.icon}
                value={stat.value}
                label1={stat.label1}
                label2={stat.label2}
                delay={0.3 + i * 0.1}
              />
            ))}
          </div>
        </div>

        {/* ── Right Image Box ── */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[4/3] md:aspect-[1.15] lg:aspect-[0.95] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
        >
          <Image
            src={farmImg}
            alt="Farmer holding cabbage"
            fill
            className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-700 ease-out"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Floating Card */}
          <FloatingFarmerCard />
        </motion.div>
      </div>
    </section>
  );
};

export default FarmingPartners;
