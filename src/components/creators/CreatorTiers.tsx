import React, { useEffect, useRef } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { body, heading } from './constants';
import { fadeUp, stagger, viewport } from './motion';

const tiers = [
  {
    name: 'Nano',
    nick: 'The Neighbourhood Favourite',
    from: '1K – ',
    end: 10,
    suffix: 'K',
    fill: 0.33,
    note: 'Small, loyal communities with real trust.'
  },
  {
    name: 'Micro',
    nick: 'The Niche Whisperer',
    from: '10K – ',
    end: 100,
    suffix: 'K',
    fill: 0.66,
    note: 'Niche voices with high engagement.'
  },
  {
    name: 'Macro',
    nick: 'The Megaphone',
    from: '',
    end: 100,
    suffix: 'K+',
    fill: 1,
    note: 'Wide reach to spread the Origin story.'
  }
];

const CountUp = ({ end }: { end: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, end, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => (node.textContent = String(Math.round(v)))
    });
    return () => controls.stop();
  }, [inView, end]);
  return <span ref={ref}>0</span>;
};

const Ring = ({ fill }: { fill: number }) => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 -rotate-90">
    <circle cx="20" cy="20" r="16" fill="none" stroke="#231f20" strokeOpacity="0.1" strokeWidth="4" />
    <motion.circle
      cx="20"
      cy="20"
      r="16"
      fill="none"
      stroke="#619269"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: fill }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    />
  </svg>
);

const CreatorTiers = () => (
  <section className="px-6 py-16 md:py-24 bg-white">
    <div className="max-w-[1200px] mx-auto">
      <SectionHeading
        eyebrow="Any size, any niche"
        title="Big reach, small circle, brand new? Pull up a chair."
        subtitle="We back creators who care, not just creators with counts."
      />
      <motion.div
        variants={stagger(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-12 grid gap-4 md:grid-cols-3"
      >
        {tiers.map((tier, i) => (
          <motion.div key={tier.name} variants={fadeUp}>
            <motion.div
              whileHover={{ y: -8, rotate: i % 2 ? 1.2 : -1.2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 16 }}
              className="h-full border border-[#231f20]/15 rounded-[24px] p-7 md:p-8 bg-[#FAF7F0] hover:bg-[#fac510]/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <p className="text-[34px] text-[#231f20] font-[500]" style={heading}>
                  {tier.name}
                </p>
                <Ring fill={tier.fill} />
              </div>
              <p className="text-[13px] italic text-[#619269]" style={body}>
                {tier.nick}
              </p>
              <p className="mt-5 text-[28px] text-[#231f20] font-[500]" style={heading}>
                {tier.from}
                <CountUp end={tier.end} />
                {tier.suffix}
                <span className="ml-2 text-[13px] text-[#231f20]/50" style={body}>
                  followers
                </span>
              </p>
              <p className="mt-3 text-[15px] leading-[1.6] text-[#231f20]/70" style={body}>
                {tier.note}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default CreatorTiers;
