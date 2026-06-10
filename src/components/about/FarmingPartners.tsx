import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// ── Sub-component: StatCard ──
interface StatCardProps {
  icon: string;
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
      className="bg-white rounded-[18px] flex flex-col items-start w-full h-[190px] pt-[36px] pb-[36px] px-[20px] gap-[20px] shrink-0 border border-black/5 hover:-translate-y-1 transition-all duration-300 select-none"
      style={{ boxShadow: '0px 3.41px 3.41px 0px rgba(0, 0, 0, 0.25)' }}
    >
      <div className={`relative w-7 h-7 shrink-0`}>
        <Image src={icon} alt="" fill className="object-contain object-left" />
      </div>
      <div className="flex flex-col items-start text-left w-full gap-[4px]">
        <span className="font-[Recoleta] font-semibold mb-[0.5vw] text-[22px] md:text-[33.75px] text-[#008945] leading-none">
          {value}
        </span>
        <div className="flex flex-col items-start leading-tight">
          <span className="font-[SofiaPro] font-regular text-[9px] md:text-[11.5px] tracking-wider text-[#00000099] uppercase">
            {label1}
          </span>
          {label2 && (
            <span className="font-[SofiaPro] font-regular text-[9px] md:text-[11.5px] tracking-wider text-[#00000099] uppercase">
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
      className="absolute bottom-0 right-[-60px] bottom-[-35px] bg-white rounded-[18px] flex items-center z-10 border border-black/5 select-none"
      style={{
        width: '292px',
        height: '117px',
        paddingTop: '36px',
        paddingBottom: '36px',
        paddingLeft: '45px',
        paddingRight: '45px',
        gap: '18px',
        boxShadow: '0px 3.41px 3.41px 0px rgba(0, 0, 0, 0.25)'
      }}
    >
      <span className="font-[Recoleta] font-medium text-[40.5px] text-[#008945] leading-none shrink-0">10K+</span>
      <div className="flex flex-col leading-none gap-[2px]">
        <span className="font-[SofiaPro] font-regular text-[18px] tracking-wider text-[#9F9F9F] uppercase">
          Partner
        </span>
        <span className="font-[SofiaPro] font-regular text-[18px] tracking-wider text-[#9F9F9F] uppercase">
          Farmers
        </span>
      </div>
    </motion.div>
  );
};

// ── Main Component ──
const FarmingPartners = () => {
  const stats = [
    { icon: '/assets/icons/FarmingPartners1.svg', value: '10K+', label1: 'Partner', label2: 'Farmers' },
    { icon: '/assets/icons/FarmingPartners2.svg', value: '100%', label1: 'Transparent' },
    { icon: '/assets/icons/FarmingPartners3.svg', value: 'Fair', label1: 'Pricing' },
    { icon: '/assets/icons/FarmingPartners4.svg', value: '150+', label1: 'Exotics' }
  ];

  return (
    <section className="w-full bg-[#FFF8D5] py-[10vh] md:py-[12vh] px-[6vw] overflow-hidden">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center">
        {/* ── Left Content Box ── */}
        <div className="flex flex-col items-start justify-center">
          {/* Animated Main Title */}
          <div className="overflow-hidden mb-6">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-[Recoleta] font-bold text-[9vw] md:text-[5.5vw] lg:text-[64px] leading-[1.1] text-[#FFB600]"
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
            <span className="font-[Recoleta] font-bold text-[7.5vw] md:text-[4vw] lg:text-[3.2vw] text-[#008945] leading-none mt-3">
              10,000+ farmers
            </span>
            <p
              className="font-[SofiaPro] text-[#00000099] max-w-[550px]"
              style={{ fontWeight: 400, fontSize: '24px', lineHeight: '29.3px', letterSpacing: '0px' }}
            >
              ensuring every piece of produce is sourced transparently. By cultivating close-knit relationships, we
              guarantee quality and bring you food where every detail is consistent.
            </p>
          </motion.div>

          {/* Statistics Grid */}
          <div className="flex overflow-x-auto lg:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0 w-full scrollbar-none lg:grid lg:grid-cols-[repeat(4,127px)] h-auto lg:h-[227px] pt-[18px] pr-[19px] pb-[18px] pl-[4px] gap-[9px]">
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
        <div className="relative w-full mt-[18px] lg:mt-0 lg:self-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full rounded-[32px] md:rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] aspect-[4/3] lg:aspect-auto lg:h-[675px]"
          >
            <video
              src="/assets/videos/aboutvideo.mp4"
              className="object-cover w-full h-full"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </motion.div>
          {/* Floating Card — outside overflow-hidden, hangs off bottom-right */}
          <FloatingFarmerCard />
        </div>
      </div>
    </section>
  );
};

export default FarmingPartners;
