import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../services/game.service';
import { CategoryCreateComponent } from '../category-create/category-create.component';
import { FormGameComponent } from '../form-game/form-game.component';
import { CarouselComponent } from "../carousel/carousel.component";
import { FileService } from '../../../services/file-service.service';
import { UserService } from '../../../services/user.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

interface FormErrors {
  title?: string;
  price?: string;
  description?: string;
  categories?: {
    controller?: string;
    platform?: string;
    status?: string;
    language?: string;
    tags?: string;
    genres?: string;
  };
  general?: string;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FormsModule, CategoryCreateComponent, FormGameComponent, CarouselComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {
  @ViewChild('postGameForm') postGameForm!: FormGameComponent;
  @ViewChild('categoryCreateForm') categoryCreateForm!: CategoryCreateComponent;

  formErrors: FormErrors = {};
  hasErrors: boolean = false;
  isSuccess: boolean = false;
  successMessage: string = '';

  images: string[] = [
    '/Ago-Que-es-un-gamer_2.jpg',
    '/chiffres-jeu-video.jpg',
    '/230213-jeux-video.jpg'
  ];

  constructor(
    private gameService: GameService,
    private fileService: FileService,
    private userService: UserService
  ) { }

  ngAfterViewInit(): void { }

  private getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  private showError(errors: FormErrors) {
    this.formErrors = errors;
    this.hasErrors = true;
    this.isSuccess = false;
    // Faire disparaître les messages d'erreur après 5 secondes
    setTimeout(() => {
      this.hasErrors = false;
      this.formErrors = {};
    }, 5000);
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.isSuccess = true;
    this.hasErrors = false;
    // Faire disparaître le message de succès après 5 secondes
    setTimeout(() => {
      this.isSuccess = false;
      this.successMessage = '';
    }, 5000);
  }

  private validateForm(postGameFormValues: any, categoryCreateFormValues: any): FormErrors {
    const errors: FormErrors = {};

    // Validation des champs du jeu
    if (!postGameFormValues.title?.trim()) {
      errors.title = 'Le titre du jeu est obligatoire';
    } else if (postGameFormValues.title.length > 100) {
      errors.title = 'Le titre ne doit pas dépasser 100 caractères';
    }

    // Validation améliorée du prix
    const price = postGameFormValues.price;
    if (price === undefined || price === null || price === '') {
      errors.price = 'Le prix est obligatoire';
    } else {
      const numericPrice = Number(price);
      if (isNaN(numericPrice)) {
        errors.price = 'Le prix doit être un nombre valide';
      } else if (numericPrice < 0) {
        errors.price = 'Le prix ne peut pas être négatif';
      } else if (numericPrice > 100) {
        errors.price = 'Le prix ne peut pas dépasser 100';
      }
    }

    if (!postGameFormValues.description?.trim()) {
      errors.description = 'La description du jeu est obligatoire';
    } else if (postGameFormValues.description.length > 1500) {
      errors.description = 'La description ne doit pas dépasser 1500 caractères';
    }
    // Validation des catégories
    errors.categories = {};

    // Validation du contrôleur
    if (!categoryCreateFormValues.ControllerId) {
      errors.categories.controller = 'Le contrôleur est obligatoire';
    } else if (typeof categoryCreateFormValues.ControllerId !== 'number') {
      errors.categories.controller = 'Le contrôleur sélectionné est invalide';
    }

    // Validation de la plateforme
    if (!categoryCreateFormValues.PlatformId) {
      errors.categories.platform = 'La plateforme est obligatoire';
    } else if (typeof categoryCreateFormValues.PlatformId !== 'number') {
      errors.categories.platform = 'La plateforme sélectionnée est invalide';
    }

    // Validation du statut
    if (!categoryCreateFormValues.StatusId) {
      errors.categories.status = 'Le statut est obligatoire';
    } else if (typeof categoryCreateFormValues.StatusId !== 'number') {
      errors.categories.status = 'Le statut sélectionné est invalide';
    }

    // Validation de la langue
    if (!categoryCreateFormValues.LanguageId) {
      errors.categories.language = 'La langue est obligatoire';
    } else if (typeof categoryCreateFormValues.LanguageId !== 'number') {
      errors.categories.language = 'La langue sélectionnée est invalide';
    }

    // Validation des tags
    if (!categoryCreateFormValues.selectedTags?.length) {
      errors.categories.tags = 'Au moins un tag est obligatoire';
    } else if (!Array.isArray(categoryCreateFormValues.selectedTags)) {
      errors.categories.tags = 'Le format des tags sélectionnés est invalide';
    } else if (categoryCreateFormValues.selectedTags.length > 3) {
      errors.categories.tags = 'Vous ne pouvez pas sélectionner plus de 3 tags';
    }

    // Validation des genres
    if (!categoryCreateFormValues.selectedGenres?.length) {
      errors.categories.genres = 'Au moins un genre est obligatoire';
    } else if (!Array.isArray(categoryCreateFormValues.selectedGenres)) {
      errors.categories.genres = 'Le format des genres sélectionnés est invalide';
    } else if (categoryCreateFormValues.selectedGenres.length > 5) {
      errors.categories.genres = 'Vous ne pouvez pas sélectionner plus de 5 genres';
    }

    return Object.keys(errors).length > 0 ? errors : {};
  }

  async onSubmit() {
    if (!this.postGameForm || !this.categoryCreateForm) {
      this.showError({ general: 'Erreur: Formulaire non initialisé' });
      return;
    }

    const postGameFormValues = this.postGameForm.getFormValues();
    const categoryCreateFormValues = this.categoryCreateForm.getFormValues();
    const userId = this.getUserIdFromToken();

    if (!userId) {
      this.showError({ general: 'Erreur: Vous devez être connecté pour créer un jeu' });
      return;
    }

    // Validation du formulaire
    const errors = this.validateForm(postGameFormValues, categoryCreateFormValues);
    if (Object.keys(errors).length > 0) {
      this.showError(errors);
      return;
    }

    const gameData = {
      ...postGameFormValues,
      ...categoryCreateFormValues,
      UserId: userId
    };

    try {
      // Envoyer les données du jeu
      const result = await this.gameService.sendGameData(gameData);
      console.log('Jeu créé avec succès:', result);

      const GameId = result.id;
      const ControllerId = gameData.ControllerId;
      const PlatformId = gameData.PlatformId;
      const StatusId = gameData.StatusId;
      const LanguageId = gameData.LanguageId;
      const TagId = gameData.selectedTags;
      const GenreId = gameData.selectedGenres;

      // Associer l'élément sélectionné au jeu
      if (GameId) {
        await this.gameService.associateGameWithCategories(
          GameId,
          ControllerId,
          PlatformId,
          StatusId,
          LanguageId,
          TagId,
          GenreId
        );

        // Si un fichier est sélectionné, upload le fichier
        if (this.postGameForm.selectedFile) {
          await this.fileService.uploadFile(this.postGameForm.selectedFile, GameId);
        }

        this.showSuccess('Jeu créé avec succès !');
        
        // Réinitialiser les formulaires
        this.postGameForm.resetForm();
        this.categoryCreateForm.resetForm();
      }
    } catch (error: any) {
      console.error('Erreur lors de la création du jeu:', error);
      this.showError({ 
        general: error.message || 'Erreur lors de la création du jeu'
      });
    }
  }
}
