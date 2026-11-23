import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWaitlist } from '@/hooks/useWaitlist';
import { NotifyToast } from './UOMPopup';

interface WaitlistButtonProps {
  itemId: number;
  isWaitlist?: boolean;
  size?: 'card' | 'pdp';
}

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-[1em] h-[1em] flex-shrink-0">
    <motion.path
      d="M3.5 8.5l3 3 6-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    />
  </svg>
);

const Spinner = () => (
  <motion.span
    className="inline-block w-[1em] h-[1em] rounded-full border-2 border-current border-t-transparent"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
  />
);

const WaitlistButton: FC<WaitlistButtonProps> = ({ itemId, isWaitlist, size = 'card' }) => {
  const { isWaitlisted, loading, join, showAlreadyAdded, toast, closeToast } = useWaitlist(itemId, isWaitlist);

  const isPdp = size === 'pdp';
  const buttonSize = isPdp
    ? 'text-sm px-4 py-2'
    : 'text-[.85vw] mob:text-[2.9vw] h-[2.2vw] mob:h-[7.5vw] px-[1.2vw] mob:px-[2.8vw]';
  const tickSize = isPdp ? 'w-9 h-9' : 'w-[2.2vw] h-[2.2vw] mob:w-[7.5vw] mob:h-[7.5vw]';

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {isWaitlisted ? (
          <motion.div
            key="added"
            role="button"
            aria-label="Item added to waitlist"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              showAlreadyAdded();
            }}
            data-testid="waitlist-added"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className={`inline-flex items-center justify-center cursor-pointer rounded-full bg-[#E8F4EA] text-[#146321] text-[0.9rem] ${tickSize}`}
          >
            <CheckIcon />
          </motion.div>
        ) : (
          <motion.button
            key="join"
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              join();
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`inline-flex items-center justify-center gap-1 rounded-full border-[1.5px] border-[#146321] text-[#146321] font-[SofiaPro] font-bold whitespace-nowrap transition-colors hover:bg-[#146321] hover:text-white disabled:opacity-70 disabled:pointer-events-none ${buttonSize}`}
          >
            {loading && <Spinner />}
            <span>Join waitlist</span>
          </motion.button>
        )}
      </AnimatePresence>
      <NotifyToast isVisible={toast.visible} message={toast.message} type={toast.type} compact onClose={closeToast} />
    </>
  );
};

export default WaitlistButton;
