import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FileService } from '../../../services/file-service.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent {
  searchQuery: string = '';
  games: any[] = [];
  errorMessage: string = '';
  imageUrl: string | undefined;


  constructor(private gameService: GameService, private fileService : FileService) {}

    async onSearch() {
      if (this.searchQuery.trim()) {
        try {
          const result = await this.gameService.searchGames(this.searchQuery);
          this.games = await Promise.all(result.map(async (game: any) => {
            let imageUrl;
            try {
              imageUrl = await this.fileService.getImageUrl(game.id);  // Récupérer l'URL de l'image
            } catch (error) {
              console.error('Erreur lors de la récupération de l\'image:', error);
              imageUrl = 'default-image-url.jpg';  // URL par défaut si aucune image n'est trouvée
            }
    
            return {
              title: game.title,
              price: game.price,
              id: game.id,
              imageUrl: imageUrl
            };
          }));
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = 'Aucun jeux correspondant';
          this.games = [];
        }
      }
    }

  onInput() {
    if (this.searchQuery.trim()) {
      this.onSearch();
    } else {
      // Réinitialise les jeux si la barre de recherche est vide
      this.games = [];
    }
  }

  reset() {
    this.searchQuery = '';
    this.games = [];
    this.errorMessage = '';
  }
}
