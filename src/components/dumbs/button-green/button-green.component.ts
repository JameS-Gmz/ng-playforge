import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-green',
  standalone: true,
  imports: [],
  templateUrl: './button-green.component.html',
  styleUrl: './button-green.component.css'
})
export class ButtonGreenComponent {

@Input() text: String = ""

}
