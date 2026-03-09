import React, { useEffect, useRef, ReactNode, CSSProperties } from 'react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number; // in ms
  duration?: number; // in ms
  threshold?: number; // 0-1
  once?: boolean; // only animate once
  className?: string;
  style?: CSSProperties;
}

const TRANSLATE_MAP: Record<RevealDirection, string> = {
  up: 'translateY(40px)',
  down: 'translateY(-40px)',
  left: 'translateX(50px)',
  right: 'translateX(-50px)',
  fade: 'translateY(0px)'
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'left',
  delay = 0,
  duration = 600,
  threshold = 0.05,
  once = true,
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = TRANSLATE_MAP[direction];
    el.style.transition = `opacity ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`;
    el.style.willChange = 'opacity, transform';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) translateX(0)';
            if (once) {
              observer.unobserve(el);
              // After animation completes, clear transform and willChange.
              // This prevents a new CSS stacking context from trapping
              // position:fixed children (like modals) inside this element.
              setTimeout(
                () => {
                  el.style.transform = '';
                  el.style.willChange = '';
                  el.style.transition = '';
                },
                duration + delay + 50
              );
            }
          } else if (!once) {
            el.style.willChange = 'opacity, transform';
            el.style.transition = `opacity ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`;
            el.style.opacity = '0';
            el.style.transform = TRANSLATE_MAP[direction];
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, delay, duration, threshold, once]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export default ScrollReveal;
