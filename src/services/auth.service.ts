import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Gestion de l’authentification côté client : stockage du JWT dans `localStorage`.
 * Les observables `isLoggedIn$` et `role$` notifient l’interface (menus, garde de navigation).
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private roleSubject = new BehaviorSubject<string | null>(null);
  private tokenCheckInterval: any;

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  role$ = this.roleSubject.asObservable();
  token$: any;

  constructor(private router: Router) {  
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    this.isLoggedInSubject.next(!!token);
    this.roleSubject.next(role);

    this.startTokenCheck();
  }

  private startTokenCheck() {
    // Vérification périodique (60 s) : en cas d’expiration du JWT, déconnexion et redirection vers l’authentification.
    // Aucun mécanisme de rafraîchissement de token : reconnexion manuelle requise.
    this.tokenCheckInterval = setInterval(() => {
      if (!this.checkTokenExpiration()) {
        this.logout();
        this.router.navigate(['/auth']);
      }
    }, 60000);
  }

  private stopTokenCheck() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }

  async signUp(userData: any): Promise<any> {
    try {
      const response = await fetch('http://localhost:9090/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorData: { message?: string; error?: string } = {};
        try {
          errorData = await response.json();
        } catch {
          /* ignore */
        }
        const msg =
          errorData.message ||
          errorData.error ||
          'Erreur lors de l\'inscription';
        throw new Error(msg);
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      this.isLoggedInSubject.next(true);
      this.roleSubject.next(data.role);

      // Le payload JWT est en base64url (2e segment) — on décode à la main pour récupérer userId sans lib ici.
      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      return tokenPayload.userId;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erreur lors de l'inscription");
    }
  }

  async signIn(userData: any): Promise<any> {
    try {
      const response = await fetch('http://localhost:9090/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errBody: { message?: string; error?: string } = {};
        try {
          errBody = await response.json();
        } catch {
          /* ignore */
        }
        throw new Error(
          errBody.message || errBody.error || 'Erreur lors de la connexion'
        );
      }

      const data = await response.json();
      const token = data.token;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', data.role);
      }

      this.isLoggedInSubject.next(true);
      this.roleSubject.next(data.role);

      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async updateProfile(userData: any): Promise<any> {
    const token = localStorage.getItem('token');
    const userId = userData.id;
    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    try {
      // L’API attend une chaîne ISO 8601 pour la date de naissance.
      const formattedUserData = {
        ...userData,
        birthday: userData.birthday ? new Date(userData.birthday).toISOString() : null
      };

      const response = await fetch(`http://localhost:9090/user/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(formattedUserData), 
      });

      if (!response.ok) {
        let errBody: { message?: string; error?: string } = {};
        try {
          errBody = await response.json();
        } catch {
          /* ignore */
        }
        throw new Error(
          errBody.message ||
            errBody.error ||
            'Erreur lors de la mise à jour du profil'
        );
      }

      const data = await response.json();

      // Mise à jour du jeton si le serveur en renvoie un nouveau (ex. modification du profil ou du rôle).
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedInSubject.next(false);
    this.roleSubject.next(null);
    this.stopTokenCheck();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  checkTokenContent() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    }
    return null;
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin'
    }
    return false;
  }

  isSuperAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'superadmin';
    }
    return false;
  }

  isDeveloper(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'developer';
    }
    return false;
  }

  checkTokenExpiration(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Champ `exp` du JWT exprimé en secondes ; `Date.now()` en millisecondes.
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      
      if (currentTime > expirationTime) {
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      this.logout();
      return false;
    }
  }
}