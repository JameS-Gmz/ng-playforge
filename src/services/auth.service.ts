// auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

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

    // Démarrer la vérification périodique du token
    this.startTokenCheck();
  }

  private startTokenCheck() {
    // Vérifier le token toutes les minutes
    this.tokenCheckInterval = setInterval(() => {
      if (!this.checkTokenExpiration()) {
        this.logout();
        this.router.navigate(['/auth']);
      }
    }, 60000); // 60000 ms = 1 minute
  }

  private stopTokenCheck() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }

  async signUp(userData: any): Promise<any> {
    try {
      console.log('Envoi des données d\'inscription:', userData); // Vérifier les données envoyées

      const response = await fetch('http://localhost:9090/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Réponse API échouée:', errorData);
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      const data = await response.json();
      console.log('Réponse API réussie:', data);

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      this.isLoggedInSubject.next(true);
      this.roleSubject.next(data.role);

      // Retourner l'ID de l'utilisateur depuis le token
      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      return tokenPayload.userId;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
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
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la connexion');
      }

      const data = await response.json();
      const token = data.token;

      if (token) {
        // Décoder le token pour vérifier son contenu
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Contenu du token après connexion:', payload);
        
        // Vérifier si la date est présente dans le token
        if (payload.birthday) {
          console.log('Date d\'anniversaire dans le token:', payload.birthday);
        } else {
          console.log('Aucune date d\'anniversaire dans le token');
        }

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
    console.log('User data:', userData);
    console.log('User token:', token);
    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    try {
      // Convertir la date en format ISO si elle existe
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
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
      }

      const data = await response.json(); 

      // Met à jour le token dans le localStorage avec les nouvelles données
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Vérifier que la date est bien dans le nouveau token
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        console.log('Nouveau token payload:', payload);
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

  // Ajout d'une méthode pour vérifier le contenu du token
  checkTokenContent() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Contenu actuel du token:', payload);
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

  checkTokenExpiration(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
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