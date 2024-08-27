import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService{

  private apiUrl = 'http://localhost:9090/game/new'; // Remplacez par votre URL API

  constructor() { }

  sendGameData(gameData: any): Promise<any> {
    return fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des données : ' + response.statusText);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Erreur:', error);
      throw error; // Propager l'erreur pour une gestion ultérieure
    });
  }
 
}


