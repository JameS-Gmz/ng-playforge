
import { Component, OnInit} from '@angular/core';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { NavItemComponent } from "../../smarts/nav-item/nav-item.component";
import { RouterModule } from '@angular/router';
import { MobileMenuComponent } from "../mobile-menu/mobile-menu.component";
import { CategoryComponent } from "../../smarts/category/category.component";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';




@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [CommonModule, SearchbarComponent, NavItemComponent, RouterModule, MobileMenuComponent, CategoryComponent]
})
export class HeaderComponent implements OnInit {

    isLoggedIn: boolean = false;
    isDeveloper: boolean = false;

    constructor(private authService : AuthService) {  }

    ngOnInit(): void {
    // S'abonner aux observables pour obtenir les mises à jour
    this.authService.isLoggedIn$.subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
      });
  
      this.authService.role$.subscribe(role => {
        this.isDeveloper = role === 'developer';
      });
    }
}
