import { Component } from '@angular/core';
import { GamesListComponent } from "../games-list/games-list.component";
import { GameComponent } from "../../smarts/game/game.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GamesListComponent, GameComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
