import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private baseUrl = 'http://localhost:9090';
  private apiUrl = `${this.baseUrl}/user`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  async getLibraryGames() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      console.log('Récupération des jeux de la bibliothèque...');
      console.log('Token utilisé:', token);
      
      const response = await this.http.get(`${this.apiUrl}/library/allgames`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).toPromise();
      
      console.log('Réponse de la bibliothèque:', response);
      return response;
    } catch (error: any) {
      console.error('Error getting library games:', error);
      // Si c'est une erreur 404 (bibliothèque vide), retourner un tableau vide
      if (error.status === 404) {
        return [];
      }
      // Pour les autres erreurs (401, 403, 500, etc.), propager l'erreur
      throw error;
    }
  }

  async addGameToLibrary(gameId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      console.log('Tentative d\'ajout du jeu à la bibliothèque:', gameId);
      console.log('Token utilisé:', token);
      
      const response = await this.http.post(`${this.apiUrl}/library/games/${gameId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).toPromise();
      
      console.log('Réponse de l\'ajout:', response);
      return response;
    } catch (error) {
      console.error('Error adding game to library:', error);
      throw error;
    }
  }

  async removeGameFromLibrary(gameId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Utilisateur non connecté');
    }

    console.log('Token:', token);
    console.log('URL:', `${this.apiUrl}/library/games/${gameId}`);

    return this.http.delete(`${this.apiUrl}/library/games/${gameId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).toPromise();
  }

  async isGameInLibrary(gameId: number): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    console.log('Token:', token);
    console.log('URL:', `${this.apiUrl}/library/games/${gameId}/check`);

    try {
      const response = await this.http.get<boolean>(`${this.apiUrl}/library/games/${gameId}/check`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).toPromise();
      return response || false;
    } catch (error) {
      console.error('Error checking if game is in library:', error);
      return false;
    }
  }
} 