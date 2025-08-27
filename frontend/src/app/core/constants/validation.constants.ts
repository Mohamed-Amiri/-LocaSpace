/**
 * Validation Patterns
 * Regular expressions for common validation patterns
 */
export const VALIDATION_PATTERNS = {
  // User related patterns
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
  PHONE: /^(\+33|0)[1-9](\d{2}){4}$/,
  POSTAL_CODE: /^\d{5}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,16}$/,

  // Place related patterns
  TITLE: /^[\w\s\-'",.!?()]{3,100}$/,
  DESCRIPTION: /^[\w\s\-'",.!?()\n\r]{10,2000}$/,
  PRICE: /^\d+(\.\d{1,2})?$/,
  COORDINATES: /^-?\d+\.\d+$/,

  // Common patterns
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^([01]\d|2[0-3]):([0-5]\d)$/,
  COLOR_HEX: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
};

/**
 * Validation Limits
 * Minimum and maximum values for various fields
 */
export const VALIDATION_LIMITS = {
  // User related limits
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 16
  },
  EMAIL: {
    MAX_LENGTH: 254 // RFC 5321
  },

  // Place related limits
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000
  },
  PRICE: {
    MIN: 0,
    MAX: 1000000
  },
  CAPACITY: {
    MIN: 1,
    MAX: 1000
  },

  // Review related limits
  REVIEW: {
    RATING: {
      MIN: 1,
      MAX: 5
    },
    COMMENT: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 1000
    }
  },

  // Message related limits
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000
  },

  // File upload limits
  FILE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    IMAGE: {
      MAX_WIDTH: 4096,
      MAX_HEIGHT: 4096,
      MIN_WIDTH: 100,
      MIN_HEIGHT: 100
    }
  }
};

/**
 * Validation Messages
 * Error messages for various validation scenarios
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Ce champ est requis',
  EMAIL: {
    INVALID: 'Adresse email invalide',
    ALREADY_EXISTS: 'Cette adresse email est déjà utilisée',
    TOO_LONG: `L'adresse email ne doit pas dépasser ${VALIDATION_LIMITS.EMAIL.MAX_LENGTH} caractères`
  },
  PASSWORD: {
    TOO_SHORT: `Le mot de passe doit contenir au moins ${VALIDATION_LIMITS.PASSWORD.MIN_LENGTH} caractères`,
    TOO_LONG: `Le mot de passe ne doit pas dépasser ${VALIDATION_LIMITS.PASSWORD.MAX_LENGTH} caractères`,
    PATTERN: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
    MISMATCH: 'Les mots de passe ne correspondent pas'
  },
  USERNAME: {
    TOO_SHORT: `Le nom d'utilisateur doit contenir au moins ${VALIDATION_LIMITS.USERNAME.MIN_LENGTH} caractères`,
    TOO_LONG: `Le nom d'utilisateur ne doit pas dépasser ${VALIDATION_LIMITS.USERNAME.MAX_LENGTH} caractères`,
    PATTERN: 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres, des tirets et des underscores',
    ALREADY_EXISTS: 'Ce nom d\'utilisateur est déjà utilisé'
  },
  PHONE: {
    INVALID: 'Numéro de téléphone invalide',
    PATTERN: 'Le numéro doit être au format français (ex: 0612345678 ou +33612345678)'
  },
  POSTAL_CODE: {
    INVALID: 'Code postal invalide',
    PATTERN: 'Le code postal doit contenir 5 chiffres'
  },
  PLACE: {
    TITLE: {
      TOO_SHORT: `Le titre doit contenir au moins ${VALIDATION_LIMITS.TITLE.MIN_LENGTH} caractères`,
      TOO_LONG: `Le titre ne doit pas dépasser ${VALIDATION_LIMITS.TITLE.MAX_LENGTH} caractères`
    },
    DESCRIPTION: {
      TOO_SHORT: `La description doit contenir au moins ${VALIDATION_LIMITS.DESCRIPTION.MIN_LENGTH} caractères`,
      TOO_LONG: `La description ne doit pas dépasser ${VALIDATION_LIMITS.DESCRIPTION.MAX_LENGTH} caractères`
    },
    PRICE: {
      INVALID: 'Prix invalide',
      TOO_LOW: 'Le prix ne peut pas être négatif',
      TOO_HIGH: `Le prix ne peut pas dépasser ${VALIDATION_LIMITS.PRICE.MAX}`
    },
    CAPACITY: {
      INVALID: 'Capacité invalide',
      TOO_LOW: 'La capacité doit être d\'au moins 1 personne',
      TOO_HIGH: `La capacité ne peut pas dépasser ${VALIDATION_LIMITS.CAPACITY.MAX} personnes`
    }
  },
  REVIEW: {
    RATING: {
      INVALID: 'Note invalide',
      REQUIRED: 'La note est requise'
    },
    COMMENT: {
      TOO_SHORT: `Le commentaire doit contenir au moins ${VALIDATION_LIMITS.REVIEW.COMMENT.MIN_LENGTH} caractères`,
      TOO_LONG: `Le commentaire ne doit pas dépasser ${VALIDATION_LIMITS.REVIEW.COMMENT.MAX_LENGTH} caractères`
    }
  },
  MESSAGE: {
    TOO_SHORT: 'Le message ne peut pas être vide',
    TOO_LONG: `Le message ne doit pas dépasser ${VALIDATION_LIMITS.MESSAGE.MAX_LENGTH} caractères`
  },
  FILE: {
    TOO_LARGE: `La taille du fichier ne doit pas dépasser ${VALIDATION_LIMITS.FILE.MAX_SIZE / (1024 * 1024)}MB`,
    INVALID_TYPE: 'Type de fichier non supporté',
    IMAGE: {
      DIMENSIONS: `Les dimensions de l'image doivent être comprises entre ${VALIDATION_LIMITS.FILE.IMAGE.MIN_WIDTH}x${VALIDATION_LIMITS.FILE.IMAGE.MIN_HEIGHT} et ${VALIDATION_LIMITS.FILE.IMAGE.MAX_WIDTH}x${VALIDATION_LIMITS.FILE.IMAGE.MAX_HEIGHT} pixels`
    }
  }
};