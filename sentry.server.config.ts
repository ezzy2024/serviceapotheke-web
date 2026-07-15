import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://d6ba61a089c71782ac433acc3796540b@o4511604042891264.ingest.de.sentry.io/4511735316086864",
  tracesSampleRate: 0.1,
  debug: false,
  beforeSend(event) {
    if (event.user) {
      delete event.user.email;
      delete event.user.username;
      delete event.user.id;
    }
    
    const scrubKeys = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          scrubKeys(obj[key]);
        } else if (typeof key === 'string' && (key.toLowerCase().includes('approbation') || key.toLowerCase().includes('license') || key.toLowerCase().includes('name') || key.toLowerCase().includes('email'))) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'string' && /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(obj[key])) {
          obj[key] = '[SCRUBBED_EMAIL]';
        }
      }
    };
    
    if (event.extra) scrubKeys(event.extra);
    if (event.contexts) scrubKeys(event.contexts);
    if (event.request && event.request.data) scrubKeys(event.request.data);
    
    return event;
  },
});
