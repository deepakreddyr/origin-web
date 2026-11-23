import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { body, CREATOR_IMAGES, heading } from './constants';
import { fadeUp, spring, stagger } from './motion';

const Words = ({ text, className }: { text: string; className?: string }) => (
  <span className={className}>
    {text.split(' ').map((word, i) => (
      <motion.span key={i} variants={fadeUp} className="inline-block mr-[0.25em]">
        {word}
      </motion.span>
    ))}
  </span>
);

const tiles = [
  {
    src: CREATOR_IMAGES.hero[0],
    cls: 'col-span-3 row-span-2'
  },
  {
    src: CREATOR_IMAGES.hero[1],
    cls: 'col-span-2'
  },
  { src: CREATOR_IMAGES.hero[2], cls: 'col-span-2' }
];

const CreatorsHero = () => (
  <section className="px-6 pt-10 pb-16 md:pt-12 md:pb-24 overflow-hidden">
    <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
      <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="order-2 md:order-1">
        <h1 className="text-[40px] md:text-[64px] leading-[1.05] text-[#231f20] font-[500]" style={heading}>
          <Words text="Create with Origin." />
          <br />
          <span className="relative inline-block">
            <Words text="Earn with every share." className="text-[#619269]" />
          </span>
        </h1>
        <motion.p
          variants={fadeUp}
          className="mt-8 max-w-[460px] text-[16px] md:text-[18px] leading-[1.6] text-[#231f20]/70"
          style={body}
        >
          An open ecosystem for nano, micro and macro creators. Collaborate, share your own link and grow with fresh
          produce people love.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-3">
          <motion.a
            href="#apply"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            className="group inline-flex items-center justify-center gap-2 bg-[#231f20] text-[#FAF7F0] rounded-full px-8 py-3.5 text-[15px] font-[700]"
            style={body}
          >
            Apply now
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
          </motion.a>
          <motion.a
            href="#how"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            className="text-center border border-[#231f20] text-[#231f20] rounded-full px-8 py-3.5 text-[15px] font-[700] hover:bg-[#fac510]/30 transition-colors"
            style={body}
          >
            See how it works
          </motion.a>
        </motion.div>
      </motion.div>

      <div className="order-1 md:order-2 grid grid-cols-5 grid-rows-2 gap-3 md:gap-4 h-[320px] md:h-[500px] p-4 md:p-2">
        {tiles.map((tile, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: 'easeOut' }}
            className={`${tile.cls} min-h-0 relative`}
          >
            <div className="w-full h-full rounded-[24px] md:rounded-[32px] overflow-hidden">
              <img src={tile.src} alt="" className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CreatorsHero;
