
import { Component } from '@angular/core';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { NavItemComponent } from "../nav-item/nav-item.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [SearchbarComponent, NavItemComponent,RouterModule]
})
export class HeaderComponent {

}
