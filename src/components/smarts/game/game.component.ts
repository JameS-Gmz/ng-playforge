import { AfterViewInit, Component, contentChild, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import {FormsModule, NgForm } from '@angular/forms';
import { InputFileComponent } from "../../dumbs/input-file/input-file.component";
import { CarouselComponent } from "../carousel/carousel.component";
import { CategoryCreateComponent } from "../../dumbs/category-create/category-create.component";
import { FormGameComponent } from "../../dumbs/form-game/form-game.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink, InputFileComponent, CarouselComponent, CategoryCreateComponent, FormGameComponent,FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements AfterViewInit{
  @ViewChild('postGameForm') postGameForm!: FormGameComponent;
  @ViewChild('categoryCreateForm') categoryCreateForm!: CategoryCreateComponent;

  // Vérifiez les références après que les vues sont initialisées
  ngAfterViewInit() {
    // Vérifiez si les références sont initialisées
    // console.log('formGame', this.postGameForm);
    // console.log('categoryCreate', this.categoryCreateForm);
  }

  onSubmit() {
    if (this.postGameForm && this.categoryCreateForm) {
      const postGameFormValid = this.postGameForm.isValid();
      const categoryCreateValid = this.categoryCreateForm.isValid();

      if (postGameFormValid && categoryCreateValid) {
        const postGameFormValues = this.postGameForm.getFormValues();
        const categoryCreateValues = this.categoryCreateForm.getFormValues();

        console.log('Form Game Values:',  postGameFormValues);
        console.log('Category Create Values:', categoryCreateValues);

        // Traitez ou envoyez les données ici
      } else {
        console.log('Un ou plusieurs formulaires sont invalides');
      }
    } else {
      console.error('Les références des formulaires ne sont pas initialisées');
    }
  }
}
