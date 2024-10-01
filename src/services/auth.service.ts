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

  async signIn(userData: any): Promise<any> {
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
      localStorage.setItem('token', token);  // Stocker le token JWT dans le localStorage
    }
  
    return data;
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  async updateProfile(userData: any): Promise<any> {
    const token = localStorage.getItem('token');  // Récupérer le token JWT depuis le localStorage
    const userId = userData.id;

    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    try {
      const response = await fetch(`http://localhost:9090/user/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Ajouter le token JWT dans l'en-tête Authorization
        },
        body: JSON.stringify(userData), // Envoyer les données utilisateur en JSON
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      const data = await response.json();  // Parser la réponse en JSON
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }

  
}