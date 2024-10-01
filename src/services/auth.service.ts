// auth.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async signUp(userData : any): Promise<any> {
    const response = await fetch('http://localhost:9090/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }

    return response.json();
  }

  async signIn(userData : any): Promise<any> {
    const response = await fetch('http://localhost:9090/user/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la connexion');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);  // Stocker le token JWT
    return data;
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  async getUserProfile(): Promise<any> {
    try {
      const response = await fetch("http://localhost:9090/user/:id", {
        method: 'GET',
        credentials: 'include', // Si vous avez des cookies à gérer
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil utilisateur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async updateUserProfile(formData: any): Promise<any> {
    try {
      const response = await fetch(`http://localhost:9090/user/profile`, {
        method: 'PUT',
        body: JSON.stringify(formData), // FormData contient les données du profil utilisateur et l'avatar
        credentials: 'include', // Si vous avez des cookies à gérer
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil utilisateur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async updateProfileText(updatedProfile: any): Promise<any> {
    return await fetch('http://localhost:9090/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Token JWT
      },
      body: JSON.stringify(updatedProfile)
    })
    .then(response => response.json())
    .catch(error => {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    });
  }
}
