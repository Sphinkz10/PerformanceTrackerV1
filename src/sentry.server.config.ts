import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Only capture errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Environment
  environment: process.env.NODE_ENV,

  // Ignore common errors
  ignoreErrors: [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
  ],

  // Before send - filter sensitive data
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // Filter out sensitive request data
    if (event.request) {
      delete event.request.cookies;
      
      // Redact authorization headers
      if (event.request.headers) {
        if (event.request.headers.authorization) {
          event.request.headers.authorization = '[Filtered]';
        }
        if (event.request.headers['x-api-key']) {
          event.request.headers['x-api-key'] = '[Filtered]';
        }
      }
    }

    return event;
  },
});
