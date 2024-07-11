import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonGreenComponent } from '../../dumbs/button-green/button-green.component';
import { ButtonRedComponent } from "../../dumbs/button-red/button-red.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink, ButtonGreenComponent, ButtonRedComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
title = '';
printvalue():void {
  console.log(this.title)
}
  
}
