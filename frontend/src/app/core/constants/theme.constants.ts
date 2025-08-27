/**
 * Theme Names
 */
export const THEME_NAMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

/**
 * Theme Colors
 * Base color palette for the application
 */
export const THEME_COLORS = {
  // Primary colors
  PRIMARY: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // Base primary color
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1'
  },

  // Secondary colors
  SECONDARY: {
    50: '#fce4ec',
    100: '#f8bbd0',
    200: '#f48fb1',
    300: '#f06292',
    400: '#ec407a',
    500: '#e91e63', // Base secondary color
    600: '#d81b60',
    700: '#c2185b',
    800: '#ad1457',
    900: '#880e4f'
  },

  // Neutral colors
  NEUTRAL: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  },

  // Status colors
  SUCCESS: {
    LIGHT: '#4caf50',
    MAIN: '#2e7d32',
    DARK: '#1b5e20'
  },
  WARNING: {
    LIGHT: '#ff9800',
    MAIN: '#ed6c02',
    DARK: '#e65100'
  },
  ERROR: {
    LIGHT: '#ef5350',
    MAIN: '#d32f2f',
    DARK: '#c62828'
  },
  INFO: {
    LIGHT: '#03a9f4',
    MAIN: '#0288d1',
    DARK: '#01579b'
  }
};

/**
 * Theme Configuration
 * Default theme settings and options
 */
export const THEME_CONFIG = {
  // Default theme
  DEFAULT_THEME: THEME_NAMES.SYSTEM,

  // Theme storage key
  STORAGE_KEY: 'app_theme',

  // Theme change transition duration
  TRANSITION_DURATION: '200ms',

  // Theme CSS class names
  CLASS_NAMES: {
    DARK_MODE: 'dark-mode',
    LIGHT_MODE: 'light-mode',
    THEME_TRANSITIONING: 'theme-transitioning'
  },

  // Media query for system theme detection
  DARK_MODE_MEDIA_QUERY: '(prefers-color-scheme: dark)'
};

/**
 * Theme Variants
 * Specific theme configurations for light and dark modes
 */
export const THEME_VARIANTS = {
  [THEME_NAMES.LIGHT]: {
    // Background colors
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
      elevated: '#ffffff'
    },
    // Text colors
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)'
    },
    // Border colors
    border: {
      default: 'rgba(0, 0, 0, 0.12)',
      light: 'rgba(0, 0, 0, 0.08)',
      strong: 'rgba(0, 0, 0, 0.24)'
    },
    // Action colors
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      focus: 'rgba(0, 0, 0, 0.12)'
    }
  },
  [THEME_NAMES.DARK]: {
    // Background colors
    background: {
      default: '#121212',
      paper: '#1e1e1e',
      elevated: '#242424'
    },
    // Text colors
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)'
    },
    // Border colors
    border: {
      default: 'rgba(255, 255, 255, 0.12)',
      light: 'rgba(255, 255, 255, 0.08)',
      strong: 'rgba(255, 255, 255, 0.24)'
    },
    // Action colors
    action: {
      active: '#ffffff',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      focus: 'rgba(255, 255, 255, 0.12)'
    }
  }
};

/**
 * Theme Breakpoints
 * Responsive design breakpoints
 */
export const THEME_BREAKPOINTS = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px'
};

/**
 * Theme Spacing
 * Base spacing unit and common spacing values
 */
export const THEME_SPACING = {
  UNIT: 8, // Base spacing unit in pixels
  
  // Common spacing values
  XXS: 4,  // 0.5x
  XS: 8,   // 1x
  SM: 16,  // 2x
  MD: 24,  // 3x
  LG: 32,  // 4x
  XL: 40,  // 5x
  XXL: 48  // 6x
};

/**
 * Theme Shadows
 * Elevation shadows for different levels
 */
export const THEME_SHADOWS = {
  0: 'none',
  1: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  2: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  3: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  4: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
  8: '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
  16: '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)'
};