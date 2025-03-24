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

export default function App({ Component, pageProps, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const [isGMapLoaded, setIsGMapLoaded] = useAtom(isGMapLoadedAtom);

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
