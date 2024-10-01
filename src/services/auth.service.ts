// auth.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

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
      console.log('Réponse API réussie:', data);  // Vérifier la réponse réussie

      // Stocker le token JWT dans localStorage
      localStorage.setItem('token', data.token);

      // Retourner l'ID de l'utilisateur depuis le token
      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      return tokenPayload.userId;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
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
}