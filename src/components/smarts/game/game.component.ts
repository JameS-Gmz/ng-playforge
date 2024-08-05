import { Component, contentChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonGreenComponent } from '../../dumbs/button-green/button-green.component';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { InputFileComponent } from "../../dumbs/input-file/input-file.component";
import { CarouselComponent } from "../carousel/carousel.component";
import { CategoryCreateComponent } from "../../dumbs/category-create/category-create.component";
import { FormGameComponent } from "../../dumbs/form-game/form-game.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink, ButtonGreenComponent, InputFileComponent, CarouselComponent, CategoryCreateComponent, FormGameComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {


}
