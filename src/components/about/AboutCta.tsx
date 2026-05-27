import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const AboutCta = () => {
  return (
    <section
      className="w-full relative overflow-hidden flex flex-col items-center justify-center border-b-[10px] border-[#FFB600]"
      style={{
        backgroundColor: '#FCF9F4',
        height: '604.58px'
      }}
    >
      {/* Top Right Gradient */}
      <div
        className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle, rgba(255,182,0,0.3) 0%, rgba(255,236,179,0.15) 75%, rgba(252,249,244,0) 100%)'
        }}
      />

      {/* Bottom Left Gradient */}
      <div
        className="absolute bottom-[-100px] left-[-100px] w-[450px] h-[450px] rounded-full pointer-events-none z-0 opacity-75"
        style={{
          background:
            'radial-gradient(circle, rgba(255,182,0,0.2) 0%, rgba(255,248,225,0.1) 75%, rgba(252,249,244,0) 100%)'
        }}
      />

      {/* Backdrop Blur Layer */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ backdropFilter: 'blur(64px)', WebkitBackdropFilter: 'blur(64px)' }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col items-center select-none px-6">
        {/* Heading */}
        <div className="overflow-hidden mb-5">
          <motion.h2
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-[Recoleta] font-semibold text-center text-black text-[8.5vw] md:text-[64px] leading-[1.1] md:leading-[70.4px] tracking-[-0.5px] md:tracking-[-1.28px]"
          >
            The future of food is fresh, fair,
            <br className="hidden md:inline" />
            and direct.
          </motion.h2>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="font-[SofiaPro] font-normal text-center text-black text-[4.5vw] md:text-[24px] leading-[1.35] md:leading-[29.25px] mb-8 max-w-[890px]"
          style={{ fontFamily: 'SofiaPro' }}
        >
          Join our mission to transform the way we eat and support the hands that feed us.
          <br className="hidden md:inline" />
          Your subscription directly fuels sustainable farming practices.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <Link href="/shop" passHref legacyBehavior>
            <a className="inline-block bg-[#FFB600] hover:bg-[#FFC107] text-black font-[SofiaPro] font-bold text-sm md:text-base px-8 py-4 rounded-full shadow-[0px_4px_15px_rgba(255,182,0,0.15)] hover:shadow-[0px_6px_25px_rgba(255,182,0,0.3)] hover:-translate-y-[2px] transition-all duration-300 cursor-pointer">
              Explore Our Harvest
            </a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutCta;
