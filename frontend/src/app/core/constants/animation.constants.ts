import { animate, animation, keyframes, style, transition, trigger } from '@angular/animations';

/**
 * Fade Animations
 */
export const fadeAnimation = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0 }))
  ])
]);

/**
 * Slide Animations
 */
export const slideInAnimation = trigger('slideIn', [
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);

export const slideOutAnimation = trigger('slideOut', [
  transition(':leave', [
    animate('400ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
  ])
]);

/**
 * Route Transition Animations
 */
export const routeSlideAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    style({ height: '!' }),
    style({ opacity: 0, transform: 'translateX(5%)' }),
    animate('400ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

/**
 * Scale Animations
 */
export const scaleAnimation = trigger('scale', [
  transition(':enter', [
    style({ transform: 'scale(0.95)', opacity: 0 }),
    animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'scale(0.95)', opacity: 0 }))
  ])
]);

/**
 * Toast Animations
 */
export const toastAnimation = trigger('toastAnimation', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
  ])
]);

/**
 * Modal Animations
 */
export const modalAnimation = trigger('modal', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0 }))
  ])
]);

export const modalContentAnimation = trigger('modalContent', [
  transition(':enter', [
    style({ transform: 'scale(0.95)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'scale(0.95)', opacity: 0 }))
  ])
]);

/**
 * List Item Animations
 */
export const listAnimation = trigger('listAnimation', [
  transition('* => *', [ // each time the binding value changes
    animate('300ms ease', keyframes([
      style({ opacity: 0, transform: 'translateX(-100px)', offset: 0 }),
      style({ opacity: 0.5, transform: 'translateX(10px)', offset: 0.3 }),
      style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
    ]))
  ])
]);

/**
 * Shake Animation
 */
export const shakeAnimation = trigger('shake', [
  transition('* => *', [
    animate('400ms ease-in-out', keyframes([
      style({ transform: 'translate3d(-10px, 0, 0)', offset: 0.1 }),
      style({ transform: 'translate3d(10px, 0, 0)', offset: 0.3 }),
      style({ transform: 'translate3d(-10px, 0, 0)', offset: 0.5 }),
      style({ transform: 'translate3d(10px, 0, 0)', offset: 0.7 }),
      style({ transform: 'translate3d(-10px, 0, 0)', offset: 0.9 }),
      style({ transform: 'translate3d(0, 0, 0)', offset: 1 })
    ]))
  ])
]);

/**
 * Reusable Animation Timings
 */
export const ANIMATION_TIMINGS = {
  FAST: '200ms',
  NORMAL: '300ms',
  SLOW: '400ms',
  VERY_SLOW: '600ms'
};

/**
 * Reusable Animation Curves
 */
export const ANIMATION_CURVES = {
  EASE: 'ease',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  LINEAR: 'linear'
};

/**
 * Reusable Base Animations
 */
export const baseAnimations = {
  fadeIn: animation([
    style({ opacity: 0 }),
    animate('{{ duration }} {{ curve }}', style({ opacity: 1 }))
  ], {
    params: {
      duration: ANIMATION_TIMINGS.NORMAL,
      curve: ANIMATION_CURVES.EASE_OUT
    }
  }),

  fadeOut: animation([
    animate('{{ duration }} {{ curve }}', style({ opacity: 0 }))
  ], {
    params: {
      duration: ANIMATION_TIMINGS.NORMAL,
      curve: ANIMATION_CURVES.EASE_IN
    }
  })
};