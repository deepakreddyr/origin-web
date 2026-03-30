export const GA_TRACKING_ID = 'G-NM914G6V0P';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value, ...params }: any) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    const eventParams: any = {
      value: value,
      ...params
    };
    if (category) eventParams.event_category = category;
    if (label) eventParams.event_label = label;
    (window as any).gtag('event', action, eventParams);
  }
};
