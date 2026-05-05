import mixpanel from 'mixpanel-browser';
import { AnalyticsEventName, EventProperties } from './analyticsEvents';

/**
 * GENERIC ANALYTICS FACADE
 *
 * This implementation provides a type-safe interface for tracking events across
 * multiple analytics providers.
 */

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const MIXPANEL_URL = process.env.NEXT_PUBLIC_MIXPANEL_URL;

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

const MixpanelProvider: AnalyticsProvider = {
  name: 'Mixpanel',
  init: () => {
    if (MIXPANEL_TOKEN) {
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: false,
        persistence: 'localStorage',
        api_host: MIXPANEL_URL
      });
    } else {
      console.warn('Mixpanel Token not found.');
    }
  },
  identify: (userId) => mixpanel.identify(userId),
  setProperties: (properties) => mixpanel.people.set(properties),
  registerSuperProperties: (properties) => mixpanel.register(properties),
  track: (eventName, properties) => mixpanel.track(eventName, properties),
  timeEvent: (eventName) => mixpanel.time_event(eventName)
};

const activeProviders: AnalyticsProvider[] = [MixpanelProvider];

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
 * Sets user properties (People Properties in Mixpanel).
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
