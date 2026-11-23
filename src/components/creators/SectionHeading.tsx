import React from 'react';
import { motion } from 'framer-motion';
import { body, heading } from './constants';
import { fadeUp, stagger, viewport } from './motion';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionHeading = ({ eyebrow, title, subtitle, align = 'center' }: SectionHeadingProps) => (
  <motion.div
    variants={stagger(0.12)}
    initial="hidden"
    whileInView="show"
    viewport={viewport}
    className={`max-w-[680px] ${align === 'center' ? 'mx-auto text-center' : ''}`}
  >
    <motion.p
      variants={fadeUp}
      className="text-[12px] tracking-[0.18em] uppercase text-[#619269] font-[700] mb-3"
      style={body}
    >
      {eyebrow}
    </motion.p>
    <motion.h2
      variants={fadeUp}
      className="text-[30px] md:text-[44px] leading-[1.15] text-[#231f20] font-[500]"
      style={heading}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        variants={fadeUp}
        className="mt-4 text-[15px] md:text-[17px] leading-[1.6] text-[#231f20]/70"
        style={body}
      >
        {subtitle}
      </motion.p>
    )}
  </motion.div>
);

export default SectionHeading;
