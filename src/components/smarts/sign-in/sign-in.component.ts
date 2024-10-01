import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  standalone :true,
  imports : [FormsModule]
})
export class SignInComponent {
  email = '';
  password = '';
  

  constructor(private authService: AuthService, private router: Router) {}


  async onSubmit() {
    if (!this.email || !this.password) {
      alert('Veuillez entrer un email et un mot de passe');
      return;
    }

   const userData = {
      email: this.email,
      password : this.password
    }

    try {
      await this.authService.signIn(userData);
    this.router.navigate(['/profile']);  // Redirection après connexion
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      alert('Adresse mail ou mot de passe incorrect')
    }
  }
}
