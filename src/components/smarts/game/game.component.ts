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
    console.log('Début de la validation du formulaire');

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
    const categoryErrors: any = {};
    console.log('Validation des catégories:', {
      ControllerId: categoryCreateFormValues.ControllerId,
      PlatformId: categoryCreateFormValues.PlatformId,
      StatusId: categoryCreateFormValues.StatusId,
      LanguageId: categoryCreateFormValues.LanguageId,
      selectedTags: categoryCreateFormValues.selectedTags,
      selectedGenres: categoryCreateFormValues.selectedGenres
    });

    // Validation du contrôleur
    if (!categoryCreateFormValues.ControllerId) {
      categoryErrors.controller = 'Le contrôleur est obligatoire';
    } else if (typeof categoryCreateFormValues.ControllerId !== 'number') {
      categoryErrors.controller = 'Le contrôleur sélectionné est invalide';
    }

    // Validation de la plateforme
    if (!categoryCreateFormValues.PlatformId) {
      categoryErrors.platform = 'La plateforme est obligatoire';
    } else if (typeof categoryCreateFormValues.PlatformId !== 'number') {
      categoryErrors.platform = 'La plateforme sélectionnée est invalide';
    }

    // Validation du statut
    if (!categoryCreateFormValues.StatusId) {
      categoryErrors.status = 'Le statut est obligatoire';
    } else if (typeof categoryCreateFormValues.StatusId !== 'number') {
      categoryErrors.status = 'Le statut sélectionné est invalide';
    }

    // Validation de la langue
    if (!categoryCreateFormValues.LanguageId) {
      categoryErrors.language = 'La langue est obligatoire';
    } else if (typeof categoryCreateFormValues.LanguageId !== 'number') {
      categoryErrors.language = 'La langue sélectionnée est invalide';
    }

    // Validation des tags
    if (!categoryCreateFormValues.selectedTags?.length) {
      categoryErrors.tags = 'Au moins un tag est obligatoire';
    } else if (!Array.isArray(categoryCreateFormValues.selectedTags)) {
      categoryErrors.tags = 'Le format des tags sélectionnés est invalide';
    } else if (categoryCreateFormValues.selectedTags.length > 3) {
      categoryErrors.tags = 'Vous ne pouvez pas sélectionner plus de 3 tags';
    }

    // Validation des genres
    if (!categoryCreateFormValues.selectedGenres?.length) {
      categoryErrors.genres = 'Au moins un genre est obligatoire';
    } else if (!Array.isArray(categoryCreateFormValues.selectedGenres)) {
      categoryErrors.genres = 'Le format des genres sélectionnés est invalide';
    } else if (categoryCreateFormValues.selectedGenres.length > 5) {
      categoryErrors.genres = 'Vous ne pouvez pas sélectionner plus de 5 genres';
    }

    // N'ajouter les erreurs de catégories que s'il y en a
    if (Object.keys(categoryErrors).length > 0) {
      errors.categories = categoryErrors;
    }

    console.log('Erreurs de validation trouvées:', errors);
    return errors;
  }

  async onSubmit() {
    console.log('Début de la soumission du formulaire');
    
    if (!this.postGameForm || !this.categoryCreateForm) {
      console.error('Formulaires non initialisés:', {
        postGameForm: !!this.postGameForm,
        categoryCreateForm: !!this.categoryCreateForm
      });
      this.showError({ general: 'Erreur: Formulaire non initialisé' });
      return;
    }

    const postGameFormValues = this.postGameForm.getFormValues();
    const categoryCreateFormValues = this.categoryCreateForm.getFormValues();
    console.log('Valeurs du formulaire de jeu:', postGameFormValues);
    console.log('Valeurs du formulaire de catégories:', categoryCreateFormValues);

    const userId = this.getUserIdFromToken();
    console.log('UserID récupéré:', userId);

    if (!userId) {
      this.showError({ general: 'Erreur: Vous devez être connecté pour créer un jeu' });
      return;
    }

    // Validation du formulaire
    const errors = this.validateForm(postGameFormValues, categoryCreateFormValues);
    if (Object.keys(errors).length > 0) {
      console.log('Erreurs de validation:', errors);
      this.showError(errors);
      return;
    }

    const gameData = {
      ...postGameFormValues,
      ...categoryCreateFormValues,
      UserId: userId
    };
    console.log('Données complètes du jeu à envoyer:', gameData);

    try {
      // Envoyer les données du jeu
      console.log('Tentative d\'envoi des données du jeu...');
      const result = await this.gameService.sendGameData(gameData);
      console.log('Jeu créé avec succès:', result);

      const GameId = result.id;
      const ControllerId = gameData.ControllerId;
      const PlatformId = gameData.PlatformId;
      const StatusId = gameData.StatusId;
      const LanguageId = gameData.LanguageId;
      const TagId = gameData.selectedTags;
      const GenreId = gameData.selectedGenres;

      console.log('Données pour l\'association des catégories:', {
        GameId,
        ControllerId,
        PlatformId,
        StatusId,
        LanguageId,
        TagId,
        GenreId
      });

      // Associer l'élément sélectionné au jeu
      if (GameId) {
        console.log('Tentative d\'association des catégories...');
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
          console.log('Tentative d\'upload du fichier...');
          await this.fileService.uploadFile(this.postGameForm.selectedFile, GameId);
        }

        this.showSuccess('Jeu créé avec succès !');
        
        // Réinitialiser les formulaires
        this.postGameForm.resetForm();
        this.categoryCreateForm.resetForm();
      }
    } catch (error: any) {
      console.error('Erreur détaillée lors de la création du jeu:', error);
      this.showError({ 
        general: error.message || 'Erreur lors de la création du jeu'
      });
    }
  }
}
