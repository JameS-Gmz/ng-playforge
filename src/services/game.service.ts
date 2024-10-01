import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private baseUrl = 'http://localhost:9090/game';

  constructor() { }

  // Méthode pour envoyer les données du jeu
  async sendGameData(gameData: any): Promise<any> {
    return this.postData(`${this.baseUrl}/new`, gameData);
  }

  // Méthode pour récupérer tous les jeux
  async getAllGames(): Promise<any> {
    return this.getData(`${this.baseUrl}/AllGames`);
  }

  // Méthode pour récupérer un jeu par ID
  async getGameById(gameId: string): Promise<any> {
    return this.getData(`${this.baseUrl}/id/${gameId}`);
  }

  // Méthode pour récupérer les jeux triés par date
  async getGamesByDate(): Promise<any> {
    return this.getData(`${this.baseUrl}/sequence/date`);
  }

  // Méthode pour rechercher des jeux
  async searchGames(query: string): Promise<any> {
    return this.getData(`${this.baseUrl}/search?q=${query}`);
  }

  // Méthode pour associer les catégories à un jeu
  async associateGameWithCategories(GameId: any, ControllerId: any, PlatformId: any, LanguageId: any, StatusId: any, tagId :any , genreId :any): Promise<any> {
    if (!GameId || !ControllerId || !PlatformId || !LanguageId || !StatusId) {
      throw new Error('Les identifiants du jeu, des catégories, ou des plateformes sont manquants.');
    }
    
    const payload = { GameId, ControllerId, PlatformId, LanguageId, StatusId };
    return this.postData(`${this.baseUrl}/associate-categories`, payload);
  }

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
}
