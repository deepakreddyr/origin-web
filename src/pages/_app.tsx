import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import Script from 'next/script';
import NextNProgress from 'nextjs-progressbar';
import { useAtom } from 'jotai';
import { isGMapLoadedAtom } from '@/context/global';
import { Provider } from 'react-redux';
import { wrapper } from '@/store/store';
import { useEffect } from 'react';

// --- Cache clear utility ---
const APP_VERSION = '1.1.2';  // Increment this on each deployment

const clearCacheAndReload = async () => {
  if (typeof window === 'undefined') return; // Prevent SSR crash

  const currentVersion = localStorage.getItem('appVersion');
  console.log("Current app version in storage:", currentVersion);
  console.log("Latest APP_VERSION:", APP_VERSION);

  if (currentVersion === null || currentVersion !== APP_VERSION) {
    // console.log(`Cache clear: old version=${currentVersion}, new version=${APP_VERSION}`);
    
    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('All caches cleared');
      }

      // Clear storage
      sessionStorage.clear();
      localStorage.clear(); // Clear everything first
      
      // Set new version
      localStorage.setItem('appVersion', APP_VERSION);
      
      console.log('Storage cleared and version updated');
      
      // Force reload with cache bypass
      window.location.reload();
      
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Fallback: just reload
      window.location.reload();
    }
  } else {
    console.log("App version matches, no cache clear needed.");
  }
};

export default function App({ Component, pageProps, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const [isGMapLoaded, setIsGMapLoaded] = useAtom(isGMapLoadedAtom);

  useEffect(() => {
    // Run cache clear check immediately
    clearCacheAndReload();
  }, []);

  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <NextNProgress color="#000" />
        <Script
          id="google-maps"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_KEY}&libraries=places`}
          onLoad={() => setIsGMapLoaded(true)}
        />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
          onLoad={() => console.log('Razorpay script loaded')}
        />
        <Component {...pageProps} />
      </LocalizationProvider>
    </Provider>
  );
}