import { Component } from '@angular/core';
import { InputFileComponent } from "../input-file/input-file.component";

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [InputFileComponent],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {

}
