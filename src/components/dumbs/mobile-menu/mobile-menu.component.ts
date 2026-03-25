import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { NotificationComponent } from '../notification/notification.component';
import { SearchbarComponent } from '../searchbar/searchbar.component';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NotificationComponent,
    SearchbarComponent,
  ],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css',
})
export class MobileMenuComponent implements OnInit, OnDestroy {
  isOpen = false;
  isLoggedIn = false;
  isDeveloper = false;
  isSuperAdmin = false;

  private readonly subs = new Subscription();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.authService.isLoggedIn$.subscribe((loggedIn) => {
        this.isLoggedIn = loggedIn;
      }),
    );
    this.subs.add(
      this.authService.role$.subscribe((role) => {
        this.isDeveloper = role === 'developer';
        this.isSuperAdmin = role === 'superadmin';
      }),
    );
    this.subs.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => this.close()),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }
}
