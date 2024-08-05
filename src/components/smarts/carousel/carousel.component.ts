import { Component } from '@angular/core';
import { InputFileComponent } from "../../dumbs/input-file/input-file.component";
import { CheckboxTemplateComponent } from "../../dumbs/checkbox-template/checkbox-template.component";

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [InputFileComponent, CheckboxTemplateComponent],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  slides: string [] = ['Ago-Que-es-un-gamer_2.jpg', '230213-jeux-video.jpg', 'chiffres-jeu-video.jpg', 'R.jpg' ]
  i=0;

  getSlide() {
      return this.slides[this.i];
  }

  getPrev() {
      this.i = this.i===0 ? 0 : this.i - 2;
  }
//edit here    
  getNext() {
      this.i = this.i===this.slides.length ? this.i : this.i + 1;
      if (this.i == this.slides.length) {
        this.i = this.i - 1
      }
  }

}