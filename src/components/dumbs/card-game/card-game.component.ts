import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-card-game',
  standalone: true,
  imports: [],
  templateUrl: './card-game.component.html',
  styleUrl: './card-game.component.css'
})
export class CardGameComponent {
@Input() game:any = {} 

}
