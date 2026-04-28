import mixpanel from 'mixpanel-browser';
import { AnalyticsEventName, EventProperties } from './mixpanelEvents';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

// Default initialization call
// This ensures it only happens once in browser-side executions.
export const initMixpanel = () => {
  if (typeof window !== 'undefined') {
    if (MIXPANEL_TOKEN) {
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: true,
        persistence: 'localStorage',
        api_host: 'https://api-eu.mixpanel.com'
      });
    } else {
      console.warn('Mixpanel Token not found in initialization.');
    }
  }
};

/**
 * Identify a user in mixpanel
 */
export const identifyUser = (userId: string) => {
  if (typeof window !== 'undefined' && MIXPANEL_TOKEN) {
    mixpanel.identify(userId);
  }
};

/**
 * Set user identity properties
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && MIXPANEL_TOKEN) {
    mixpanel.people.set(properties);
  }
};

/**
 * Register super properties that are sent with every subsequent event.
 * Use this to attach store_id globally once the user has logged in.
 */
export const registerSuperProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && MIXPANEL_TOKEN) {
    mixpanel.register(properties);
  }
};

/**
 * Track an event with strong types based on our schema definitions.
 * @param eventName strict subset of named events
 * @param properties strictly required parameters that match the event
 */
export const trackMixpanelEvent = <T extends AnalyticsEventName>(
  eventName: T,
  ...propertiesArg: EventProperties[T] extends Record<string, never>
    ? [properties?: Record<string, never>]
    : [properties: EventProperties[T]]
) => {
  if (typeof window !== 'undefined' && MIXPANEL_TOKEN) {
    // Typescript destructuring inference safely allows an un-passed parameter to be treated as empty obj.
    const properties = propertiesArg[0] || {};
    try {
      mixpanel.track(eventName, properties);
    } catch (error) {
      console.error('Mixpanel Error tracking event', eventName, error);
    }
  } else if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Helpful log when mixpanel token missing locally but simulating an event trigger.
    console.log(`[Mixpanel Simulation] Tracked: ${eventName}`, propertiesArg[0]);
  }
};
