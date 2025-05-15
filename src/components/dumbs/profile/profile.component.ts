import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  imports: [CommonModule],
  styleUrls: ['./profile.component.css'],
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: any = {};  // Contiendra les informations de l'utilisateur
  private tokenSubscription: Subscription | undefined;
  isAdmin: boolean = false;
  isDeveloper: boolean = false;

  constructor(private cdRef: ChangeDetectorRef, private authService: AuthService, private router: Router) {
    // S'abonner aux changements de token
    this.tokenSubscription = this.authService.token$?.subscribe(() => {
      this.loadUserProfile();
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.cdRef.detectChanges();
      this.loadUserProfile();
    } else {
      this.router.navigate(['/auth']);
    }
  }

  ngOnDestroy(): void {
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
  }

  // Charger les informations de l'utilisateur depuis le token JWT
  loadUserProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.user = {
        username: payload.username,
        email: payload.email,
        role: payload.role,
        birthday: payload.birthday ? new Date(payload.birthday).toLocaleDateString('en-EN') : null,
        bio: payload.bio,
        avatar: payload.avatar
      };
      this.isAdmin = payload.role === 'admin' || payload.role === 'superadmin';
      this.isDeveloper = payload.role === 'developer';
      console.log('isAdmin value:', this.isAdmin);
      console.log('isDeveloper value:', this.isDeveloper);
      
      this.cdRef.detectChanges();
    }
  }

  // Méthode pour se déconnecter
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);  // Redirection vers la page d'authentification
  }

  editProfile() {
    this.router.navigate(['/editprofile']);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  goToDeveloper() {
    this.router.navigate(['/developer']);
  }

  checkTokenExpiration() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      if (currentTime > expirationTime) {
        this.authService.logout();
        this.router.navigate(['/auth']);
        return false;
      }
      return true;
    }
    return false;
  }
}
