import { AnalyticsEventName, EventProperties } from './analyticsEvents';

let CleverTap: any = null;

if (typeof window !== 'undefined') {
  CleverTap = require('clevertap-web-sdk');
  if (CleverTap && CleverTap.default) {
    CleverTap = CleverTap.default;
  }
}

/**
 * GENERIC ANALYTICS FACADE
 *
 * This implementation provides a type-safe interface for tracking events across
 * multiple analytics providers.
 */

// ---- CLEVERTAP CONFIG ----
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

// ---- PROVIDER IMPLEMENTATIONS ----

// -- CleverTap Provider --
const CleverTapProvider: AnalyticsProvider = {
  name: 'CleverTap',

  init: () => {
    if (!CleverTap) return;
    if (CLEVERTAP_ACCOUNT_ID) {
      CleverTap.privacy.push({ optOut: false });
      CleverTap.privacy.push({ useIP: false });
      CleverTap.init(CLEVERTAP_ACCOUNT_ID, CLEVERTAP_REGION);
      if (process.env.NODE_ENV === 'development') {
        CleverTap.setLogLevel(3); // 3 = DEBUG
      }
    } else {
      console.warn('[CleverTap] Account ID not found. Set NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID in .env.local');
    }
  },

  /**
   * Identifies the user on CleverTap using onUserLogin.
   * This merges anonymous session data with the identified user profile.
   */
  identify: (userId: string) => {
    if (!CleverTap) return;
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

  /**
   * Sets / updates user profile properties on CleverTap.
   * Maps to CleverTap's profile.push with the "Site" wrapper.
   */
  setProperties: (properties: Record<string, any>) => {
    if (!CleverTap) return;
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

  /**
   * CleverTap does not have a direct "super properties" concept like Mixpanel.
   * We store extra properties in the profile to achieve a similar effect.
   */
  registerSuperProperties: (properties: Record<string, any>) => {
    if (!CleverTap) return;
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

  /**
   * Tracks a custom event on CleverTap using event.push.
   */
  track: (eventName: string, properties: Record<string, any>) => {
    if (!CleverTap) return;
    if (Object.keys(properties).length > 0) {
      CleverTap.event.push(eventName, properties);
    } else {
      CleverTap.event.push(eventName);
    }
  },

  /**
   * CleverTap does not have a built-in "time event" API like Mixpanel.
   * We log a warning in development so this is a no-op.
   */
  timeEvent: (eventName: string) => {
    // CleverTap doesn't natively support Mixpanel's time_event.
  }
};

// ---- ACTIVE PROVIDERS ----
const activeProviders: AnalyticsProvider[] = [CleverTapProvider];

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

/**
 * Identifies the user by phone number or ID.
 */
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

/**
 * Sets user profile properties.
 */
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
 * Core tracking method
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

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Tracked: ${eventName}`, properties);
    }
  }
};

// ---- SPEC-COMPLIANT METHODS ----

/**
 * Track an event with no properties.
 */
export const updateEvent = (eventName: AnalyticsEventName) => {
  trackEvent(eventName as any);
};

/**
 * Track a custom event with no properties.
 */
export const updateCustomEvent = (eventName: string) => {
  trackEvent(eventName as any);
};

/**
 * Track an event with custom properties.
 */
export const updateEventProps = (eventName: AnalyticsEventName, properties: Record<string, any>) => {
  trackEvent(eventName as any, properties as any);
};

/**
 * Start timing an event.
 */
export const timeEvent = (eventName: AnalyticsEventName) => {
  if (typeof window !== 'undefined') {
    activeProviders.forEach((provider) => {
      try {
        provider.timeEvent(eventName);
      } catch (error) {
        console.error(`${provider.name} timeEvent error for ${eventName}:`, error);
      }
    });
  }
};

/**
 * Start timing a screen/session.
 */
export const startTrackTime = (eventName: AnalyticsEventName) => {
  timeEvent(eventName);
};

/**
 * Stop timing and send the timed event.
 */
export const stopTrackTime = (eventName: AnalyticsEventName, properties: Record<string, any> = {}) => {
  trackEvent(eventName as any, properties as any);
};
