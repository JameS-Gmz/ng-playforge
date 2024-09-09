import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { CardGameComponent } from "../../dumbs/card-game/card-game.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-date-list',
  standalone: true,
  imports: [CardGameComponent, CommonModule
  ],
  templateUrl: './game-date-list.component.html',
  styleUrl: './game-date-list.component.css'
})
export class GameDateListComponent implements OnInit {
  games: any[] = [];
  isLoading = true;

  constructor(private gameService: GameService) { }

  async ngOnInit() {
    try {
      this.games = await this.gameService.getGamesByDate();
    } catch (error) {
      console.error('Erreur lors de la récupération des jeux:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
