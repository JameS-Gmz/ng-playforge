import { Component, OnInit } from '@angular/core';
import { GamesListComponent } from "../games-list/games-list.component";
import { GameComponent } from "../../smarts/game/game.component";
import { GameService } from '../../../services/game.service';
import { GameDateListComponent } from "../../smarts/game-date-list/game-date-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GamesListComponent, GameComponent, GameDateListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{

 
}
