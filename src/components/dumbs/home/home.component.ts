import { Component, OnInit } from '@angular/core';

import { GameDateListComponent } from "../../smarts/game-date-list/game-date-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GameDateListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{

 
}
