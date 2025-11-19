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
  private readonly LAST_GAME_ID_KEY = 'lastGameId';
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
    
    // Charger le dernier gameId connu
    const lastGameIdStored = localStorage.getItem(this.LAST_GAME_ID_KEY);
    if (lastGameIdStored) {
      this.lastGameId = parseInt(lastGameIdStored, 10);
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
        
        // Initialiser lastGameId sans créer de notification
        // La notification sera créée uniquement lors de la première vérification de nouveaux jeux
        // Si lastGameId n'est pas déjà chargé depuis localStorage, l'initialiser
        if (this.lastGameId === null) {
          this.lastGameId = latestGame.id;
          localStorage.setItem(this.LAST_GAME_ID_KEY, latestGame.id.toString());
        }
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  private addNewGameNotification(game: any): boolean {
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

    // Retourne true si la notification a été ajoutée, false si c'était un doublon
    return this.addNotification(newNotification, true);
  }

  addNotification(notification: Notification, playSound: boolean = true): boolean {
    const currentNotifications = this.notifications.getValue();
    
    // Vérifier si une notification similaire existe déjà
    const isDuplicate = this.isDuplicateNotification(notification, currentNotifications);
    
    if (isDuplicate) {
      console.log('Notification dupliquée ignorée:', notification);
      return false; // Notification non ajoutée
    }
    
    const updatedNotifications = [notification, ...currentNotifications].slice(0, this.MAX_NOTIFICATIONS);
    this.notifications.next(updatedNotifications);
    this.saveNotifications(updatedNotifications);
    
    // Ne jouer le son que si demandé et si c'est une nouvelle notification
    if (playSound) {
      this.playNotificationSound();
    }
    
    return true; // Notification ajoutée avec succès
  }

  private isDuplicateNotification(newNotification: Notification, existingNotifications: Notification[]): boolean {
    // Pour les notifications de jeu, vérifier le gameId
    if (newNotification.type === 'game' && newNotification.gameId) {
      return existingNotifications.some(n => 
        n.type === 'game' && 
        n.gameId === newNotification.gameId &&
        // Vérifier aussi que la notification n'est pas expirée
        (!n.expiresAt || n.expiresAt > new Date())
      );
    }
    
    // Pour les autres types, vérifier le titre et le message (dans les 5 dernières minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return existingNotifications.some(n => 
      n.type === newNotification.type &&
      n.title === newNotification.title &&
      n.message === newNotification.message &&
      n.createdAt > fiveMinutesAgo &&
      (!n.expiresAt || n.expiresAt > new Date())
    );
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
        
        // Vérifier si c'est vraiment un nouveau jeu
        if (this.lastGameId !== latestGame.id) {
          const notificationAdded = this.addNewGameNotification(latestGame);
          
          // Mettre à jour lastGameId et le sauvegarder
          this.lastGameId = latestGame.id;
          localStorage.setItem(this.LAST_GAME_ID_KEY, latestGame.id.toString());
          
          if (notificationAdded) {
            console.log('Nouveau jeu détecté:', latestGame.title);
          } else {
            console.log('Jeu déjà notifié:', latestGame.title);
          }
        }
      }
    } catch (error) {
      console.error('Error checking for new games:', error);
    }
  }

  addSystemNotification(title: string, message: string): boolean {
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
    return this.addNotification(notification, true);
  }

  addWarningNotification(title: string, message: string): boolean {
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
    return this.addNotification(notification, true);
  }
} 