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
import Head from 'next/head';
import GlobalLaunchListener from '@/components/GlobalLaunchListener';
import * as gtag from '@/utilities/gtag';
import { initAnalytics, trackEvent, registerSuperProperties, timeEvent, stopTrackTime } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';
const APP_VERSION = '1.1.6';

// --- Cache Clearing / Version Check ---
const clearCacheAndReload = async () => {
  if (typeof window === 'undefined') return;

  const currentVersion = localStorage.getItem('appVersion');
  // console.log("Current app version in storage:", currentVersion);
  // console.log("Latest APP_VERSION:", APP_VERSION);

  if (currentVersion === null || currentVersion !== APP_VERSION) {
    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
        // console.log('All caches cleared');
      }

      // Clear storage
      sessionStorage.clear();
      localStorage.clear();

      // Set new version
      localStorage.setItem('appVersion', APP_VERSION);
      // console.log('Storage cleared and version updated');

      // Force reload with cache bypass
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cache:', error);
      window.location.reload();
    }
  } else {
    // console.log("App version matches, no cache clear needed.");
  }
};

// --- Invoice Deep Link Handler ---
const handleInvoiceDeepLink = (router: any) => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get('i');
  const forceWeb = urlParams.has('web');

  if (invoiceId || forceWeb) {
    // console.log('Invoice deep link detected, blocking app redirects');

    // Override app redirects
    const originalReplace = window.location.replace;
    const originalAssign = window.location.assign;
    const originalOpen = window.open;

    window.location.replace = function (url: string | URL) {
      if (typeof url === 'string' && /app-store|play-store|intent:\/\/|originfresh:\/\//.test(url)) return;
      return originalReplace.call(window.location, url);
    };

    window.location.assign = function (url: string | URL) {
      if (typeof url === 'string' && /app-store|play-store|intent:\/\/|originfresh:\/\//.test(url)) return;
      return originalAssign.call(window.location, url);
    };

    window.open = function (url?: string | URL, target?: string, features?: string) {
      if (typeof url === 'string' && /intent:\/\/|originfresh:\/\/|app-store|play-store/.test(url)) return null;
      return originalOpen.call(window, url, target, features);
    };

    // Prevent app banners
    const preventAppBanner = () => {
      document.querySelector('meta[name="apple-itunes-app"]')?.remove();
      document.querySelector('meta[name="google-play-app"]')?.remove();

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

    // Store preference in session
    sessionStorage.setItem('forceWebView', 'true');
    sessionStorage.setItem('invoiceView', 'true');

    // Redirect to invoice page
    if (invoiceId && router.pathname === '/') {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('i');
      cleanUrl.searchParams.delete('web');
      window.history.replaceState({}, '', cleanUrl.pathname);
      router.push(`/invoice/${invoiceId}`);
    }
  }
};

// --- Main App ---
export default function App({ Component, pageProps, ...rest }: AppProps) {
  const { store } = wrapper.useWrappedStore(rest);
  const [isGMapLoaded, setIsGMapLoaded] = useAtom(isGMapLoadedAtom);
  const router = useRouter();

  useEffect(() => {
    // Initialize analytics
    initAnalytics();

    // Register store_id super property if already present (returning user)
    if (typeof window !== 'undefined') {
      const storeId = localStorage.getItem('store-id');
      if (storeId) {
        try {
          registerSuperProperties({ store_id: String(JSON.parse(storeId)) });
        } catch {}
      }
    }

    // Clear cache if app version changed
    clearCacheAndReload();

    // Handle invoice deep links
    const timeoutId = setTimeout(() => handleInvoiceDeepLink(router), 100);

    // Resolve a human-readable page name from a URL path
    const resolvePageName = (url: string): string => {
      const path = url.split('?')[0];
      if (path === '/') return 'home';
      if (path === '/shop') return 'shop_all';
      if (path.startsWith('/shop/')) return 'category_page';
      if (path === '/about') return 'about_us';
      if (path.startsWith('/mango')) return 'mango_page';
      if (path === '/delete-account') return 'delete_account_page';
      if (path.startsWith('/invoice/')) return 'invoice_page';
      if (path.startsWith('/search')) return 'search_page';
      // Dynamic PDP route: /[itemName]/[id]
      const segments = path.split('/').filter(Boolean);
      if (segments.length === 2 && !['shop', 'mango', 'about', 'orders'].includes(segments[0])) return 'pdp';
      if (path.startsWith('/orders/')) return 'odp';
      return path.replace(/^\//, '').replace(/\//g, '_') || 'unknown';
    };

    // Track page views
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
      trackEvent(AnalyticsEvents.PAGE_VIEW, {
        page_name: resolvePageName(url)
      });
    };

    // Track initial page load
    trackEvent(AnalyticsEvents.PAGE_VIEW, {
      page_name: resolvePageName(router.asPath)
    });

    // Track first_open
    if (typeof window !== 'undefined') {
      const isFirstOpen = localStorage.getItem('isFirstOpen');
      if (!isFirstOpen) {
        trackEvent(AnalyticsEvents.FIRST_OPEN);
        localStorage.setItem('isFirstOpen', 'true');
      }
    }

    // App Usage timing
    timeEvent(AnalyticsEvents.TRACK_APP_USAGE);

    router.events.on('routeChangeComplete', handleRouteChange);

    // Track offline status
    const handleOffline = () => trackEvent(AnalyticsEvents.NO_INTERNET);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timeoutId);
      router.events.off('routeChangeComplete', handleRouteChange);
      stopTrackTime(AnalyticsEvents.TRACK_APP_USAGE);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  // Block unwanted scripts on route changes
  useEffect(() => {
    if (sessionStorage.getItem('invoiceView')) {
      const blockInterval = setInterval(() => {
        document.querySelectorAll('script').forEach((script) => {
          if (script.innerHTML && /app-store|play-store|deep-link|intent:\/\//.test(script.innerHTML)) {
            script.remove();
            // console.log('Removed app redirect script');
          }
        });
      }, 1000);
      setTimeout(() => clearInterval(blockInterval), 10000);
    }
  }, [router.pathname]);

  return (
    <Provider store={store}>
      <GlobalLaunchListener />
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Head>
          {/* Viewport in _app.tsx as a consistent baseline */}
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta name="facebook-domain-verification" content="q77s4fiszg62fum8j7jzvzfspb43r2" />
        </Head>

        <NextNProgress color="#000" />

        {/* Google Maps */}
        <Script
          id="google-maps"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_KEY}&libraries=places`}
          onLoad={() => setIsGMapLoaded(true)}
        />

        {/* Razorpay */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
          // onLoad={() => console.log('Razorpay script loaded')}
        />

        {/* Google Analytics Script */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-NM914G6V0P" strategy="afterInteractive" />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-NM914G6V0P');
          gtag('config', 'AW-16677565060');
        `}
        </Script>

        <Component {...pageProps} />
      </LocalizationProvider>
    </Provider>
  );
}
