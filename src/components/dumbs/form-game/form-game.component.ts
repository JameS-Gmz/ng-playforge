import { Component } from '@angular/core';
import { InputFileComponent } from "../input-file/input-file.component";

@Component({
  selector: 'app-form-game',
  standalone: true,
  imports: [InputFileComponent],
  templateUrl: './form-game.component.html',
  styleUrl: './form-game.component.css'
})
export class FormGameComponent {

}
