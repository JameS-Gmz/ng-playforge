import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-red',
  standalone: true,
  imports: [],
  templateUrl: './button-red.component.html',
  styleUrl: './button-red.component.css'
})
export class ButtonRedComponent {
@Input() text: String = ""
}
