import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from "../carousel/carousel.component";
import { RatingComponentComponent } from "../../dumbs/rating-component/rating-component.component";
import { FileService } from '../../../services/file-service.service';
import { LibraryService } from '../../../services/library.service';
import { CommentService, Comment } from '../../../services/comment.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule, FormsModule, CarouselComponent, RatingComponentComponent],
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  game: any = {};
  images: string[] = [];
  gameId!: string;
  isInLibrary: boolean = false;
  loading: boolean = false;
  
  // Propriétés pour les détails du jeu
  platforms: string[] = [];
  genres: string[] = [];
  tags: string[] = [];
  controllers: string[] = [];
  status: string = '';
  language: string = '';
  averageSession: string = '';
  madeWith: string = '';
  rating: number = 0;

  // Propriétés pour les commentaires
  comments: Comment[] = [];
  averageRating: number = 0;
  totalComments: number = 0;
  totalRatings: number = 0;
  currentUserComment: Comment | null = null;
  isLoggedIn: boolean = false;
  currentUserId: number | null = null;

  // Formulaire de commentaire
  commentContent: string = '';
  commentRating: number = 0;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private fileService: FileService,
    private libraryService: LibraryService,
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            this.currentUserId = payload.userId || payload.id || null;
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
        }
      } else {
        this.currentUserId = null;
      }
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.gameId = id;
        this.loadGame(id);
        this.checkIfInLibrary();
        this.loadComments();
      }
    });
  }

  async checkIfInLibrary() {
    try {
      this.isInLibrary = await this.libraryService.isGameInLibrary(Number(this.gameId));
    } catch (error) {
      console.error('Erreur lors de la vérification de la bibliothèque:', error);
    }
  }

  async toggleLibrary() {
    if (this.loading) return;

    if (!this.isLoggedIn) {
      await this.router.navigate(['/auth'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }
    
    this.loading = true;
    try {
      if (this.isInLibrary) {
        await this.libraryService.removeGameFromLibrary(Number(this.gameId));
      } else {
        await this.libraryService.addGameToLibrary(Number(this.gameId));
      }
      this.isInLibrary = !this.isInLibrary;
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un jeu à la bibliothèque:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadGame(id: string) {
    try {
      // Récupérer les détails du jeu
      this.game = await this.gameService.getGameById(id);
  
      // Récupérer les images associées au jeu
      const imageData = await this.fileService.getImagesUrls(this.game.id);
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
        }
      }

      if (this.game.GenreId) {
        const genre = genres.find((g: any) => g.id === this.game.GenreId);
        if (genre) {
          this.genres = [genre.name];
        }
      }

      if (this.game.TagId) {
        const tag = tags.find((t: any) => t.id === this.game.TagId);
        if (tag) {
          this.tags = [tag.name];
        }
      }

      if (this.game.ControllerId) {
        const controller = controllers.find((c: any) => c.id === this.game.ControllerId);
        if (controller) {
          this.controllers = [controller.name];
        }
      }

      if (this.game.StatusId) {
        const status = statuses.find((s: any) => s.id === this.game.StatusId);
        if (status) {
          this.status = status.name;
        }
      }

      if (this.game.LanguageId) {
        const language = languages.find((l: any) => l.id === this.game.LanguageId);
        if (language) {
          this.language = language.name;
        }
      }

      // Calculer la durée moyenne de session
      if (this.game.averageSession) {
        const hours = Math.floor(this.game.averageSession / 60);
        const minutes = this.game.averageSession % 60;
        this.averageSession = `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
      }

    } catch (error) {
      console.error("Erreur lors de la récupération des détails du jeu:", error);
    }
  }

  // Helper pour obtenir le nom du statut de manière sécurisée
  getStatusName(): string {
    try {
      if (!this.game || !this.game.id) {
        return 'Non spécifié';
      }
      if (this.game.status && typeof this.game.status === 'object' && this.game.status.name) {
        return this.game.status.name;
      }
      if (this.status && typeof this.status === 'string') {
        return this.status;
      }
      return 'Non spécifié';
    } catch (error) {
      console.error('Erreur dans getStatusName:', error);
      return 'Non spécifié';
    }
  }

  // Helper pour obtenir le nom de la langue de manière sécurisée
  getLanguageName(): string {
    try {
      if (!this.game || !this.game.id) {
        return 'Non spécifiée';
      }
      if (this.game.language && typeof this.game.language === 'object' && this.game.language.name) {
        return this.game.language.name;
      }
      if (this.language && typeof this.language === 'string') {
        return this.language;
      }
      return 'Non spécifiée';
    } catch (error) {
      console.error('Erreur dans getLanguageName:', error);
      return 'Non spécifiée';
    }
  }

  getGenresNames(): string {
    if (!this.game?.genres || !Array.isArray(this.game.genres)) {
      return 'Non spécifié';
    }
    return this.game.genres.map((genre: any) => genre?.name || 'N/A').join(' / ');
  }

  getTagsNames(): string {
    if (!this.game?.tags || !Array.isArray(this.game.tags)) {
      return 'Non spécifié';
    }
    return this.game.tags.map((tag: any) => tag?.name || 'N/A').join(' / ');
  }

  // Helper pour obtenir le nom d'un genre de manière sécurisée
  getGenreName(genre: any): string {
    if (!genre) return 'N/A';
    if (typeof genre === 'string') return genre;
    if (genre && genre.name) return genre.name;
    return 'N/A';
  }

  // Helper pour obtenir le nom d'un tag de manière sécurisée
  getTagName(tag: any): string {
    if (!tag) return 'N/A';
    if (typeof tag === 'string') return tag;
    if (tag && tag.name) return tag.name;
    return 'N/A';
  }

  // Helper pour obtenir le nom d'une plateforme de manière sécurisée
  getPlatformName(platform: any): string {
    if (!platform) return 'N/A';
    if (typeof platform === 'string') return platform;
    if (platform && platform.name) return platform.name;
    return 'N/A';
  }

  // Helper pour obtenir le nom d'un contrôleur de manière sécurisée
  getControllerName(controller: any): string {
    if (!controller) return 'N/A';
    if (typeof controller === 'string') return controller;
    if (controller && controller.name) return controller.name;
    return 'N/A';
  }

  // Helper pour obtenir les genres de manière sécurisée
  getGenresList(): any[] {
    if (this.game?.genres && Array.isArray(this.game.genres) && this.game.genres.length > 0) {
      return this.game.genres.filter((g: any) => g != null);
    }
    if (this.genres && Array.isArray(this.genres) && this.genres.length > 0) {
      return this.genres.filter((g: any) => g != null);
    }
    return [];
  }

  // Helper pour obtenir les tags de manière sécurisée
  getTagsList(): any[] {
    if (this.game?.tags && Array.isArray(this.game.tags) && this.game.tags.length > 0) {
      return this.game.tags.filter((t: any) => t != null);
    }
    if (this.tags && Array.isArray(this.tags) && this.tags.length > 0) {
      return this.tags.filter((t: any) => t != null);
    }
    return [];
  }

  // Helper pour obtenir les plateformes de manière sécurisée
  getPlatformsList(): any[] {
    if (this.game?.platforms && Array.isArray(this.game.platforms) && this.game.platforms.length > 0) {
      return this.game.platforms.filter((p: any) => p != null);
    }
    if (this.platforms && Array.isArray(this.platforms) && this.platforms.length > 0) {
      return this.platforms.filter((p: any) => p != null);
    }
    return [];
  }

  // Helper pour obtenir les contrôleurs de manière sécurisée
  getControllersList(): any[] {
    if (this.game?.controllers && Array.isArray(this.game.controllers) && this.game.controllers.length > 0) {
      return this.game.controllers.filter((c: any) => c != null);
    }
    if (this.controllers && Array.isArray(this.controllers) && this.controllers.length > 0) {
      return this.controllers.filter((c: any) => c != null);
    }
    return [];
  }

  // Helper pour obtenir le champ "Made With" de manière sécurisée
  getMadeWith(): string {
    if (!this.game) {
      return 'Non spécifié';
    }
    
    // Essayer toutes les variantes possibles du nom du champ
    const madewith = this.game.madewith || this.game.madeWith || this.game.MadeWith || this.game['MadeWith'] || null;
    
    if (!madewith) {
      return 'Non spécifié';
    }
    
    if (typeof madewith === 'string' && madewith.trim() !== '') {
      return madewith.trim();
    }
    
    return 'Non spécifié';
  }

  // ============================================
  // GESTION DES COMMENTAIRES
  // ============================================

  async loadComments(): Promise<void> {
    try {
      const response = await this.commentService.getGameComments(Number(this.gameId));
      this.comments = response.comments;
      this.averageRating = response.averageRating;
      this.totalComments = response.totalComments;
      this.totalRatings = response.totalRatings;

      // Trouver le commentaire de l'utilisateur actuel s'il existe
      if (this.currentUserId) {
        this.currentUserComment = this.comments.find(c => c.user.id === this.currentUserId) || null;
        if (this.currentUserComment) {
          this.commentContent = this.currentUserComment.content || '';
          this.commentRating = this.currentUserComment.rating || 0;
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  }

  onRatingChange(rating: number): void {
    this.commentRating = rating;
  }

  async submitComment(): Promise<void> {
    if (!this.isLoggedIn) {
      this.errorMessage = 'Vous devez être connecté pour commenter';
      return;
    }

    if (this.commentRating === 0 && !this.commentContent.trim()) {
      this.errorMessage = 'Veuillez ajouter une note ou un commentaire';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      if (this.currentUserComment) {
        // Mettre à jour le commentaire existant
        await this.commentService.updateComment(
          this.currentUserComment.id,
          this.commentContent.trim(),
          this.commentRating || null
        );
      } else {
        // Créer un nouveau commentaire
        const newComment = await this.commentService.createComment(
          Number(this.gameId),
          this.commentContent.trim(),
          this.commentRating || null
        );
        this.currentUserComment = newComment;
      }

      // Recharger les commentaires pour mettre à jour la note moyenne
      await this.loadComments();
      
      // Réinitialiser le formulaire
      if (!this.currentUserComment) {
        this.commentContent = '';
        this.commentRating = 0;
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du commentaire:', error);
      this.errorMessage = error.message || 'Erreur lors de l\'envoi du commentaire';
    } finally {
      this.isSubmitting = false;
    }
  }

  async deleteComment(commentId: number): Promise<void> {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre commentaire ?')) {
      return;
    }

    try {
      await this.commentService.deleteComment(commentId);
      this.currentUserComment = null;
      this.commentContent = '';
      this.commentRating = 0;
      await this.loadComments();
    } catch (error: any) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      this.errorMessage = error.message || 'Erreur lors de la suppression du commentaire';
    }
  }

  canEditComment(comment: Comment): boolean {
    return this.isLoggedIn && this.currentUserId === comment.user.id;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getAvatarUrl(avatar: string | null | undefined): string {
    // Si pas d'avatar, retourner l'image par défaut depuis public/
    if (!avatar || avatar.trim() === '') {
      return '/Ago-Que-es-un-gamer_2.jpg';
    }

    // Si l'avatar est déjà une URL complète (commence par http:// ou https://)
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }

    // Si l'avatar est un chemin relatif vers un fichier uploadé
    // Les fichiers uploadés sont servis depuis http://localhost:9091/upload/
    if (avatar.startsWith('/upload/') || avatar.startsWith('upload/')) {
      const cleanPath = avatar.startsWith('/') ? avatar : `/${avatar}`;
      return `http://localhost:9091${cleanPath}`;
    }

    // Si c'est un chemin relatif vers les assets
    if (avatar.startsWith('/assets/') || avatar.startsWith('assets/')) {
      return avatar.startsWith('/') ? avatar : `/${avatar}`;
    }

    // Si c'est un chemin vers un fichier dans public/, le retourner tel quel
    if (avatar.startsWith('/')) {
      return avatar;
    }

    // Si c'est un nom de fichier simple, supposer qu'il est dans public/
    return `/${avatar}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/Ago-Que-es-un-gamer_2.jpg';
  }
}
