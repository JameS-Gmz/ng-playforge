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

    console.log('Token:', token);
    console.log('URL:', `${this.apiUrl}/library/games`);

    return this.http.get(`${this.apiUrl}/library/games`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).toPromise();
  }

  async addGameToLibrary(gameId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Utilisateur non connecté');
    }

    console.log('Token:', token);
    console.log('URL:', `${this.apiUrl}/library/games/${gameId}`);

    return this.http.post(`${this.apiUrl}/library/games/${gameId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).toPromise();
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