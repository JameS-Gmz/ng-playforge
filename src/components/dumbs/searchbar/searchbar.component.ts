import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  constructor(private gameService: GameService) {}

  async onSearch() {
    if (this.searchQuery.trim()) {
      try {
        const result = await this.gameService.searchGames(this.searchQuery);
        this.games = result.map((game: any) => ({
          title: game.title,
          price: game.price,
          id: game.id
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
