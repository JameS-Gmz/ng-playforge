import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Client HTTP vers le service de fichiers (port 9091).
 * Ne pas définir manuellement l’en-tête `Content-Type` sur `FormData` : le navigateur ajoute le boundary requis.
 */
@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly uploadApiUrl = 'http://localhost:9091/game/upload/file';
  private readonly imageApiBaseUrl = 'http://localhost:9091/game';

  constructor(private http: HttpClient) {}

  uploadFile(file: File, gameId: number): Promise<{ fileUrl?: string } & Record<string, unknown>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('gameId', gameId.toString());

    return lastValueFrom(
      this.http
        .post<{ fileUrl?: string } & Record<string, unknown>>(this.uploadApiUrl, formData, {
          withCredentials: true
        })
        .pipe(
          catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse) {
              const errorMessage = `Erreur HTTP: ${err.status} - ${err.statusText}`;
              console.error('Erreur lors de l\'upload du fichier:', errorMessage);
              return throwError(() => new Error(errorMessage));
            }
            console.error('Erreur durant le processus d\'upload', err);
            return throwError(() =>
              err instanceof Error ? err : new Error('Erreur durant le processus d\'upload')
            );
          })
        )
    );
  }

  getImageUrl(gameId: number): Promise<string> {
    return lastValueFrom(
      this.http.get<{ fileUrl: string }>(`${this.imageApiBaseUrl}/image/${gameId}`).pipe(
        map((data) => data.fileUrl),
        catchError(() =>
          throwError(() => new Error('Erreur lors de la récupération de l\'image'))
        )
      )
    );
  }

  getImagesUrls(gameId: number): Promise<Array<{ url: string }>> {
    return lastValueFrom(
      this.http
        .get<{ images?: Array<{ url: string }> }>(`${this.imageApiBaseUrl}/images/${gameId}`)
        .pipe(
          map((data) => data.images ?? []),
          catchError(() =>
            throwError(() => new Error('Erreur lors de la récupération des images'))
          )
        )
    );
  }

  // Compatibilité rétroactive avec l'ancien nom.
  getImagesURLS(gameId: number): Promise<Array<{ url: string }>> {
    return this.getImagesUrls(gameId);
  }
}
