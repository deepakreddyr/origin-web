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
const APP_VERSION = '1.0.6';  // Increment this on each deployment

const clearCacheAndReload = () => {
  if (typeof window === 'undefined') return; // Prevent SSR crash

  const currentVersion = localStorage.getItem('appVersion');
  // console.log("Current app version in storage:", currentVersion);
  // console.log("Latest APP_VERSION:", APP_VERSION);

  if (currentVersion === null || currentVersion !== APP_VERSION) {
    // console.log(`Cache clear: old version=${currentVersion}, new version=${APP_VERSION}`);
    
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }

    sessionStorage.clear();
    localStorage.setItem('appVersion', APP_VERSION);

    setTimeout(() => {
      window.location.reload();
    }, 500);
  } else {
    // console.log("App version matches, no cache clear needed.");
  }
};

export default function App({ Component, pageProps, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const [isGMapLoaded, setIsGMapLoaded] = useAtom(isGMapLoadedAtom);

  useEffect(() => {
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
