import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private fileApiUrl = 'http://localhost:9091/upload/file';  // URL de l'API des fichiers

  // Fonction pour uploader un fichier avec l'ID du jeu
  async uploadFile(file: File, gameId: number): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('gameId', gameId.toString());  // Associe l'image au jeu via l'ID

    try {
      const response = await fetch(this.fileApiUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du fichier');
      }

      return await response.json(); // Retourne les détails du fichier uploadé
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }
}
