import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../components/dumbs/header/header.component";
import { FooterComponent } from "../components/dumbs/footer/footer.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, RouterLink, HeaderComponent, FooterComponent,RouterModule]
})
export class AppComponent {
  title = 'PlayForge';
}
