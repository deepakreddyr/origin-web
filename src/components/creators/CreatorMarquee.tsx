import React from 'react';
import { heading } from './constants';

const words = ['Barter', 'Affiliate', 'Weekly goodies', 'Nano', 'Micro', 'Macro', 'Your link', 'Your cut'];

const Group = ({ hidden }: { hidden?: boolean }) => (
  <div
    aria-hidden={hidden}
    className="flex shrink-0 min-w-full items-center justify-around gap-10 pr-10 animate-infinite-scroll motion-reduce:animate-none"
    style={{ animationDuration: '30s' }}
  >
    {words.map((word, i) => (
      <span key={i} className="flex items-center gap-10 text-[22px] md:text-[28px] whitespace-nowrap" style={heading}>
        {word}
        <span className="text-[#fac510]">✦</span>
      </span>
    ))}
  </div>
);

const CreatorMarquee = () => (
  <div className="bg-[#231f20] text-[#FAF7F0] py-4 md:py-5 overflow-hidden flex">
    <Group />
    <Group hidden />
  </div>
);

export default CreatorMarquee;
