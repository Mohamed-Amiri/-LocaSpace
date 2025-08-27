import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

export const fadeInUpAnimation = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(30px)' }),
    animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.4s ease-out', style({ opacity: 1 }))
  ])
]);

export const slideInLeftAnimation = trigger('slideInLeft', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-30px)' }),
    animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

export const slideInRightAnimation = trigger('slideInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(30px)' }),
    animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

export const slideInOutAnimation = trigger('slideInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-100%)' }),
    animate('0.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('0.3s ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
  ])
]);

export const scaleInAnimation = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('0.4s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

export const staggerAnimation = trigger('stagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);