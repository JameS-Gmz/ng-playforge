import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from "../../smarts/carousel/carousel.component";
import { RatingComponentComponent } from "../rating-component/rating-component.component";

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CarouselComponent, RatingComponentComponent],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent implements OnInit{
  game: any;

  constructor(private route: ActivatedRoute, private gameService: GameService) {}

  async ngOnInit(): Promise<any> {
  const gameId = this.route.snapshot.paramMap.get('id');
if (gameId) {
  this.game = await this.gameService.getGameById(gameId)
} }

}
