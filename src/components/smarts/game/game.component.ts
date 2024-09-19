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

  constructor(private gameService: GameService, private fileService :FileService) { }
  ngAfterViewInit(): void {
  
  }

  async onSubmit() {
    if (this.postGameForm && this.categoryCreateForm) {
      const postGameFormValues = this.postGameForm.getFormValues();
      const categoryCreateFormValues = this.categoryCreateForm.getFormValues();

      const gameData = {
        ...postGameFormValues,
       ...categoryCreateFormValues
      }
      try {
        const result = await this.gameService.sendGameData(gameData);
        console.log('Jeu créé avec succès:', result);
        
         // Si un fichier est sélectionné, upload le fichier
         if (this.postGameForm.selectedFile) {
          await this.fileService.uploadFile(this.postGameForm.selectedFile, result.id);
          console.log('Image uploadée avec succès');
        }

        this.postGameForm.resetForm();
        this.categoryCreateForm.resetForm();
        
      } catch (error) {
        console.error('Erreur lors de la création du jeu:', error);
      }
    }
  }
}
