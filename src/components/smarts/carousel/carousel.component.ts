import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true
})
export class CarouselComponent {
  @Input() images: string[] = [
    '/Ago-Que-es-un-gamer_2.jpg',
    '/chiffres-jeu-video.jpg',
    '/230213-jeux-video.jpg'
  ];
  currentIndex: number = 0;

  // Fonction pour passer à l'image suivante
  nextSlide(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Retour au début si on est à la fin
    }
  }

  // Fonction pour revenir à l'image précédente 
  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1; // Aller à la dernière image si on est au début
    }
  }

  // Démarrer le défilement automatique
  ngOnInit() {
    setInterval(() => {
      this.nextSlide();
    }, 5000); // Change l'image toutes les 5 secondes
  }
}
