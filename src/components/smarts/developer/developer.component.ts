import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataFetchService } from '../../../services/data-fetch.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-developer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './developer.component.html',
  styleUrl: './developer.component.css'
})
export class DeveloperComponent implements OnInit {
  games: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedGame: any = null;
  isEditing: boolean = false;
  categories: any = {
    controllers: [],
    platforms: [],
    genres: [],
    tags: [],
    statuses: [],
    languages: []
  };

  constructor(
    private userService: UserService,
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDeveloperGames();
    this.loadCategories();
  }

  async loadCategories() {
    try {
      this.categories.controllers = await this.gameService.getControllers();
      this.categories.platforms = await this.gameService.getPlatforms();
      this.categories.genres = await this.gameService.getGenres();
      this.categories.tags = await this.gameService.getTags();
      this.categories.statuses = await this.gameService.getStatuses();
      this.categories.languages = await this.gameService.getLanguages();
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  }

  async loadDeveloperGames() {
    try {
      this.loading = true;
      this.error = null;
      
      // Récupérer l'ID du développeur depuis le service d'authentification
      const developerId = await this.userService.getCurrentDeveloperId();
      console.log('Developer ID:', developerId);
      
      if (!developerId) {
        throw new Error('ID du développeur non trouvé');
      }

      this.games = await this.gameService.getGamesByUserId(developerId);
      console.log('Games loaded:', this.games);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      this.error = error instanceof Error ? error.message : 'Erreur lors du chargement des jeux';
    } finally {
      this.loading = false;
    }
  }

  editGame(game: any) {
    this.selectedGame = { ...game };
    this.isEditing = true;
  }

  scrollToEditForm() {
    setTimeout(() => {
      const element = document.getElementById('editForm');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  cancelEdit() {
    this.selectedGame = null;
    this.isEditing = false;
  }

  async updateGame() {
    try {
      if (!this.selectedGame) return;

      const updatedGame = await this.gameService.updateGame(
        this.selectedGame.id.toString(),
        {
          title: this.selectedGame.title,
          description: this.selectedGame.description,
          price: this.selectedGame.price,
          authorStudio: this.selectedGame.authorStudio,
          madewith: this.selectedGame.madewith,
          StatusId: this.selectedGame.StatusId,
          LanguageId: this.selectedGame.LanguageId
        }
      );

      // Mettre à jour la liste des jeux
      const index = this.games.findIndex(g => g.id === updatedGame.id);
      if (index !== -1) {
        // Créer une nouvelle instance du tableau pour forcer la détection des changements
        this.games = [
          ...this.games.slice(0, index),
          { ...updatedGame },
          ...this.games.slice(index + 1)
        ];
      }

      this.cancelEdit();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du jeu:', error);
      this.error = 'Erreur lors de la mise à jour du jeu';
    }
  }

  deleteGame(gameId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
      this.gameService.deleteGame(gameId.toString())
        .then(() => {
          this.games = this.games.filter(game => game.id !== gameId);
        })
        .catch(error => {
          console.error('Erreur lors de la suppression:', error);
        });
    }
  }
}
