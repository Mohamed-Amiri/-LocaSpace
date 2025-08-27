import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';

export interface Notification {
  id: string;
  type: 'booking' | 'message' | 'review' | 'payment' | 'system' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  data?: any;
  priority: 'low' | 'medium' | 'high';
  icon?: string;
}

export interface NotificationPreferences {
  email: {
    bookings: boolean;
    messages: boolean;
    reviews: boolean;
    payments: boolean;
    marketing: boolean;
  };
  push: {
    bookings: boolean;
    messages: boolean;
    reviews: boolean;
    payments: boolean;
  };
  sms: {
    bookings: boolean;
    payments: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private preferencesSubject = new BehaviorSubject<NotificationPreferences>(this.getDefaultPreferences());
  
  notifications$ = this.notificationsSubject.asObservable();
  preferences$ = this.preferencesSubject.asObservable();

  constructor() {
    this.loadPreferences();
  }

  private getDefaultPreferences(): NotificationPreferences {
    return {
      email: {
        bookings: true,
        messages: true,
        reviews: true,
        payments: true,
        marketing: false
      },
      push: {
        bookings: true,
        messages: true,
        reviews: false,
        payments: true
      },
      sms: {
        bookings: false,
        payments: true
      }
    };
  }



  private loadPreferences() {
    const stored = localStorage.getItem('notification_preferences');
    if (stored) {
      try {
        const preferences = JSON.parse(stored);
        this.preferencesSubject.next({ ...this.getDefaultPreferences(), ...preferences });
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      }
    }
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.notifications$.pipe(
      tap(notifications => notifications.filter(n => !n.read))
    );
  }

  getUnreadCount(): Observable<number> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => !n.read).length)
    );
  }

  markAsRead(notificationIds: string[]): Observable<void> {
    const notifications = this.notificationsSubject.value.map(notification =>
      notificationIds.includes(notification.id)
        ? { ...notification, read: true }
        : notification
    );
    
    this.notificationsSubject.next(notifications);
    return of(void 0).pipe(delay(100));
  }

  markAllAsRead(): Observable<void> {
    const notifications = this.notificationsSubject.value.map(notification => ({
      ...notification,
      read: true
    }));
    
    this.notificationsSubject.next(notifications);
    return of(void 0).pipe(delay(100));
  }

  deleteNotification(notificationId: string): Observable<void> {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(notifications);
    return of(void 0).pipe(delay(100));
  }

  deleteAllRead(): Observable<void> {
    const notifications = this.notificationsSubject.value.filter(n => !n.read);
    this.notificationsSubject.next(notifications);
    return of(void 0).pipe(delay(100));
  }

  createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Observable<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    const notifications = [newNotification, ...this.notificationsSubject.value];
    this.notificationsSubject.next(notifications);

    // Show browser notification if supported and permitted
    this.showBrowserNotification(newNotification);

    return of(newNotification).pipe(delay(100));
  }

  private showBrowserNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'high'
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          // Navigate to the action URL
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // Auto close after 5 seconds for non-high priority notifications
      if (notification.priority !== 'high') {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }
  }

  requestNotificationPermission(): Observable<NotificationPermission> {
    if ('Notification' in window) {
      return new Observable(observer => {
        Notification.requestPermission().then(permission => {
          observer.next(permission);
          observer.complete();
        });
      });
    }
    
    return of('denied' as NotificationPermission);
  }

  getNotificationPermission(): NotificationPermission {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }

  // Preferences management
  getPreferences(): Observable<NotificationPreferences> {
    return this.preferences$;
  }

  updatePreferences(preferences: NotificationPreferences): Observable<void> {
    this.preferencesSubject.next(preferences);
    localStorage.setItem('notification_preferences', JSON.stringify(preferences));
    return of(void 0).pipe(delay(100));
  }

  // Specific notification creators
  createBookingNotification(bookingId: string, guestName: string, propertyName: string): Observable<Notification> {
    return this.createNotification({
      type: 'booking',
      title: 'Nouvelle réservation',
      message: `${guestName} a réservé ${propertyName}`,
      actionUrl: `/reservations/${bookingId}`,
      actionLabel: 'Voir la réservation',
      priority: 'high',
      icon: '📅',
      data: { bookingId, guestName, propertyName }
    });
  }

  createMessageNotification(conversationId: string, senderName: string): Observable<Notification> {
    return this.createNotification({
      type: 'message',
      title: 'Nouveau message',
      message: `${senderName} vous a envoyé un message`,
      actionUrl: `/messages/${conversationId}`,
      actionLabel: 'Répondre',
      priority: 'medium',
      icon: '💬',
      data: { conversationId, senderName }
    });
  }

  createReviewNotification(propertyId: string, rating: number, propertyName: string): Observable<Notification> {
    return this.createNotification({
      type: 'review',
      title: 'Nouvel avis',
      message: `Vous avez reçu un avis ${rating} étoiles pour ${propertyName}`,
      actionUrl: `/lieux/${propertyId}/reviews`,
      actionLabel: 'Voir l\'avis',
      priority: 'low',
      icon: '⭐',
      data: { propertyId, rating, propertyName }
    });
  }

  createPaymentNotification(amount: number, bookingId: string): Observable<Notification> {
    return this.createNotification({
      type: 'payment',
      title: 'Paiement reçu',
      message: `Vous avez reçu un paiement de ${amount}€`,
      actionUrl: `/payments/${bookingId}`,
      actionLabel: 'Voir le paiement',
      priority: 'medium',
      icon: '💰',
      data: { amount, bookingId }
    });
  }

  createReminderNotification(title: string, message: string, actionUrl?: string): Observable<Notification> {
    return this.createNotification({
      type: 'reminder',
      title,
      message,
      actionUrl,
      actionLabel: actionUrl ? 'Voir les détails' : undefined,
      priority: 'medium',
      icon: '🔔'
    });
  }

  // Utility methods
  getNotificationsByType(type: Notification['type']): Observable<Notification[]> {
    return this.notifications$.pipe(
      tap(notifications => notifications.filter(n => n.type === type))
    );
  }

  getNotificationsByPriority(priority: Notification['priority']): Observable<Notification[]> {
    return this.notifications$.pipe(
      tap(notifications => notifications.filter(n => n.priority === priority))
    );
  }

  searchNotifications(query: string): Observable<Notification[]> {
    return this.notifications$.pipe(
      tap(notifications => {
        if (!query.trim()) return notifications;
        
        const lowerQuery = query.toLowerCase();
        return notifications.filter(n =>
          n.title.toLowerCase().includes(lowerQuery) ||
          n.message.toLowerCase().includes(lowerQuery)
        );
      })
    );
  }
}