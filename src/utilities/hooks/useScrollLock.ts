import { useEffect } from 'react';

/**
 * useScrollLock
 *
 * Prevents the page from scrolling when `locked` is true.
 *
 * Technique:
 * - Sets `html.overflow = 'hidden'` to block scroll on the root element
 *   (some browsers scroll on <html>, not <body>).
 * - Sets `body.position = 'fixed'` — the only reliable way to block scroll
 *   on iOS Safari, which ignores overflow:hidden on the body.
 * - Saves and restores the scroll position so the page does not jump on unlock.
 *
 * Usage:
 *   useScrollLock(isModalOpen);
 */
const useScrollLock = (locked: boolean): void => {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;

    // Save existing values to restore on cleanup
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;

    // Apply lock
    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      // Restore previous styles
      html.style.overflow = prevHtmlOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      // Jump back to where the user was before the modal opened
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
};

export default useScrollLock;
