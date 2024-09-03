import { Component } from '@angular/core';
import { NavItemComponent} from "../../smarts/nav-item/nav-item.component";
import { RouterLink } from '@angular/router';
import { MobileMenuComponent } from "../mobile-menu/mobile-menu.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NavItemComponent, RouterLink, MobileMenuComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
