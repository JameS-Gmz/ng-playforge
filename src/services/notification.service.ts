import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameService } from './game.service';

export type NotificationType = 'game' | 'system' | 'achievement' | 'warning';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  gameId?: number;
  createdAt: Date;
  expiresAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private lastGameId: number | null = null;
  private readonly STORAGE_KEY = 'notifications';
  private readonly MAX_NOTIFICATIONS = 50;
  private readonly NOTIFICATION_LIFETIME = 7 * 24 * 60 * 60 * 1000; // 7 jours

  constructor(private gameService: GameService) {
    this.loadNotifications();
    this.initializeNotifications();
    this.startCleanupInterval();
  }

  private loadNotifications(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const notifications = JSON.parse(stored).map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
      }));
      this.notifications.next(notifications);
    }
  }

  private saveNotifications(notifications: Notification[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupExpiredNotifications();
    }, 60 * 60 * 1000); // Nettoyage toutes les heures
  }

  private cleanupExpiredNotifications(): void {
    const currentNotifications = this.notifications.getValue();
    const now = new Date();
    const validNotifications = currentNotifications.filter(notification => {
      if (!notification.expiresAt) return true;
      return notification.expiresAt > now;
    });
    
    if (validNotifications.length !== currentNotifications.length) {
      this.notifications.next(validNotifications);
      this.saveNotifications(validNotifications);
    }
  }

  private async initializeNotifications() {
    try {
      const games = await this.gameService.getAllGames();
      if (games && games.length > 0) {
        const sortedGames = [...games].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        const latestGame = sortedGames[0];
        this.addNewGameNotification(latestGame);
        this.lastGameId = latestGame.id;
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  private addNewGameNotification(game: any) {
    const newNotification: Notification = {
      id: Date.now(),
      type: 'game',
      title: 'Nouveau jeu disponible !',
      message: `Le jeu "${game.title}" est maintenant disponible sur PlayForge.`,
      time: 'Maintenant',
      isRead: false,
      gameId: game.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.NOTIFICATION_LIFETIME)
    };

    this.addNotification(newNotification);
  }

  addNotification(notification: Notification): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = [notification, ...currentNotifications].slice(0, this.MAX_NOTIFICATIONS);
    this.notifications.next(updatedNotifications);
    this.saveNotifications(updatedNotifications);
    this.playNotificationSound();
  }

  private playNotificationSound(): void {
    const audio = new Audio('/assets/sounds/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(error => console.log('Error playing notification sound:', error));
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  getNotificationsByType(type: NotificationType): Observable<Notification[]> {
    return new Observable(subscriber => {
      this.notifications.subscribe(notifications => {
        const filtered = notifications.filter(n => n.type === type);
        subscriber.next(filtered);
      });
    });
  }

  markAsRead(notificationId: number): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification => 
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    );
    this.notifications.next(updatedNotifications);
    this.saveNotifications(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification => 
      ({ ...notification, isRead: true })
    );
    this.notifications.next(updatedNotifications);
    this.saveNotifications(updatedNotifications);
  }

  deleteNotification(notificationId: number): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.filter(n => n.id !== notificationId);
    this.notifications.next(updatedNotifications);
    this.saveNotifications(updatedNotifications);
  }

  clearAllNotifications(): void {
    this.notifications.next([]);
    this.saveNotifications([]);
  }

  async checkForNewGames(): Promise<void> {
    try {
      const games = await this.gameService.getAllGames();
      
      if (games && games.length > 0) {
        const sortedGames = [...games].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        const latestGame = sortedGames[0];
        
        if (this.lastGameId !== latestGame.id) {
          this.addNewGameNotification(latestGame);
          this.lastGameId = latestGame.id;
        }
      }
    } catch (error) {
      console.error('Error checking for new games:', error);
    }
  }

  addSystemNotification(title: string, message: string): void {
    const notification: Notification = {
      id: Date.now(),
      type: 'system',
      title,
      message,
      time: 'Maintenant',
      isRead: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.NOTIFICATION_LIFETIME)
    };
    this.addNotification(notification);
  }

  addWarningNotification(title: string, message: string): void {
    const notification: Notification = {
      id: Date.now(),
      type: 'warning',
      title,
      message,
      time: 'Maintenant',
      isRead: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.NOTIFICATION_LIFETIME)
    };
    this.addNotification(notification);
  }
} 