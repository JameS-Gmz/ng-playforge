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

  ngOnInit() {
    // Récupérer le profil de l'utilisateur connecté
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.user.id = payload.userId;
      this.user.username = payload.username;
      this.user.email = payload.email;
      this.user.bio = payload.bio || '';
      this.user.avatar = payload.avatar || '';
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; // Gérer l'upload d'image
  }

  async onSubmit() {
    const userData = {
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      bio: this.user.bio,
      avatar: this.user.avatar // Optionnel si géré côté back-end
    };
  
    try {
      const response = await this.authService.updateProfile(userData);
      console.log('Réponse de la mise à jour:', response);
      alert('Profil mis à jour avec succès !');
      this.router.navigate(['/profile']);  // Redirection après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error);
      alert('Erreur lors de la mise à jour du profil.');
    }
  }

  cancel() {
    this.router.navigate(['/profile']); // Redirection vers la page de profil si annulation
  }
}
