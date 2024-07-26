import { Component } from '@angular/core';
import { PlayInBrowserComponent } from "../play-in-browser/play-in-browser.component";

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [PlayInBrowserComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent {

}
