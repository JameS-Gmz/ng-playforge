import { Component } from '@angular/core';
import { PlayInBrowserComponent } from "../play-in-browser/play-in-browser.component";
import { CarouselComponent } from "../../smarts/carousel/carousel.component";
import { RatingComponentComponent } from "../rating-component/rating-component.component";

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [PlayInBrowserComponent, CarouselComponent, RatingComponentComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent {

}
