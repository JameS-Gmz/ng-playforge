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

  async getImageUrl(gameId: number): Promise<string> {
    const response = await fetch(`http://localhost:9091/game/image/${gameId}`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'image');
    }

    const data = await response.json();
    return data.fileUrl;  // Retourne l'URL de l'image
  };

  async getImagesURLS(gameId: number): Promise<any> {
    const response = await fetch(`http://localhost:9091/game/images/${gameId}`);
  
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des images');
    }
  
    const data = await response.json();
    console.log("Données d'image récupérées :", data);  // Ajoutez ceci pour inspecter les données
  
    return data.files;  // Assurez-vous que cela retourne le format attendu
  }
  

}
