import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { NotificationService, Notification } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  isOpen: boolean = false;
  private notificationSubscription: Subscription | null = null;
  private checkIntervalSubscription: Subscription | null = null;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    // S'abonner aux notifications
    this.notificationSubscription = this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
      this.updateUnreadCount();
    });

    // Vérifier les nouveaux jeux toutes les 2 minutes (120000 ms)
    this.checkIntervalSubscription = interval(120000).subscribe(() => {
      this.notificationService.checkForNewGames();
    });

    // Vérifier immédiatement au chargement
    this.notificationService.checkForNewGames();
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.checkIntervalSubscription) {
      this.checkIntervalSubscription.unsubscribe();
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    const isDropdownContent = target.closest('.notifications-dropdown');
    const isMarkAllRead = target.closest('.mark-all-read');
    const isNotificationItem = target.closest('.notification-item');

    event.preventDefault();
    event.stopPropagation();

    if (!isDropdownContent || isMarkAllRead || isNotificationItem) {
      this.toggleNotifications();
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isInsideComponent = this.elementRef.nativeElement.contains(target);
    const isNavItem = target.closest('.notification-nav-item');

    if (!isInsideComponent && !isNavItem) {
      this.isOpen = false;
    }
  }

  toggleNotifications(): void {
    this.isOpen = !this.isOpen;
  }

  markAllAsRead(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.notificationService.markAllAsRead();
  }

  handleNotificationClick(notification: Notification, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.markAsRead(notification.id);
    if (notification.gameId) {
      this.isOpen = false;
      setTimeout(() => {
        this.router.navigate(['/game/id', notification.gameId]);
      }, 100);
    }
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId);
  }

  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }
}
