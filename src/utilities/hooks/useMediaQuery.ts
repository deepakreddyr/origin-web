import { useState, useCallback, useEffect } from 'react';

const useMediaQuery = (width: any) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget: any = useCallback((e: any) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media: any = window.matchMedia(`(max-width: ${width}px)`);
    if (media?.addEventListener) {
      media.addEventListener('change', updateTarget);
    } else {
      media.addListener(updateTarget);
    }
    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }
    return () => {
      if (media?.addEventListener) {
        media.removeEventListener('change', updateTarget);
      } else {
        // Check on unmount (callback is not called until a change occurs)
        media.removeListener('change', updateTarget);
      }
    };
  }, []);

  return targetReached;
};

export { useMediaQuery };
