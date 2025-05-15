import { Injectable } from '@angular/core';


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
    const response = await fetch(`${this.baseUrl}/game/AllGames`);
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
  async associateGameWithCategories(GameId: any, ControllerId: any, PlatformId: any, StatusId: any, LanguageId: any, TagId: any, GenreId: any): Promise<any> {
    if (!GameId) {
      throw new Error('L\'identifiant du jeu est manquant.');
    }
    
    const payload = { 
      GameId, 
      ControllerId, 
      PlatformId, 
      StatusId, 
      LanguageId,
      TagId: Array.isArray(TagId) ? TagId : TagId?.split(',').map((id: string) => parseInt(id)),
      GenreId: Array.isArray(GenreId) ? GenreId : GenreId?.split(',').map((id: string) => parseInt(id))
    };

    console.log('Payload envoyé au serveur:', payload);
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
    return fetch(`${this.baseUrl}/game/delete/${gameId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du jeu');
      }
      return response.json();
    });
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

  // Méthode pour récupérer les jeux triés par date de mise à jour
  async getGamesByUpdateDate(): Promise<any> {
    return this.getData(`${this.baseUrl}/game/last-updated`);
  }

  // Méthode pour récupérer les jeux par UserId
  async getGamesByUserId(userId: number): Promise<any[]> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token non disponible. Veuillez vous connecter.');
      }

      console.log('Fetching games for user ID:', userId);
      console.log('Using token:', token.substring(0, 10) + '...'); // Log partiel du token pour la sécurité

      const url = `${this.baseUrl}/game/by-user/${userId}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('Error response data:', errorData);
        } catch (e) {
          console.error('Could not parse error response:', e);
          errorData = { message: 'Erreur inconnue du serveur' };
        }
        throw new Error(errorData.message || `Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      const games = await response.json();
      console.log('Received games data:', games);

      if (!Array.isArray(games)) {
        console.error('Invalid response format:', games);
        throw new Error('La réponse n\'est pas un tableau de jeux');
      }

      return games;
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération des jeux:', error);
      throw error;
    }
  }

  // Méthode pour ajouter un jeu à la bibliothèque d'un utilisateur
  async addGameToLibrary(GameId: number, UserId: number): Promise<any> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }

    const payload = { GameId, UserId };
    
    try {
      const response = await fetch(`${this.baseUrl}/library/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'ajout du jeu à la bibliothèque');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la bibliothèque:', error);
      throw error;
    }
  }

}

