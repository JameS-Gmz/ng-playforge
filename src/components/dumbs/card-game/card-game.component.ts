import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-card-game',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './card-game.component.html',
  styleUrl: './card-game.component.css'
})
export class CardGameComponent {
@Input() game:any = {} 

}
