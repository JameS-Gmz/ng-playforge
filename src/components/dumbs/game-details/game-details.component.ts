import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from "../../smarts/carousel/carousel.component";
import { RatingComponentComponent } from "../rating-component/rating-component.component";
import { FileService } from '../../../services/file-service.service';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CarouselComponent, RatingComponentComponent],
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  game: any = {};  // Contient les informations du jeu
  images: string[] = [];  // Liste des URLs d'images pour le carrousel
  gameId!: string;  // ID du jeu

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du jeu depuis les paramètres de route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadGame(id);
      }
    });
  }

  async loadGame(id: string) {
    try {
      // Récupérer les détails du jeu
      this.game = await this.gameService.getGameById(id);
  
      // Récupérer les images associées au jeu
      const imageData = await this.fileService.getImagesURLS(this.game.id);
  
      // Mapper pour extraire les URLs des objets
      this.images = imageData.map((image: { url: string }) => image.url);
  
      console.log("Images récupérées et extraites :", this.images);
  
    } catch (error) {
      console.log("Erreur lors de la récupération des détails du jeu ou des images:", error);
    }
  }
  
}
