import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollUnderlineProps {
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
  offset?: [string, string]; // [start, end] scroll offsets
}

const ScrollUnderline: React.FC<ScrollUnderlineProps> = ({
  children,
  className = '',
  underlineColor = '#E18D1F',
  offset = ['start 80%', 'start 40%'] as any
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      <svg
        width="100%"
        height="14"
        viewBox="0 0 100 14"
        preserveAspectRatio="none"
        className="absolute left-0 -bottom-[10%] pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <motion.path
          d="M 2 10 C 20 12, 80 12, 98 10"
          fill="transparent"
          stroke={underlineColor}
          strokeWidth="8"
          strokeLinecap="round"
          style={{ pathLength, opacity }}
        />
      </svg>
    </span>
  );
};

export default ScrollUnderline;
