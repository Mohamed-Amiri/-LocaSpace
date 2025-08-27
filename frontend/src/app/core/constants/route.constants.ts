/**
 * Route Paths
 * Constants for all route paths in the application
 */
export const ROUTE_PATHS = {
  // Public routes
  HOME: '',
  ABOUT: 'about',
  CONTACT: 'contact',
  TERMS: 'terms',
  PRIVACY: 'privacy',
  FAQ: 'faq',

  // Authentication routes
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    FORGOT_PASSWORD: 'auth/forgot-password',
    RESET_PASSWORD: 'auth/reset-password',
    VERIFY_EMAIL: 'auth/verify-email',
    SOCIAL_CALLBACK: 'auth/social-callback'
  },

  // User routes
  USER: {
    PROFILE: 'profile',
    SETTINGS: 'settings',
    NOTIFICATIONS: 'notifications',
    MESSAGES: 'messages',
    FAVORITES: 'favorites'
  },

  // Place routes
  PLACE: {
    SEARCH: 'search',
    DETAILS: 'places/:id',
    CREATE: 'places/create',
    EDIT: 'places/:id/edit',
    PHOTOS: 'places/:id/photos',
    REVIEWS: 'places/:id/reviews'
  },

  // Booking routes
  BOOKING: {
    LIST: 'bookings',
    DETAILS: 'bookings/:id',
    CREATE: 'bookings/create',
    CONFIRMATION: 'bookings/confirmation'
  },

  // Owner routes
  OWNER: {
    DASHBOARD: 'owner/dashboard',
    PLACES: 'owner/places',
    BOOKINGS: 'owner/bookings',
    EARNINGS: 'owner/earnings',
    ANALYTICS: 'owner/analytics'
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: 'admin/dashboard',
    USERS: 'admin/users',
    VALIDATION: 'admin/validation',
    STATISTICS: 'admin/statistics'
  },

  // Error routes
  ERROR: {
    NOT_FOUND: '404',
    FORBIDDEN: '403',
    SERVER_ERROR: '500'
  }
};

/**
 * Route Titles
 * Page titles for routes (used in meta tags)
 */
export const ROUTE_TITLES = {
  [ROUTE_PATHS.HOME]: 'Accueil | LocaSpace',
  [ROUTE_PATHS.ABOUT]: 'À propos | LocaSpace',
  [ROUTE_PATHS.CONTACT]: 'Contact | LocaSpace',
  [ROUTE_PATHS.TERMS]: 'Conditions d\'utilisation | LocaSpace',
  [ROUTE_PATHS.PRIVACY]: 'Politique de confidentialité | LocaSpace',
  [ROUTE_PATHS.FAQ]: 'FAQ | LocaSpace',

  [ROUTE_PATHS.AUTH.LOGIN]: 'Connexion | LocaSpace',
  [ROUTE_PATHS.AUTH.REGISTER]: 'Inscription | LocaSpace',
  [ROUTE_PATHS.AUTH.FORGOT_PASSWORD]: 'Mot de passe oublié | LocaSpace',
  [ROUTE_PATHS.AUTH.RESET_PASSWORD]: 'Réinitialisation du mot de passe | LocaSpace',
  [ROUTE_PATHS.AUTH.VERIFY_EMAIL]: 'Vérification de l\'email | LocaSpace',

  [ROUTE_PATHS.USER.PROFILE]: 'Profil | LocaSpace',
  [ROUTE_PATHS.USER.SETTINGS]: 'Paramètres | LocaSpace',
  [ROUTE_PATHS.USER.NOTIFICATIONS]: 'Notifications | LocaSpace',
  [ROUTE_PATHS.USER.MESSAGES]: 'Messages | LocaSpace',
  [ROUTE_PATHS.USER.FAVORITES]: 'Favoris | LocaSpace',

  [ROUTE_PATHS.PLACE.SEARCH]: 'Recherche | LocaSpace',
  [ROUTE_PATHS.PLACE.CREATE]: 'Créer une annonce | LocaSpace',
  [ROUTE_PATHS.PLACE.EDIT]: 'Modifier l\'annonce | LocaSpace',

  [ROUTE_PATHS.BOOKING.LIST]: 'Mes réservations | LocaSpace',
  [ROUTE_PATHS.BOOKING.CREATE]: 'Nouvelle réservation | LocaSpace',
  [ROUTE_PATHS.BOOKING.CONFIRMATION]: 'Confirmation de réservation | LocaSpace',

  [ROUTE_PATHS.OWNER.DASHBOARD]: 'Tableau de bord propriétaire | LocaSpace',
  [ROUTE_PATHS.OWNER.PLACES]: 'Mes annonces | LocaSpace',
  [ROUTE_PATHS.OWNER.BOOKINGS]: 'Réservations reçues | LocaSpace',
  [ROUTE_PATHS.OWNER.EARNINGS]: 'Mes revenus | LocaSpace',
  [ROUTE_PATHS.OWNER.ANALYTICS]: 'Analyses | LocaSpace',

  [ROUTE_PATHS.ADMIN.DASHBOARD]: 'Tableau de bord admin | LocaSpace',
  [ROUTE_PATHS.ADMIN.USERS]: 'Gestion des utilisateurs | LocaSpace',
  [ROUTE_PATHS.ADMIN.VALIDATION]: 'Validation des lieux | LocaSpace',
  [ROUTE_PATHS.ADMIN.STATISTICS]: 'Statistiques | LocaSpace',

  [ROUTE_PATHS.ERROR.NOT_FOUND]: 'Page non trouvée | LocaSpace',
  [ROUTE_PATHS.ERROR.FORBIDDEN]: 'Accès refusé | LocaSpace',
  [ROUTE_PATHS.ERROR.SERVER_ERROR]: 'Erreur serveur | LocaSpace'
};

/**
 * Route Guards
 * Route access levels for authorization
 */
export const ROUTE_GUARDS = {
  PUBLIC: 'public',
  AUTHENTICATED: 'authenticated',
  OWNER: 'owner',
  ADMIN: 'admin'
};

/**
 * Route Utilities
 * Helper functions for route manipulation
 */
export const RouteUtils = {
  /**
   * Creates a route path with parameters
   * @param path Base route path
   * @param params Parameters to replace in the path
   */
  createPath: (path: string, params: Record<string, string | number> = {}): string => {
    let result = path;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`:${key}`, String(value));
    });
    return result;
  },

  /**
   * Creates a full URL for the given route
   * @param path Route path
   * @param params Route parameters
   * @param queryParams Query parameters
   */
  createUrl: (path: string, params: Record<string, string | number> = {}, queryParams: Record<string, string | number> = {}): string => {
    const base = RouteUtils.createPath(path, params);
    const query = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      query.append(key, String(value));
    });
    const queryString = query.toString();
    return queryString ? `${base}?${queryString}` : base;
  },

  /**
   * Gets the route title for a given path
   * @param path Route path
   * @param defaultTitle Default title if path not found
   */
  getTitle: (path: string, defaultTitle = 'LocaSpace'): string => {
    return ROUTE_TITLES[path] || defaultTitle;
  }
};