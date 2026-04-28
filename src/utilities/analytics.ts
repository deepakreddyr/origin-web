import mixpanel from 'mixpanel-browser';
import { AnalyticsEventName, EventProperties } from './analyticsEvents';

/**
 * GENERIC ANALYTICS FACADE
 *
 * To switch or add new analytics services (e.g. Segment, Amplitude, Clevertap),
 * simply implement the AnalyticsProvider interface and add it to the 'activeProviders' list.
 */

// We still use the Mixpanel token from env
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

interface AnalyticsProvider {
  name: string;
  init: () => void;
  identify: (userId: string) => void;
  setProperties: (properties: Record<string, any>) => void;
  registerSuperProperties: (properties: Record<string, any>) => void;
  track: (eventName: string, properties: Record<string, any>) => void;
}

// ---- PROVIDER IMPLEMENTATIONS ----

const MixpanelProvider: AnalyticsProvider = {
  name: 'Mixpanel',
  init: () => {
    if (MIXPANEL_TOKEN) {
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: true,
        persistence: 'localStorage',
        api_host: 'https://api-eu.mixpanel.com'
      });
    } else {
      console.warn('Mixpanel Token not found.');
    }
  },
  identify: (userId) => mixpanel.identify(userId),
  setProperties: (properties) => mixpanel.people.set(properties),
  registerSuperProperties: (properties) => mixpanel.register(properties),
  track: (eventName, properties) => mixpanel.track(eventName, properties)
};

// Example of another provider
/*
const OtherSDKProvider: AnalyticsProvider = {
    name: 'OtherSDK',
    init: () => { ... },
    identify: (userId) => { ... },
    ...
};
*/

// ---- ACTIVE PROVIDERS ----
// Comment/Uncomment providers here to enable/disable them globally
const activeProviders: AnalyticsProvider[] = [
  MixpanelProvider
  // OtherSDKProvider
];

// ---- GENERIC ANALYTICS EXPORTS ----

export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    activeProviders.forEach((provider) => {
      try {
        provider.init();
      } catch (err) {
        console.error(`${provider.name} init error:`, err);
      }
    });
  }
};

export const identifyUser = (userId: string) => {
  if (typeof window !== 'undefined') {
    activeProviders.forEach((provider) => {
      try {
        provider.identify(userId);
      } catch (err) {
        console.error(`${provider.name} identify error:`, err);
      }
    });
  }
};

export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    activeProviders.forEach((provider) => {
      try {
        provider.setProperties(properties);
      } catch (err) {
        console.error(`${provider.name} setProperties error:`, err);
      }
    });
  }
};

export const registerSuperProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    activeProviders.forEach((provider) => {
      try {
        provider.registerSuperProperties(properties);
      } catch (err) {
        console.error(`${provider.name} registerSuperProperties error:`, err);
      }
    });
  }
};

/**
 * Track an event across all active analytics providers
 */
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
        console.error(`${provider.name} track error for ${eventName}:`, error);
      }
    });

    if (activeProviders.length === 0 && process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Simulation] Tracked: ${eventName}`, properties);
    }
  }
};
