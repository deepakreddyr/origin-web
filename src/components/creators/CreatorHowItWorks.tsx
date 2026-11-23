import React, { useRef } from 'react';
import { motion, MotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { body, heading } from './constants';
import { pop, stagger, viewport } from './motion';

const steps = [
  { title: 'Apply', text: 'Tell us about you and your audience.' },
  { title: 'Get your link', text: 'Once approved, receive your unique referral link.' },
  { title: 'Create & share', text: 'Share on your socials, or collaborate via barter.' },
  { title: 'Earn & unwrap', text: 'Earn commission on sales and get weekly goodies.' }
];

// Connector from this step's circle centre to the next one; fills as the section scrolls into view.
const Connector = ({ progress, index }: { progress: MotionValue<number>; index: number }) => {
  const fill = useTransform(progress, [index / (steps.length - 1), (index + 1) / (steps.length - 1)], [0, 1]);
  return (
    <>
      <span className="md:hidden absolute z-0 left-[21px] top-[22px] -bottom-10 w-[2px] bg-[#231f20]/15" />
      <motion.span
        style={{ scaleY: fill }}
        className="md:hidden absolute z-0 left-[21px] top-[22px] -bottom-10 w-[2px] bg-[#619269] origin-top"
      />
      <span className="hidden md:block absolute z-0 top-[21px] left-[22px] w-[calc(100%+24px)] h-[2px] bg-[#231f20]/15" />
      <motion.span
        style={{ scaleX: fill }}
        className="hidden md:block absolute z-0 top-[21px] left-[22px] w-[calc(100%+24px)] h-[2px] bg-[#619269] origin-left"
      />
    </>
  );
};

const CreatorHowItWorks = () => {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 20 });

  return (
    <section id="how" className="px-6 py-16 md:py-24 bg-white scroll-mt-24">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeading eyebrow="How it works" title="From first hello to first commission" />
        <motion.ol
          ref={ref}
          variants={stagger(0.2)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6"
        >
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex md:block gap-5">
              {i < steps.length - 1 && <Connector progress={progress} index={i} />}
              <motion.span
                variants={pop}
                whileHover={{ scale: 1.2, rotate: 8 }}
                className="relative z-10 shrink-0 w-11 h-11 rounded-full border border-[#231f20] flex items-center justify-center text-[18px] text-[#231f20] bg-[#fac510] md:mb-6 cursor-default"
                style={heading}
              >
                {i + 1}
              </motion.span>
              <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                <p className="text-[22px] text-[#231f20] font-[500]" style={heading}>
                  {step.title}
                </p>
                <p className="mt-2 text-[15px] leading-[1.6] text-[#231f20]/70" style={body}>
                  {step.text}
                </p>
              </motion.div>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
};

export default CreatorHowItWorks;
