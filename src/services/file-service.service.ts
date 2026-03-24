import { Injectable } from '@angular/core';

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

  async uploadFile(file: File, gameId: number): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('gameId', gameId.toString());

    try {
      const response = await fetch(this.uploadApiUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

         if (!response.ok) {
        const errorMessage = `Erreur HTTP: ${response.status} - ${response.statusText}`;
        console.error('Erreur lors de l\'upload du fichier:', errorMessage);
        throw new Error(errorMessage);
      }

      const fileData = await response.json();
      return fileData;
    } catch (error) {
      console.error('Erreur durant le processus d\'upload', error);
      throw error;
    }
  }

  async getImageUrl(gameId: number): Promise<string> {
    const response = await fetch(`${this.imageApiBaseUrl}/image/${gameId}`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'image');
    }

    const data = await response.json();
    return data.fileUrl;
  };

  async getImagesUrls(gameId: number): Promise<Array<{ url: string }>> {
    const response = await fetch(`${this.imageApiBaseUrl}/images/${gameId}`);
  
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des images');
    }
  
    const data = await response.json();
  
    // L'API renvoie { images: [{ url }] } pour cette route.
    return data.images ?? [];
  }

  // Compatibilité rétroactive avec l'ancien nom.
  async getImagesURLS(gameId: number): Promise<Array<{ url: string }>> {
    return this.getImagesUrls(gameId);
  }

}
