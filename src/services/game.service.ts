import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  
  // Méthode GET générique
  private async getData(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des données : ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      throw error;
    }
  }
  // Méthode POST générique
  private async postData(url: string, data: any): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Erreur lors de l'envoi des données : ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données:', error);
      throw error;
    }
  }

  private baseUrl = 'http://localhost:9090';

  constructor() { }

  // Méthode pour envoyer les données du jeu
  async sendGameData(gameData: any): Promise<any> {
    const token = localStorage.getItem('token');  // Récupérer le token JWT depuis le localStorage
  
    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }
  
    const response = await fetch(`${this.baseUrl}/game/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Ajouter le token JWT dans l'en-tête Authorization
      },
      body: JSON.stringify(gameData),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'envoi des données du jeu');
    }
  
    return await response.json();  // Retourner la réponse JSON
  }

  // Méthode pour récupérer tous les jeux
  async getAllGames(): Promise<any> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }

    const response = await fetch(`${this.baseUrl}/game/AllGames`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des jeux');
    }

    return await response.json();
  }

  // Méthode pour récupérer un jeu par ID
  async getGameById(gameId: string): Promise<any> {
    return this.getData(`${this.baseUrl}/game/id/${gameId}`);
  }

  // Méthode pour récupérer les jeux triés par date
  async getGamesByDate(): Promise<any> {
    return this.getData(`${this.baseUrl}/game/sequence/date`);
  }

  // Méthode pour rechercher des jeux
  async searchGames(query: string): Promise<any> {
    return this.getData(`${this.baseUrl}/game/search?q=${query}`);
  }

  // Méthode pour associer les catégories à un jeu
  async associateGameWithCategories(GameId: any, ControllerId: any, PlatformId: any, LanguageId: any, StatusId: any, tagId :any , genreId :any): Promise<any> {
    if (!GameId || !ControllerId || !PlatformId || !LanguageId || !StatusId) {
      throw new Error('Les identifiants du jeu, des catégories, ou des plateformes sont manquants.');
    }
    
    const payload = { GameId, ControllerId, PlatformId, LanguageId, StatusId };
    return this.postData(`${this.baseUrl}/game/associate-categories`, payload);
  }

  async getControllers(): Promise<any>{
    return this.getData(`${this.baseUrl}/controllers/all`)
  }

  async getGenres(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/genres`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des genres');
    }
    return await response.json();
  }

  // Récupérer les plateformes
  async getPlatforms():  Promise<any> {
    const response = await fetch(`${this.baseUrl}/platforms`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des plateformes');
    }
    return await response.json();
  }

  // Récupérer les langues
  async getLanguages():  Promise<any> {
    const response = await fetch(`${this.baseUrl}/languages`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des langues');
    }
    return await response.json();
  }

  // Récupérer les statuts
  async getStatuses(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/statuses/all`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statuts');
    }
    return await response.json();
  }

  // Récupérer les tags
  async getTags(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/tags`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des tags');
    }
    return await response.json();
  }

  getGamesByFilters(filters: any): Promise<any> {
    return this.postData(`${this.baseUrl}/game/filter`, filters);
  }

  deleteGame(gameId: string): Promise<any> {
    return this.postData(`${this.baseUrl}/game/delete/${gameId}`, {});
  }

  async updateGame(gameId: string, gameData: any): Promise<any> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }

    const response = await fetch(`${this.baseUrl}/game/update/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour du jeu');
    }

    return await response.json();
  }

}

