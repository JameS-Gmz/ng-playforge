import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../services/file-service.service';

@Component({
  selector: 'app-card-game',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './card-game.component.html',
  styleUrls: ['./card-game.component.css']
})
export class CardGameComponent implements OnInit {
  @Input() game: any = {};  // Données du jeu
  imageUrl: string | undefined;

  // Injecter le FileService dans le constructeur
  constructor(private fileService: FileService) {}

  async ngOnInit() {
    try {
      const gameId = this.game.id;  // Récupère l'ID du jeu
      this.imageUrl = await this.fileService.getImageUrl(gameId);  // Récupérer l'URL de l'image
      console.log(this.imageUrl)
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'image:', error);
    }
  }
}
