import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Handshake, Link2, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { body, heading } from './constants';
import { fadeUp, stagger, viewport } from './motion';

const benefits = [
  {
    icon: Handshake,
    title: 'Creator Partnerships',
    tag: "Let's build something",
    text: 'Long-term partnerships open to nano, micro and macro creators.',
    hover: '#DDEEDD'
  },
  {
    icon: Sparkles,
    title: 'Barter Collaborations',
    tag: 'Your content, our produce',
    text: 'Collaborate with us through barter: fresh produce in exchange for your content.',
    hover: '#fac510'
  },
  {
    icon: Link2,
    title: 'Affiliate Marketing',
    tag: 'Your link, your cut',
    text: 'Get a unique referral link to share anywhere and earn commission on every sale.',
    hover: '#CFE6D2'
  },
  {
    icon: Gift,
    title: 'Weekly Goodies',
    tag: "Surprise, it's fruit",
    text: 'Selected creators receive weekly goody bags for consistent collaborations.',
    hover: '#fac510',
    bounce: true
  }
];

const CreatorBenefits = () => (
  <section className="px-6 py-16 md:py-24">
    <div className="max-w-[1200px] mx-auto">
      <SectionHeading eyebrow="The good stuff" title="Make content. Make money. Get snacks." />
      <motion.div
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {benefits.map(({ icon: Icon, title, tag, text, hover, bounce }) => (
          <motion.div key={title} variants={fadeUp}>
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={{ rest: { y: 0, backgroundColor: '#ffffff' }, hover: { y: -8, backgroundColor: hover } }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="h-full border border-[#231f20]/10 rounded-[24px] p-7 cursor-default"
            >
              <motion.div
                variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: [0, -14, 14, -8, 0], scale: 1.15 } }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-full bg-white/80 border border-[#231f20]/10 flex items-center justify-center"
              >
                <motion.span
                  animate={bounce ? { y: [0, -4, 0] } : undefined}
                  transition={bounce ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : undefined}
                  className="flex"
                >
                  <Icon size={22} className="text-[#231f20]" strokeWidth={1.6} />
                </motion.span>
              </motion.div>
              <p className="mt-6 text-[22px] leading-[1.2] text-[#231f20] font-[500]" style={heading}>
                {title}
              </p>
              <p className="mt-1 text-[13px] italic text-[#231f20]/60" style={body}>
                {tag}
              </p>
              <p className="mt-3 text-[15px] leading-[1.6] text-[#231f20]/70" style={body}>
                {text}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default CreatorBenefits;
