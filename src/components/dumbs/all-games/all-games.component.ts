import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardGameComponent } from "../card-game/card-game.component";
import { GameService } from '../../../services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-games',
  standalone: true,
  imports: [RouterLink, CardGameComponent, CommonModule],
  templateUrl: './all-games.component.html',
  styleUrls: ['./all-games.component.css']
})
export class AllGamesComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  isLoading = true; // Indicateur de chargement
  errorMessage: string | null = null; // Message d'erreur

  constructor(
    private gameService: GameService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.loadGames();
  }

  private async loadGames() {
    try {
      const games = await this.gameService.getAllGames();
      this.renderGames(games);
    } catch (error) {
      console.error('Erreur lors de la récupération des jeux :', error);
      this.errorMessage = 'Erreur lors de la récupération des jeux. Veuillez réessayer plus tard.';
    } finally {
      this.isLoading = false;
    }
  }

  private renderGames(games: any[]) {
    this.container.clear();

    games
      .filter(game => game.title)  // Vérification pour s'assurer que chaque jeu a un titre
      .forEach(game => {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CardGameComponent);
        const componentRef = this.container.createComponent(componentFactory);
        componentRef.instance.game = game;  // Passe les données du jeu au composant enfant
      });
  }
}
