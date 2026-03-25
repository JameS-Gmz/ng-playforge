import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly baseUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) {}

  /** GET JSON — messages d’erreur alignés sur l’ancien comportement `fetch` + `getData`. */
  private getData(url: string): Promise<any> {
    return lastValueFrom(
      this.http.get<unknown>(url).pipe(
        catchError((err: unknown) => {
          console.error(`❌ Erreur lors de la récupération des données depuis ${url}:`, err);
          if (err instanceof HttpErrorResponse) {
            const body = err.error;
            if (typeof body === 'object' && body !== null) {
              const b = body as { message?: string; error?: string };
              const msg = b.message || b.error;
              if (msg) {
                return throwError(() => new Error(`Erreur ${err.status}: ${msg}`));
              }
            }
            return throwError(() => new Error(`Erreur ${err.status}: ${err.statusText}`));
          }
          return throwError(() =>
            err instanceof Error ? err : new Error(String(err))
          );
        })
      )
    );
  }

  private postData(url: string, data: any): Promise<any> {
    return lastValueFrom(
      this.http.post(url, data, {
          headers: { 'Content-Type': 'application/json' }
        })
        .pipe(
          catchError((err: unknown) => {
            console.error('Erreur lors de l\'envoi des données:', err);
            if (err instanceof HttpErrorResponse) {
              return throwError(
                () => new Error(`Erreur lors de l'envoi des données : ${err.statusText}`)
              );
            }
            return throwError(() =>
              err instanceof Error ? err : new Error(String(err))
            );
          })
        )
    );
  }

  async sendGameData(gameData: any): Promise<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }

    console.log('Données du jeu à envoyer:', gameData);
    console.log('Token utilisé:', token.substring(0, 20) + '...');

    return lastValueFrom(
      this.http.post(`${this.baseUrl}/game/new`, gameData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }).pipe(
        catchError((err: HttpErrorResponse) => {
          console.error('Erreur détaillée du serveur:', err.error);
          let msg = 'Erreur lors de l\'envoi des données du jeu';
          if (typeof err.error === 'object' && err.error !== null && 'message' in err.error) {
            msg = (err.error as { message: string }).message || msg;
          }
          return throwError(() => new Error(msg));
        })
      )
    ).then((result) => {
      console.log('Réponse du serveur:', result);
      return result;
    });
  }

  async getAllGames(): Promise<any> {
    return lastValueFrom(
      this.http.get(`${this.baseUrl}/game/AllGames`).pipe(
        catchError(() =>
          throwError(() => new Error('Erreur lors de la récupération des jeux'))
        )
      )
    );
  }

  async getGameById(gameId: string): Promise<any> {
    return this.getData(`${this.baseUrl}/game/id/${gameId}`);
  }

  async getGamesByDate(): Promise<any> {
    return this.getData(`${this.baseUrl}/game/sequence/date`);
  }

  async searchGames(query: string): Promise<any> {
    return this.getData(`${this.baseUrl}/game/search?q=${query}`);
  }

  async associateGameWithCategories(
    GameId: any,
    ControllerId: any,
    PlatformId: any,
    StatusId: any,
    LanguageId: any,
    TagId: any,
    GenreId: any
  ): Promise<any> {
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

    console.log('Payload pour l\'association des catégories:', payload);
    console.log('URL de l\'endpoint:', `${this.baseUrl}/game/associate-categories`);

    try {
      const result = await this.postData(`${this.baseUrl}/game/associate-categories`, payload);
      console.log('Réponse de l\'association des catégories:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'association des catégories:', error);
      throw error;
    }
  }

  async getControllers(): Promise<any> {
    return this.getData(`${this.baseUrl}/controller/all`);
  }

  async getGenres(): Promise<any> {
    return this.getData(`${this.baseUrl}/genre/all`);
  }

  async getPlatforms(): Promise<any> {
    return this.getData(`${this.baseUrl}/platform/all`);
  }

  async getLanguages(): Promise<any> {
    return this.getData(`${this.baseUrl}/language/all`);
  }

  async getStatuses(): Promise<any> {
    return this.getData(`${this.baseUrl}/status/all`);
  }

  async getTags(): Promise<any> {
    return this.getData(`${this.baseUrl}/tag/all`);
  }

  getGamesByFilters(filters: any): Promise<any> {
    return this.postData(`${this.baseUrl}/game/filter`, filters);
  }

  deleteGame(gameId: string): Promise<any> {
    const token = localStorage.getItem('token');
    return lastValueFrom(
      this.http
        .delete(`${this.baseUrl}/game/delete/${gameId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`
          }
        })
        .pipe(
          catchError(() =>
            throwError(() => new Error('Erreur lors de la suppression du jeu'))
          )
        )
    );
  }

  async updateGame(gameId: string, gameData: any): Promise<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }

    return lastValueFrom(
      this.http
        .put(`${this.baseUrl}/game/update/${gameId}`, gameData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        .pipe(
          catchError((err: HttpErrorResponse) => {
            let msg = 'Erreur lors de la mise à jour du jeu';
            if (typeof err.error === 'object' && err.error !== null && 'message' in err.error) {
              msg = (err.error as { message: string }).message || msg;
            }
            return throwError(() => new Error(msg));
          })
        )
    );
  }

  async getGamesByUpdateDate(): Promise<any> {
    return this.getData(`${this.baseUrl}/game/last-updated`);
  }

  async getGamesByUserId(userId: number): Promise<any[]> {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token non disponible. Veuillez vous connecter.');
      }

      console.log('Fetching games for user ID:', userId);
      console.log('Using token:', token.substring(0, 10) + '...');

      const url = `${this.baseUrl}/game/by-user/${userId}`;
      console.log('Request URL:', url);

      const games = await lastValueFrom(
        this.http.get<unknown>(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }).pipe(
          catchError((err: HttpErrorResponse) => {
            console.error('Error response data:', err.error);
            if (typeof err.error === 'object' && err.error !== null && 'message' in err.error) {
              return throwError(
                () => new Error((err.error as { message: string }).message)
              );
            }
            return throwError(
              () =>
                new Error(`Erreur HTTP ${err.status}: ${err.statusText}`)
            );
          })
        )
      );

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

  async addGameToLibrary(GameId: number, UserId: number): Promise<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }

    const payload = { GameId, UserId };

    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/library/add`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }).pipe(
          catchError((err: HttpErrorResponse) => {
            let msg = 'Erreur lors de l\'ajout du jeu à la bibliothèque';
            if (typeof err.error === 'object' && err.error !== null && 'message' in err.error) {
              msg = (err.error as { message: string }).message || msg;
            }
            return throwError(() => new Error(msg));
          })
        )
      );
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la bibliothèque:', error);
      throw error;
    }
  }

  async getGameLibrary(userId: number): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }

    return lastValueFrom(
      this.http.get(`${this.baseUrl}/library/games/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }).pipe(
        catchError((err: HttpErrorResponse) => {
          let msg = 'Erreur lors de la récupération de la bibliothèque';
          if (typeof err.error === 'object' && err.error !== null && 'message' in err.error) {
            msg = (err.error as { message: string }).message || msg;
          }
          return throwError(() => new Error(msg));
        })
      )
    );
  }
}
