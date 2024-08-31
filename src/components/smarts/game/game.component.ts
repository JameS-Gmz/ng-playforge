import { AfterViewInit, Component, contentChild, EventEmitter, Output, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { InputFileComponent } from "../../dumbs/input-file/input-file.component";
import { CarouselComponent } from "../carousel/carousel.component";
import { CategoryCreateComponent } from "../../dumbs/category-create/category-create.component";
import { FormGameComponent } from "../../dumbs/form-game/form-game.component";
import { Title } from '@angular/platform-browser';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink, InputFileComponent, CarouselComponent, CategoryCreateComponent, FormGameComponent, FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements AfterViewInit {
  @ViewChild('postGameForm') postGameForm!: FormGameComponent;
  @ViewChild('categoryCreateForm') categoryCreateForm!: CategoryCreateComponent;

  constructor(private gameService: GameService) { }

  ngAfterViewInit() {
    // Vérifiez si les références sont initialisées
    // console.log('formGame', this.postGameForm);
    // console.log('categoryCreate', this.categoryCreateForm);
  }


  async onSubmit() {


    if (this.postGameForm && this.categoryCreateForm) {
      const postGameFormValid = this.postGameForm.isValid();
      const categoryCreateValid = this.categoryCreateForm.isValid();

      if (postGameFormValid && categoryCreateValid) {
        const { title, description, price } = this.postGameForm.getFormValues();
        const { authorStudio, madewith, category } = this.categoryCreateForm.getFormValues();

        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Author/Studio:', authorStudio);
        console.log('Made With:', madewith);
        console.log('price', price);


        const gameData = {
          title,
          description,
          price,
          authorStudio,
          madewith
        }

        try {
          const createdGame = await this.gameService.sendGameData(gameData)
          const gameId = createdGame.id;

          console.log('Données envoyées avec succès:', createdGame);
          // Gérer la réponse ou effectuer une redirection si nécessaire
        
          const selectedGenres = category

          if(selectedGenres > 0){
            await this.gameService.associateGameWithGenres(gameId,selectedGenres);
            console.log('Catégories associées avec succès.');
          }

        } catch (error)  {
          console.error('Erreur lors de l\'envoi des données:', error);
          // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
        };

        // Traitez ou envoyez les données ici
      } else {
        console.log('Un ou plusieurs formulaires sont invalides');
      }
    } else {
      console.error('Les références des formulaires ne sont pas initialisées');
    }
  }


}
