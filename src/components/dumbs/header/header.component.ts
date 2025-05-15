import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { NavItemComponent } from "../../smarts/nav-item/nav-item.component";
import { RouterModule, Router } from '@angular/router';
import { MobileMenuComponent } from "../mobile-menu/mobile-menu.component";
import { CategoryComponent } from "../../smarts/category/category.component";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { NotificationComponent } from '../notification/notification.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [
        CommonModule, 
        SearchbarComponent, 
        NavItemComponent, 
        RouterModule, 
        MobileMenuComponent, 
        CategoryComponent,
        NotificationComponent
    ]
})
export class HeaderComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean = false;
    isDeveloper: boolean = false;
    private authSubscription: Subscription | null = null;
    private roleSubscription: Subscription | null = null;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authSubscription = this.authService.isLoggedIn$.subscribe(loggedIn => {
            this.isLoggedIn = loggedIn;
        });

        this.roleSubscription = this.authService.role$.subscribe(role => {
            this.isDeveloper = role === 'developer';
        });
    }

    ngOnDestroy(): void {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
        if (this.roleSubscription) {
            this.roleSubscription.unsubscribe();
        }
    }
}
