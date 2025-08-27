import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const slideInOutAnimation = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('300ms ease-out', style({ transform: 'translateX(0%)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
  ])
]);

export const slideUpDownAnimation = trigger('slideUpDown', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('400ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
  ])
]);

// For route transitions
export const routeSlideAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        opacity: 0
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(100%)' })
    ], { optional: true }),
    query(':leave', [
      style({ transform: 'translateX(0%)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('300ms ease-out',
          style({
            transform: 'translateX(-100%)',
            opacity: 0
          }))
      ], { optional: true }),
      query(':enter', [
        animate('300ms ease-out',
          style({
            transform: 'translateX(0%)',
            opacity: 1
          }))
      ], { optional: true })
    ])
  ])
]);