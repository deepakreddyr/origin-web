import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { body, CREATOR_IMAGES } from './constants';
import { stagger, viewport } from './motion';

const picks = ['Consistent, quality content', 'Genuine engagement with your audience', 'Active affiliate sharing'];

const sparkles = [
  { cls: 'top-6 left-6', size: 22, delay: 0 },
  { cls: 'top-1/3 right-6', size: 16, delay: 0.6 },
  { cls: 'bottom-8 left-1/3', size: 26, delay: 1.2 }
];

const CreatorGoodies = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <section className="px-6 py-16 md:py-24">
      <div
        ref={ref}
        className="max-w-[1200px] mx-auto bg-[#DDEEDD] rounded-[32px] md:rounded-[48px] overflow-hidden grid md:grid-cols-2 items-center"
      >
        <div className="relative h-[260px] md:h-[480px] bg-[#CFE6D2] overflow-hidden">
          <motion.img
            src={CREATOR_IMAGES.goodies}
            alt="Weekly goody bag"
            style={{ y, rotate, scale: 1.15 }}
            className="w-full h-full object-cover"
          />
          {sparkles.map((s, i) => (
            <motion.span
              key={i}
              className={`absolute ${s.cls} text-[#fac510]`}
              animate={{ scale: [0.6, 1.2, 0.6], rotate: [0, 90, 180], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: s.delay }}
            >
              <Sparkles size={s.size} fill="#fac510" />
            </motion.span>
          ))}
        </div>
        <div className="p-8 md:p-14">
          <SectionHeading
            align="left"
            eyebrow="Weekly goodies"
            title="A little something, every week"
            subtitle="Each week we send goody bags to selected creators, a thank-you for showing up consistently."
          />
          <motion.ul
            variants={stagger(0.15, 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="mt-8 space-y-3"
            style={body}
          >
            {picks.map((pick) => (
              <motion.li
                key={pick}
                variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}
                className="flex items-center gap-3 text-[15px] text-[#231f20]"
              >
                <span className="w-2 h-2 rounded-full bg-[#231f20]" />
                {pick}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
};

export default CreatorGoodies;
