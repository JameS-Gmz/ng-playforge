import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  /** Doit correspondre à la validation API (user.routes.ts) */
  readonly minPasswordLength = 8;

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  birthday = '';
  errorMessage = '';
  bio = '';

  constructor(
    private authService:AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async onSubmit() {
    this.errorMessage = '';
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    if (this.password.length < this.minPasswordLength) {
      this.errorMessage = `Le mot de passe doit contenir au moins ${this.minPasswordLength} caractères.`;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      birthday: this.birthday,
      bio :this.bio
    };
  
    try {
      await this.authService.signUp(userData);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      if (returnUrl) {
        await this.router.navigateByUrl(returnUrl);
      } else {
        await this.router.navigate(['/profile']);  // Redirection par défaut après inscription
      }
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : "Erreur lors de l'inscription";
    }
  }
}
