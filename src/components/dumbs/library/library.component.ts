import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { LibraryService } from '../../../services/library.service';
import { GameService } from '../../../services/game.service';
import { FileService } from '../../../services/file-service.service';
import { PlayInBrowserComponent } from "../play-in-browser/play-in-browser.component";
import { CarouselComponent } from "../../smarts/carousel/carousel.component";
import { RatingComponentComponent } from "../rating-component/rating-component.component";

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit, OnDestroy {
  games: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  redirectTimer: any;
  timeLeft: number = 15;

  constructor(
    private libraryService: LibraryService,
    private gameService: GameService,
    private fileService: FileService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadLibraryGames();
  }

  startRedirectTimer() {
    this.timeLeft = 15;
    if (this.redirectTimer) {
      clearInterval(this.redirectTimer);
    }
    this.redirectTimer = setInterval(() => {
      this.timeLeft--;
      console.log('Temps restant:', this.timeLeft);
      if (this.timeLeft <= 0) {
        clearInterval(this.redirectTimer);
        console.log('Redirection vers /auth');
        this.router.navigate(['/auth']).then(
          () => console.log('Navigation réussie'),
          err => console.error('Erreur de navigation:', err)
        );
      }
    }, 1000);
  }

  async loadLibraryGames() {
    try {
      this.loading = true;
      this.error = null;
      if (this.redirectTimer) {
        clearInterval(this.redirectTimer);
      }
      
      console.log('Chargement des jeux de la bibliothèque...');
      const libraryGames = await this.libraryService.getLibraryGames();
      console.log('Jeux reçus:', libraryGames);
      
      if (!libraryGames || !Array.isArray(libraryGames) || libraryGames.length === 0) {
        this.games = [];
        return;
      }

      this.games = await Promise.all((libraryGames as any[]).map(async (game: any) => {
        let imageUrl = '230213-jeux-video.jpg'; // Image par défaut
        try {
          console.log('Chargement des images pour le jeu:', game.id);
          const imageData = await this.fileService.getImagesURLS(game.id);
          if (imageData && imageData.length > 0 && imageData[0]?.url) {
            imageUrl = imageData[0].url;
          }
        } catch (error) {
          console.error('Erreur lors du chargement de l\'image:', error);
          // L'image par défaut sera utilisée
        }
        return {
          ...game,
          imageUrl
        };
      }));

      console.log('Jeux avec images:', this.games);
    } catch (error: any) {
      console.error('Erreur lors du chargement des jeux:', error);
      // Ne pas déclencher le timer si la bibliothèque est simplement vide
      if (error.message === 'Aucun jeu trouvé dans votre bibliothèque') {
        this.error = null;
        this.games = [];
      } else {
        this.error = error.message || 'Une erreur est survenue lors du chargement des jeux';
        this.games = [];
        this.startRedirectTimer();
      }
    } finally {
      this.loading = false;
    }
  }

  async removeFromLibrary(gameId: number) {
    if (confirm('Êtes-vous sûr de vouloir retirer ce jeu de votre bibliothèque ?')) {
      try {
        await this.libraryService.removeGameFromLibrary(gameId);
        this.games = this.games.filter(game => game.id !== gameId);
      } catch (error: any) {
        console.error('Erreur lors de la suppression du jeu:', error);
        this.error = error.message || 'Erreur lors de la suppression du jeu';
      }
    }
  }

  goToAuth() {
    console.log('Redirection manuelle vers /auth');
    this.router.navigate(['/auth']).then(
      () => console.log('Navigation manuelle réussie'),
      err => console.error('Erreur de navigation manuelle:', err)
    );
  }

  ngOnDestroy() {
    if (this.redirectTimer) {
      clearInterval(this.redirectTimer);
    }
  }
}
