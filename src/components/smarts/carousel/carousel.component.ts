import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports : [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true
})
export class CarouselComponent {
  @Input() images: string[] = [];
  currentIndex: number = 0;

  // Fonction pour passer à l'image suivante
  nextSlide(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
  }

  // Fonction pour revenir à l'image précédente 
  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
