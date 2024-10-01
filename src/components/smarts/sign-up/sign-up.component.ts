import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  standalone : true,
  imports : [FormsModule,CommonModule],
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  birthday = '';
  errorMessage = '';

  constructor(private authService:AuthService, private router: Router) {}

  async onSubmit() {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }
  
    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
  
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      birthday: this.birthday
    };
  
    try {
      console.log('Envoi des données utilisateur pour inscription:', userData);
      await this.authService.signUp(userData);
      this.router.navigate(['/profile']);  // Rediriger après l'inscription
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Erreur lors de l\'inscription: ' + error);
    }
  }
}
