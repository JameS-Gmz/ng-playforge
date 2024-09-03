import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  private currentSlide = 0;

  // Liste des images à afficher dans le carrousel
  images = [
    '/230213-jeux-video.jpg',
    'image2.jpg',
    'image3.jpg'
  ];

  // Fonction pour passer à la diapositive suivante
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }
  
  // Fonction pour passer à la diapositive précédente
  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 ) % this.images.length;
  }

  // Fonction pour obtenir la classe active pour le slide actuel
  getSlideClass(index: number): string {
    return index === this.currentSlide ? 'active' : '';
  }
}
