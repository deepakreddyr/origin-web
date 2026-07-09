import { AnalyticsEventName, EventProperties } from './analyticsEvents';

let CleverTap: any = null;

if (typeof window !== 'undefined') {
  CleverTap = require('clevertap-web-sdk');
  if (CleverTap && CleverTap.default) {
    CleverTap = CleverTap.default;
  }
}

const CLEVERTAP_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID;
const CLEVERTAP_REGION = process.env.NEXT_PUBLIC_CLEVERTAP_REGION || '';

const CLEVERTAP_MSG_PREFERENCES = {
  'MSG-email': true,
  'MSG-sms': true,
  'MSG-whatsapp': true
};

const getAddressProperties = () => {
  if (typeof window === 'undefined') return {};
  try {
    const addressFromLs = localStorage.getItem('selected_address');
    if (addressFromLs) {
      const parsed = JSON.parse(addressFromLs);
      if (parsed) {
        const lat = parsed.latitude !== undefined && parsed.latitude !== null ? Number(parsed.latitude) : undefined;
        const lng = parsed.longitude !== undefined && parsed.longitude !== null ? Number(parsed.longitude) : undefined;
        return {
          ...(lat !== undefined && !isNaN(lat) ? { lat } : {}),
          ...(lng !== undefined && !isNaN(lng) ? { lng } : {}),
          ...(parsed.address ? { address: parsed.address } : {})
        };
      }
    }
  } catch (error) {
    // console.error(error);
  }
  return {};
};

interface AnalyticsProvider {
  name: string;
  init: () => void;
  identify: (userId: string) => void;
  setProperties: (properties: Record<string, any>) => void;
  registerSuperProperties: (properties: Record<string, any>) => void;
  track: (eventName: string, properties: Record<string, any>) => void;
  timeEvent: (eventName: string) => void;
}

const CleverTapProvider: AnalyticsProvider = {
  name: 'CleverTap',
  init: () => {
    if (!CleverTap) {
      // console.warn('[CleverTap] SDK not found during init');
      return;
    }
    if (CLEVERTAP_ACCOUNT_ID) {
      // console.log(`[CleverTap] Initializing with Account ID: ${CLEVERTAP_ACCOUNT_ID}, Region: ${CLEVERTAP_REGION}`);
      CleverTap.privacy.push({ optOut: false });
      CleverTap.privacy.push({ useIP: false });
      CleverTap.init(CLEVERTAP_ACCOUNT_ID, CLEVERTAP_REGION);
      // CleverTap.setLogLevel(3); // Set to 3 for verbose CleverTap debug logs
    } else {
      // console.warn('[CleverTap] Account ID not found. Set NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID in .env.local');
    }
  },
  identify: (userId: string) => {
    if (!CleverTap) return;
    // console.log(`[CleverTap] Identify User: ${userId}`);
    const addressProps = getAddressProperties();
    if (addressProps.lat !== undefined && addressProps.lng !== undefined) {
      try {
        CleverTap.getLocation(addressProps.lat, addressProps.lng);
      } catch (err) {
        // console.error(err);
      }
    }
    CleverTap.onUserLogin.push({
      Site: {
        Identity: userId,
        ...addressProps,
        ...CLEVERTAP_MSG_PREFERENCES
      }
    });
  },
  setProperties: (properties: Record<string, any>) => {
    if (!CleverTap) return;
    // console.log('[CleverTap] Set Properties:', properties);
    const addressProps = getAddressProperties();
    const mergedProps = {
      ...addressProps,
      ...properties
    };
    if (mergedProps.lat !== undefined && mergedProps.lng !== undefined) {
      try {
        CleverTap.getLocation(mergedProps.lat, mergedProps.lng);
      } catch (err) {
        // console.error(err);
      }
    }
    CleverTap.profile.push({
      Site: {
        ...mergedProps,
        ...CLEVERTAP_MSG_PREFERENCES
      }
    });
  },
  registerSuperProperties: (properties: Record<string, any>) => {
    if (!CleverTap) return;
    // console.log('[CleverTap] Register Super Properties:', properties);
    const addressProps = getAddressProperties();
    const mergedProps = {
      ...addressProps,
      ...properties
    };
    if (mergedProps.lat !== undefined && mergedProps.lng !== undefined) {
      try {
        CleverTap.getLocation(mergedProps.lat, mergedProps.lng);
      } catch (err) {
        // console.error(err);
      }
    }
    CleverTap.profile.push({
      Site: {
        ...mergedProps,
        ...CLEVERTAP_MSG_PREFERENCES
      }
    });
  },
  track: (eventName: string, properties: Record<string, any>) => {
    if (!CleverTap) return;
    // console.log(`[CleverTap] Track Event: ${eventName}`, properties);
    if (Object.keys(properties).length > 0) {
      CleverTap.event.push(eventName, properties);
    } else {
      CleverTap.event.push(eventName);
    }
  },
  timeEvent: (eventName: string) => {
    // CleverTap does not natively support timeEvent
  }
};

const activeProviders: AnalyticsProvider[] = [CleverTapProvider];

export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    activeProviders.forEach((provider) => provider.init());
  }
};

export const identifyUser = (userId: string) => {
  if (typeof window !== 'undefined') {
    activeProviders.forEach((provider) => provider.identify(userId));
  }
};

export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    activeProviders.forEach((provider) => provider.setProperties(properties));
  }
};

export const registerSuperProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    activeProviders.forEach((provider) => provider.registerSuperProperties(properties));
  }
};

export const trackEvent = <T extends AnalyticsEventName>(
  eventName: T,
  ...propertiesArg: EventProperties[T] extends Record<string, never>
    ? [properties?: Record<string, never>]
    : [properties: EventProperties[T]]
) => {
  if (typeof window !== 'undefined') {
    const properties = propertiesArg[0] || {};
    activeProviders.forEach((provider) => {
      try {
        provider.track(eventName, properties);
      } catch (error) {
        // console.error(`${provider.name} track error for ${eventName}:`, error);
      }
    });

    // console.log(`[Analytics] Tracked: ${eventName}`, properties);
  }
};

export const timeEvent = (eventName: string) => {
  if (typeof window !== 'undefined') {
    activeProviders.forEach((provider) => provider.timeEvent(eventName));
  }
};

export const stopTrackTime = (eventName: string) => {
  // CleverTap does not natively support stopTrackTime
};
