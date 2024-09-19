import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private fileApiUrl = 'http://localhost:9091/game/upload/file';  // URL de l'API des fichiers

  // Fonction pour uploader un fichier avec l'ID du jeu
  async uploadFile(file: File, gameId: number): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('gameId', gameId.toString());  // Associe l'image au jeu via l'ID

    try {
      const response = await fetch(this.fileApiUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

         if (!response.ok) {
        const errorMessage = `Erreur HTTP: ${response.status} - ${response.statusText}`;
        console.error('Erreur lors de l\'upload du fichier:', errorMessage);
        throw new Error(errorMessage);
      }

      const fileData = await response.json(); // Retourne les détails du fichier uploadé
      return fileData;
    } catch (error) {
      console.error('Erreur durant le processus d\'upload', error);
      throw error;
    }
  }
}
