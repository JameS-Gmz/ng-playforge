import { Component, Input} from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.css'
})



export class NavItemComponent {

@Input() routerLink = "";
@Input() img: String = ""
@Input() text: String = ""

}
