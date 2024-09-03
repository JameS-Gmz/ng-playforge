
import { Component, ViewChild } from '@angular/core';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { NavItemComponent } from "../../smarts/nav-item/nav-item.component";
import { RouterModule } from '@angular/router';
import { MobileMenuComponent } from "../mobile-menu/mobile-menu.component";




@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [SearchbarComponent, NavItemComponent, RouterModule, MobileMenuComponent]
})
export class HeaderComponent {
 
}
