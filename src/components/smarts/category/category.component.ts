import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {

    genres: any[] = [];
    platforms: any[] = [];
    languages: any[] = [];
    controllers: any[] = [];
    statuses: any[] = [];
    tags: any[] = [];
    selectedFilters: any = {};  // Stocker les filtres sélectionnés
    games: any[] = [];  // Jeux filtrés
  
    constructor(private gameService: GameService) {}
  
    async ngOnInit(): Promise<void> {

      try {
        this.genres = await this.gameService.getGenres();
        this.platforms = await this.gameService.getPlatforms();
        this.languages = await this.gameService.getLanguages();
        this.statuses = await this.gameService.getStatuses();
        this.tags = await this.gameService.getTags();
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    }
  
  
    // Méthode appelée lors de la modification d'un filtre
    onFilterChange(filterType: string,event : Event): void {
      const target = event.target as HTMLSelectElement;  // Caster l'EventTarget en HTMLSelectElement
  const selectedValue = target.value;
      this.selectedFilters[filterType] = selectedValue;
      this.fetchGames();
    }
  
    // Récupérer les jeux en fonction des filtres
    fetchGames(): void {
      this.gameService.getGamesByFilters(this.selectedFilters);
    }
  }