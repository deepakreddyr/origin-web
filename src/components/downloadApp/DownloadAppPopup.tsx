import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DownloadAppWrapper from './DownloadAppWrapper';

const DownloadAppPopup: React.FC = () => {
  const [showDownloadApp, setShowDownloadApp] = useState(false);
  const router = useRouter();
  const { query, isReady } = router;

  useEffect(() => {
    if (!isReady) return;

    // Don't show if we're already in the app
    if (query.type === 'app') return;

    const timer = setTimeout(() => {
      try {
        // Check if shown in this session
        const hasSeenInSession = sessionStorage.getItem('downloadAppPopupShown');

        // Also check localStorage as a fallback or if we want to be more persistent
        // (but user said "visit", so sessionStorage is more appropriate)
        if (!hasSeenInSession) {
          setShowDownloadApp(true);
        }
      } catch (error) {
        console.error('Error accessing sessionStorage:', error);
      }
    }, 2000); // Wait 2 seconds before showing

    return () => clearTimeout(timer);
  }, [isReady, query.type]);

  const handleClose = () => {
    setShowDownloadApp(false);
    try {
      sessionStorage.setItem('downloadAppPopupShown', 'true');
    } catch (error) {
      console.error('Error setting sessionStorage:', error);
    }
  };

  if (!showDownloadApp) return null;

  return <DownloadAppWrapper onClose={handleClose} />;
};

export default DownloadAppPopup;
