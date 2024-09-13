import { Component, ComponentFactoryResolver, OnInit, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardGameComponent } from "../card-game/card-game.component";
import { GameService } from '../../../services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-games',
  standalone: true,
  imports: [RouterLink, CardGameComponent,CommonModule],
  templateUrl: './all-games.component.html',
  styleUrl: './all-games.component.css'
})
export class AllGamesComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  isLoading = true; // Indicateur de chargement

  constructor(
    private gameService: GameService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}


  ngOnInit() {
    this.gameService.getAllGames().then((games: any[]) => {
      this.renderGames(games);
      this.isLoading = false;
    }).catch(error => {
      console.error('Erreur lors de la récupération des jeux :', error);
      this.isLoading = false;
    });
  }

  private renderGames(games: any[]) {
    this.container.clear();

    games
    .filter(game => game.title)
    .forEach(game => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CardGameComponent);
      const componentRef = this.container.createComponent(componentFactory);

      // Passez les données du jeu au composant enfant
      componentRef.instance.game = game;  // Assurez-vous que 'name' correspond à votre champ de données
    });
  }
  
}
