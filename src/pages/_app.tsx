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
import { useRouter } from 'next/router';

const APP_VERSION = '1.1.5';  

const clearCacheAndReload = async () => {
  if (typeof window === 'undefined') return;

  const currentVersion = localStorage.getItem('appVersion');
  console.log("Current app version in storage:", currentVersion);
  console.log("Latest APP_VERSION:", APP_VERSION);

  if (currentVersion === null || currentVersion !== APP_VERSION) {
    
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

// --- Invoice Deep Link Handler ---
const handleInvoiceDeepLink = (router: any) => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get('i');
  const forceWeb = urlParams.has('web');
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Block app redirects if invoice parameter exists or web=true
  if (invoiceId || forceWeb) {
    console.log('Invoice deep link detected, blocking app redirects');
    
    // Override common app redirect functions
    const originalReplace = window.location.replace;
    const originalAssign = window.location.assign;
    const originalOpen = window.open;

    window.location.replace = function(url: string | URL) {
      if (typeof url === 'string' && (
        url.includes('app-store') || 
        url.includes('play-store') ||
        url.includes('intent://') ||
        url.startsWith('originfresh://') ||
        url.includes('app')
      )) {
        console.log('App redirect blocked - staying in web for invoice');
        return;
      }
      return originalReplace.call(window.location, url);
    };

    window.location.assign = function(url: string | URL) {
      if (typeof url === 'string' && (
        url.includes('app-store') || 
        url.includes('play-store') ||
        url.includes('intent://') ||
        url.startsWith('originfresh://') ||
        url.includes('app')
      )) {
        console.log('App redirect blocked - staying in web for invoice');
        return;
      }
      return originalAssign.call(window.location, url);
    };

    window.open = function(url?: string | URL, target?: string, features?: string) {
      if (url && typeof url === 'string' && (
        url.startsWith('intent://') || 
        url.startsWith('originfresh://') || 
        url.includes('app-store') ||
        url.includes('play-store')
      )) {
        console.log('App scheme blocked - staying in web for invoice');
        return null;
      }
      return originalOpen.call(window, url, target, features);
    };

    // Add meta tags to prevent app banners
    const preventAppBanner = () => {
      // Remove existing app banners
      const existingMeta = document.querySelector('meta[name="apple-itunes-app"]');
      if (existingMeta) existingMeta.remove();
      
      const existingGoogleMeta = document.querySelector('meta[name="google-play-app"]');
      if (existingGoogleMeta) existingGoogleMeta.remove();

      // Add empty meta tags to prevent app banners
      const appleMetaTag = document.createElement('meta');
      appleMetaTag.name = 'apple-itunes-app';
      appleMetaTag.content = '';
      document.head.appendChild(appleMetaTag);

      const googleMetaTag = document.createElement('meta');
      googleMetaTag.name = 'google-play-app';
      googleMetaTag.content = '';
      document.head.appendChild(googleMetaTag);
    };

    preventAppBanner();

    // Set session storage to remember preference
    if (typeof(Storage) !== "undefined") {
      sessionStorage.setItem('forceWebView', 'true');
      sessionStorage.setItem('invoiceView', 'true');
    }

    // Handle invoice routing
    if (invoiceId && router.pathname === '/') {
      console.log(`Redirecting to invoice page: ${invoiceId}`);
      
      // Clean URL and redirect to invoice page
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('i');
      cleanUrl.searchParams.delete('web');
      
      // Update browser history to clean URL
      window.history.replaceState({}, '', cleanUrl.pathname);
      
      // Navigate to invoice page
      router.push(`/invoice/${invoiceId}`);
    }
  }
};

export default function App({ Component, pageProps, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const [isGMapLoaded, setIsGMapLoaded] = useAtom(isGMapLoadedAtom);
  const router = useRouter();

  useEffect(() => {
    // Run cache clear check first
    clearCacheAndReload();
    
    // Handle invoice deep links after cache check
    const timeoutId = setTimeout(() => {
      handleInvoiceDeepLink(router);
    }, 100); // Small delay to ensure router is ready

    return () => clearTimeout(timeoutId);
  }, [router]);

  // Additional effect to handle route changes and ensure app redirects stay blocked
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasInvoiceParam = urlParams.has('i');
    const hasWebParam = urlParams.has('web');
    
    if (hasInvoiceParam || hasWebParam || sessionStorage.getItem('invoiceView')) {
      // Keep blocking app redirects on route changes
      const blockInterval = setInterval(() => {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
          if (script.innerHTML && (
            script.innerHTML.includes('app-store') || 
            script.innerHTML.includes('play-store') || 
            script.innerHTML.includes('deep-link') ||
            script.innerHTML.includes('intent://')
          )) {
            console.log('Removing app redirect script');
            script.remove();
          }
        });
      }, 1000);

      // Clear interval after 10 seconds
      setTimeout(() => clearInterval(blockInterval), 10000);
    }
  }, [router.pathname]);

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