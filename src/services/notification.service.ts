import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameService } from './game.service';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  gameId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private lastGameId: number | null = null;

  constructor(private gameService: GameService) {
    this.initializeNotifications();
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
      title: 'Nouveau jeu disponible !',
      message: `Le jeu "${game.title}" est maintenant disponible sur PlayForge.`,
      time: 'Maintenant',
      isRead: false,
      gameId: game.id
    };

    const currentNotifications = this.notifications.getValue();
    this.notifications.next([newNotification, ...currentNotifications]);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  markAsRead(notificationId: number): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification => 
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    );
    this.notifications.next(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification => 
      ({ ...notification, isRead: true })
    );
    this.notifications.next(updatedNotifications);
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
} 