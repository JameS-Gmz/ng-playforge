import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../services/game.service';
import { CategoryCreateComponent } from '../../dumbs/category-create/category-create.component';
import { FormGameComponent } from '../../dumbs/form-game/form-game.component';
import { CarouselComponent } from "../carousel/carousel.component";
import { FileService } from '../../../services/file-service.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FormsModule, CategoryCreateComponent, FormGameComponent, CarouselComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {
  @ViewChild('postGameForm') postGameForm!: FormGameComponent;
  @ViewChild('categoryCreateForm') categoryCreateForm!: CategoryCreateComponent;

  images: string[] = [
    '/Ago-Que-es-un-gamer_2.jpg',
    '/chiffres-jeu-video.jpg',
    '/230213-jeux-video.jpg'
  ];

  constructor(
    private gameService: GameService,
    private fileService: FileService,
  ) {}

  ngAfterViewInit(): void {}



  async onSubmit() {
    if (this.postGameForm && this.categoryCreateForm) {
      const postGameFormValues = this.postGameForm.getFormValues();
      const categoryCreateFormValues = this.categoryCreateForm.getFormValues();
  
      const gameData = {
        ...postGameFormValues,
        ...categoryCreateFormValues,
      };
  
    
      try {
        // Envoyer les données du jeu
        const result = await this.gameService.sendGameData(gameData);
        console.log('Jeu créé avec succès:', result);

        const GameId = result.id;
        const ControllerId = gameData.ControllerId;
        const PlatformId = gameData.PlatformId;
        const LanguageId = gameData.LanguageId;
        const StatusId = gameData.StatusId



        console.log(GameId)
        console.log(ControllerId)
        console.log(PlatformId)
        console.log(LanguageId)
        console.log(StatusId)
      

        // Associer l'élément sélectionné au jeu
        if (GameId || ControllerId || PlatformId || StatusId || LanguageId) {
          await this.gameService.associateGameWithCategories(GameId, ControllerId, PlatformId,StatusId, LanguageId);
          console.log('Élément associé avec succès au jeu');
        }

        // Si un fichier est sélectionné, upload le fichier
        if (this.postGameForm.selectedFile) {
          await this.fileService.uploadFile(this.postGameForm.selectedFile, GameId);
          console.log('Image uploadée avec succès');
        }

        // Réinitialiser les formulaires
        this.postGameForm.resetForm();
        this.categoryCreateForm.resetForm();
      } catch (error) {
        console.error('Erreur lors de la création du jeu:', error);
      }
    }
  }
}
