// auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private roleSubject = new BehaviorSubject<string | null>(null);


  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  role$ = this.roleSubject.asObservable();

  constructor() {  
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    this.isLoggedInSubject.next(!!token);
    this.roleSubject.next(role);
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
    try  { const response = await fetch('http://localhost:9090/user/signin', {
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
      localStorage.setItem('token', token);
      localStorage.setItem('role', data.role);  // Stocker le token JWT dans le localStorage
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

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    const response = await fetch(`http://localhost:9090/user/profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  
      },
      body: JSON.stringify(userData), 
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du profil');
    }

    const data = await response.json(); 
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
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }



}