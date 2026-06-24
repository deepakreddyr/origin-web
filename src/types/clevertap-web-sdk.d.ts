/**
 * Type declarations for clevertap-web-sdk
 * The package does not ship with TypeScript definitions, so we declare them here.
 */
declare module 'clevertap-web-sdk' {
  interface CleverTapProfile {
    Site: Record<string, any>;
  }

  interface CleverTapEventQueue {
    push(eventName: string, properties?: Record<string, any>): void;
  }

  interface CleverTapProfileQueue {
    push(profile: CleverTapProfile): void;
  }

  interface CleverTapOnUserLoginQueue {
    push(profile: CleverTapProfile): void;
  }

  interface CleverTapPrivacyQueue {
    push(option: { optOut?: boolean; useIP?: boolean }): void;
  }

  interface CleverTapInstance {
    /** Initialize the SDK with Account ID and optional Region */
    init(accountId: string, region?: string, targetDomain?: string): void;

    /** Set SDK log level: 0=off, 1=info, 2=debug, 3=verbose */
    setLogLevel(level: number): void;

    /** Track custom events */
    event: CleverTapEventQueue;

    /** Update or enrich user profile properties */
    profile: CleverTapProfileQueue;

    /** Identify a user — merges anonymous session with the profile */
    onUserLogin: CleverTapOnUserLoginQueue;

    /** Configure privacy / GDPR settings */
    privacy: CleverTapPrivacyQueue;
  }

  const clevertap: CleverTapInstance;
  export default clevertap;
}
