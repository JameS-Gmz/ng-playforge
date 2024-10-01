import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { InputFileComponent } from "../input-file/input-file.component";

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [FormsModule, InputFileComponent],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css'
})
export class EditProfileComponent {
  user: any = {
    username: '',
    email: '',
    bio: '',
    avatar: '', // Utilisé pour stocker l'image de profil
  };
  selectedFile: File | null = null; // Pour stocker le fichier sélectionné

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() { // Récupérer les informations de l'utilisateur connecté
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.user = {
        username: payload.username,
        email: payload.email,
        role: payload.role
      };
    }
  }

  onSubmit() {
  }

  cancel() {
    this.router.navigate(['/profile']); // Redirection vers la page de profil si annulation
  }
}
