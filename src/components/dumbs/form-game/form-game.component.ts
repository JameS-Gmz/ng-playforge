import { Component } from '@angular/core';
import { InputFileComponent } from "../input-file/input-file.component";
import { FormBuilder} from "@angular/forms";
import { GameService } from '../../../services/game.service';
@Component({
  selector: 'app-form-game',
  standalone: true,
  imports: [InputFileComponent],
  templateUrl: './form-game.component.html',
  styleUrl: './form-game.component.css'
})
export class FormGameComponent {
OnSubmit() {
  this.Info = this.gameService.clearGame();
  console.warn('Your order has been submitted', this.postGame.value);
  this.postGame.reset();
  console.log(this.postGame.value)
}

  postGame = this.formBuilder.group({
   title: "",
   description:""
  });

  constructor(
    private gameService : GameService,
    private formBuilder: FormBuilder
  ){}

  Info = this.gameService.getInfo()

}
