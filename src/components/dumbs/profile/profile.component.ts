import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any = {};  // Contiendra les informations de l'utilisateur

  constructor( private cdRef: ChangeDetectorRef,private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()){
      this.cdRef.detectChanges();
      this.loadUserProfile();
    }else{
      this.router.navigate(['/auth'])
    }
  } 


// Charger les informations de l'utilisateur (par exemple, depuis le token JWT ou une API)
loadUserProfile() {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.user = {
      username: payload.username,
      email: payload.email,
      role: payload.role,
      birhtday: payload.birthday,
    };
  }
}

// Méthode pour se déconnecter
logout() {
  this.authService.logout();
  this.router.navigate(['/auth']);  // Redirection vers la page d'authentification
}

editProfile() {
  this.router.navigate(['/editprofile'])
}
}
