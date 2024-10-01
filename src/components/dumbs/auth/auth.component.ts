import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SignUpComponent } from "../../smarts/sign-up/sign-up.component";
import { SignInComponent } from "../../smarts/sign-in/sign-in.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterLink, SignUpComponent, SignInComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  isLoginMode = true;  // Toggle between login and signup mode


  constructor() { }

  toggleMode(event:Event) {
    event.preventDefault();  // Empêche la page de recharger
    this.isLoginMode = !this.isLoginMode;  // Inverse le mode
  }

 

 
}
