
import { Component } from '@angular/core';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { NavItemComponent } from "../../smarts/nav-item/nav-item.component";
import { RouterModule } from '@angular/router';
import { ButtonSlideComponent } from "../button-slide/button-slide.component";

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [SearchbarComponent, NavItemComponent, RouterModule, ButtonSlideComponent]
})
export class HeaderComponent {

}
