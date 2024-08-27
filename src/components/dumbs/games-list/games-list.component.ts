import { Component } from '@angular/core';
import { CardGameComponent } from "../card-game/card-game.component";


@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [CardGameComponent],
  templateUrl: './games-list.component.html',
  styleUrl: './games-list.component.css'
})
export class GamesListComponent {
games :any[] = [];

addGame(game:any){
   this.games.push(game)
}
}
