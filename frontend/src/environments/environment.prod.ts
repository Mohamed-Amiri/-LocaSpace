export const environment = {
  production: true,
  apiUrl: 'https://api.locaspace.fr/api',
  mapboxToken: process.env['MAPBOX_TOKEN'],
  googleMapsApiKey: process.env['GOOGLE_MAPS_API_KEY'],
  auth: {
    tokenPrefix: 'Bearer',
    loginRedirectUrl: '/',
    logoutRedirectUrl: '/login',
    unauthorizedRedirectUrl: '/login',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    inactivityTimeout: 30 * 60 * 1000, // 30 minutes
  },
  socialAuth: {
    google: {
      clientId: process.env['GOOGLE_CLIENT_ID'],
    },
    facebook: {
      appId: process.env['FACEBOOK_APP_ID'],
    },
  },
  sentry: {
    dsn: process.env['SENTRY_DSN'],
    environment: 'production',
    tracesSampleRate: 0.1,
  },
  features: {
    darkMode: true,
    socialLogin: true,
    mapIntegration: true,
    notifications: true,
    chat: true,
  },
};