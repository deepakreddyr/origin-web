import React, { useRef, useId } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ProcessLineProps {
  d: string;
  width: number;
  height: number;
  viewBox: string;
  strokeWidth: number;
  className?: string;
  id?: string;
}

const ProcessLine: React.FC<ProcessLineProps> = ({ d, width, height, viewBox, strokeWidth, className, id }) => {
  const ref = useRef<HTMLDivElement>(null);
  const uniqueId = useId();
  const maskId = id || `mask-${uniqueId}`;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 45%']
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={className}>
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
      >
        <mask id={maskId}>
          <motion.path d={d} stroke="white" strokeWidth={strokeWidth + 2} fill="none" style={{ pathLength }} />
        </mask>
        <path d={d} stroke="#fac510" strokeWidth={strokeWidth} strokeDasharray="14 14" mask={`url(#${maskId})`} />
      </svg>
    </div>
  );
};

export default ProcessLine;
