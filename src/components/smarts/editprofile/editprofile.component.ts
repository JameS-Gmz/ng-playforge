import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { InputFileComponent } from "../input-file/input-file.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css'
})
export class EditProfileComponent {
  user: any = {
    username: '',
    email: '',
    bio: '',
    avatar: '', // Utilisé pour stocker l'image de profil
    birthday: '' ,
    role: ''
  };
  selectedFile: File | null = null; // Pour stocker le fichier sélectionné
  successMessage: string | undefined;
  errorMessage: string | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Vérifier le contenu du token actuel
    this.authService.checkTokenContent();

    // Récupérer le profil de l'utilisateur connecté
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload au chargement:', payload);
      
      this.user.id = payload.userId;
      this.user.username = payload.username;
      this.user.email = payload.email;
      this.user.bio = payload.bio || '';
      this.user.avatar = payload.avatar || '';
      
      // Gestion de la date d'anniversaire
      if (payload.birthday) {
        console.log('Date trouvée dans le token:', payload.birthday);
        const date = new Date(payload.birthday);
        if (!isNaN(date.getTime())) {
          this.user.birthday = date.toISOString().split('T')[0];
          console.log('Date convertie:', this.user.birthday);
        } else {
          console.log('Date invalide dans le token');
          this.user.birthday = '';
        }
      } else {
        console.log('Aucune date dans le token');
        this.user.birthday = '';
      }
      
      this.user.role = payload.role || '';
      console.log('Données utilisateur chargées:', this.user);
    } else {
      console.log('Aucun token trouvé');
      this.router.navigate(['/signin']);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Veuillez sélectionner une image';
        return;
      }
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'L\'image ne doit pas dépasser 5MB';
        return;
      }
      this.selectedFile = file;
    }
  }

  async onSubmit() {
    const userData = {
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      bio: this.user.bio,
      avatar: this.user.avatar,
      birthday: this.user.birthday ? new Date(this.user.birthday).toISOString() : null,
      role: this.user.role
    };

    console.log('Données envoyées pour mise à jour:', userData);

    // Vérifier les champs obligatoires
    if (!userData.username || !userData.email) {
      this.errorMessage = 'Le nom d\'utilisateur et l\'email sont obligatoires';
      return;
    }
  
    try {
      const response = await this.authService.updateProfile(userData);
      console.log('Réponse de la mise à jour:', response);
      
      // Mettre à jour le token dans le localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Recharger les données utilisateur avec le nouveau token
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        this.user.birthday = payload.birthday ? new Date(payload.birthday).toISOString().split('T')[0] : '';
        console.log('Données utilisateur après mise à jour:', this.user);
      }
      
      this.successMessage = 'Profil mis à jour avec succès !';
      this.router.navigate(['/profile']);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error);
      this.errorMessage = 'Erreur lors de la mise à jour du profil.';
    }
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}
