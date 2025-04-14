import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from "../carousel/carousel.component";
import { RatingComponentComponent } from "../../dumbs/rating-component/rating-component.component";
import { FileService } from '../../../services/file-service.service';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule, CarouselComponent, RatingComponentComponent],
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  game: any = {};
  images: string[] = [];
  gameId!: string;
  
  // Propriétés pour les détails du jeu
  platforms: string[] = [];
  genres: string[] = [];
  tags: string[] = [];
  controllers: string[] = [];
  status: string = '';
  language: string = '';
  averageSession: string = '';

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadGame(id);
      }
    });
  }

  async loadGame(id: string) {
    try {
      // Récupérer les détails du jeu
      this.game = await this.gameService.getGameById(id);
      console.log('Game details:', this.game);
  
      // Récupérer les images associées au jeu
      const imageData = await this.fileService.getImagesURLS(this.game.id);
      this.images = imageData.map((image: { url: string }) => image.url);

      // Récupérer les informations des relations
      const [platforms, genres, tags, controllers, statuses, languages] = await Promise.all([
        this.gameService.getPlatforms(),
        this.gameService.getGenres(),
        this.gameService.getTags(),
        this.gameService.getControllers(),
        this.gameService.getStatuses(),
        this.gameService.getLanguages()
      ]); 

      // Simple correspondance ID -> nom
      if (this.game.PlatformId) {
        const platform = platforms.find((p: any) => p.id === this.game.PlatformId);
        if (platform) {
          this.platforms = [platform.name];
          console.log('Platform found:', platform.name);
        }
      }

      if (this.game.GenreId) {
        const genre = genres.find((g: any) => g.id === this.game.GenreId);
        if (genre) {
          this.genres = [genre.name];
          console.log('Genre found:', genre.name);
        }
      }

      if (this.game.TagId) {
        const tag = tags.find((t: any) => t.id === this.game.TagId);
        if (tag) {
          this.tags = [tag.name];
          console.log('Tag found:', tag.name);
        }
      }

      if (this.game.ControllerId) {
        const controller = controllers.find((c: any) => c.id === this.game.ControllerId);
        if (controller) {
          this.controllers = [controller.name];
          console.log('Controller found:', controller.name);
        }
      }

      if (this.game.StatusId) {
        const status = statuses.find((s: any) => s.id === this.game.StatusId);
        if (status) {
          this.status = status.name;
          console.log('Status found:', status.name);
        }
      }

      if (this.game.LanguageId) {
        const language = languages.find((l: any) => l.id === this.game.LanguageId);
        if (language) {
          this.language = language.name;
          console.log('Language found:', language.name);
        }
      }

      // Calculer la durée moyenne de session
      if (this.game.averageSession) {
        const hours = Math.floor(this.game.averageSession / 60);
        const minutes = this.game.averageSession % 60;
        this.averageSession = `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
      }

      console.log('Final component data:', {
        platforms: this.platforms,
        genres: this.genres,
        tags: this.tags,
        controllers: this.controllers,
        status: this.status,
        language: this.language,
        averageSession: this.averageSession
      });
  
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du jeu:", error);
    }
  }
}
