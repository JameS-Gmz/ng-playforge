import { Component } from '@angular/core';
import { NavItemComponent } from "../../smarts/nav-item/nav-item.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [NavItemComponent,RouterLink],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css'
})
export class MobileMenuComponent {

}
