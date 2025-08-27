/**
 * Configuration des tokens d'authentification
 */
export const AUTH_CONFIG = {
  // Clés de stockage local
  STORAGE_KEYS: {
    TOKEN: 'token',
    CURRENT_USER: 'currentUser',
    REMEMBER_ME: 'rememberMe'
  },

  // Configuration des tokens
  TOKEN: {
    HEADER_KEY: 'Authorization',
    TYPE: 'Bearer',
    EXPIRATION_MARGIN: 300 // 5 minutes en secondes
  },

  // Routes d'authentification
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email'
  },

  // Points d'accès de l'API
  API: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    ME: '/api/auth/me'
  },

  // Délais et durées
  TIMEOUTS: {
    SESSION_EXPIRY_WARNING: 5 * 60 * 1000, // 5 minutes en millisecondes
    INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes en millisecondes
    PASSWORD_RESET_EXPIRY: 60 * 60 * 1000, // 1 heure en millisecondes
    VERIFICATION_CODE_EXPIRY: 10 * 60 * 1000 // 10 minutes en millisecondes
  },

  // Règles de validation
  VALIDATION: {
    PASSWORD: {
      MIN_LENGTH: 8,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBER: true,
      REQUIRE_SPECIAL_CHAR: true,
      SPECIAL_CHARS: '!@#$%^&*(),.?":{}|<>'
    },
    EMAIL: {
      MAX_LENGTH: 255,
      PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 30,
      PATTERN: /^[a-zA-Z0-9._-]+$/
    }
  },

  // Messages d'erreur
  ERROR_MESSAGES: {
    LOGIN: {
      INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
      ACCOUNT_LOCKED: 'Votre compte a été temporairement verrouillé',
      UNVERIFIED_EMAIL: 'Veuillez vérifier votre adresse email',
      ACCOUNT_DISABLED: 'Votre compte a été désactivé'
    },
    REGISTER: {
      EMAIL_EXISTS: 'Cette adresse email est déjà utilisée',
      USERNAME_EXISTS: 'Ce nom d\'utilisateur est déjà pris',
      INVALID_INVITATION: 'Code d\'invitation invalide',
      REGISTRATION_CLOSED: 'Les inscriptions sont temporairement fermées'
    },
    PASSWORD: {
      RESET_LINK_EXPIRED: 'Le lien de réinitialisation a expiré',
      RESET_LINK_INVALID: 'Le lien de réinitialisation est invalide',
      CURRENT_PASSWORD_INVALID: 'Mot de passe actuel incorrect',
      SAME_AS_OLD: 'Le nouveau mot de passe doit être différent de l\'ancien'
    },
    VERIFICATION: {
      CODE_EXPIRED: 'Le code de vérification a expiré',
      CODE_INVALID: 'Code de vérification invalide',
      TOO_MANY_ATTEMPTS: 'Trop de tentatives, veuillez réessayer plus tard'
    },
    SESSION: {
      EXPIRED: 'Votre session a expiré',
      INVALID_TOKEN: 'Session invalide',
      CONCURRENT_LOGIN: 'Votre compte est connecté sur un autre appareil'
    }
  },

  // Messages de succès
  SUCCESS_MESSAGES: {
    LOGIN: 'Connexion réussie',
    REGISTER: 'Inscription réussie',
    LOGOUT: 'Déconnexion réussie',
    PASSWORD_RESET_SENT: 'Instructions de réinitialisation envoyées',
    PASSWORD_RESET_SUCCESS: 'Mot de passe réinitialisé avec succès',
    EMAIL_VERIFICATION_SENT: 'Email de vérification envoyé',
    EMAIL_VERIFIED: 'Adresse email vérifiée avec succès'
  },

  // Rôles utilisateur
  ROLES: {
    TENANT: 'tenant',
    OWNER: 'owner',
    ADMIN: 'admin'
  } as const,

  // Permissions par rôle
  PERMISSIONS: {
    tenant: ['view_places', 'book_places', 'manage_bookings'],
    owner: ['view_places', 'manage_places', 'manage_bookings'],
    admin: ['view_places', 'manage_places', 'manage_bookings', 'manage_users']
  } as const
};

/**
 * Type pour les rôles utilisateur
 */
export type UserRole = keyof typeof AUTH_CONFIG.ROLES;

/**
 * Type pour les permissions
 */
export type Permission = 'view_places' | 'book_places' | 'manage_places' | 'manage_bookings' | 'manage_users';