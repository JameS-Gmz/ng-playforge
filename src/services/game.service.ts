import { ReturnStatement } from '@angular/compiler';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'http://localhost:9090/game/new';
  private apiUrlAllGames = 'http://localhost:9090/game/AllGames'
  constructor() { }

  sendGameData(gameData: any): Promise<any> {
    return fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData)
    })
    .then(response => response.json())
    .catch(error => {
      console.error('Erreur:', error);
      throw error;
    });
  }

  async getAllGames(): Promise<any> {
    try {

      const response = await fetch(this.apiUrlAllGames, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des jeux : ' + response.statusText);
      };

      const data = await response.json();
      return data;

    } catch (error) {
      console.log('erreur getAllGames()')
      console.error('Erreur:', error);
      throw error;
    }
  }

  async getGameById(gameId: string): Promise<any> {
    try {
      const response = await fetch(`http://localhost:9090/game/id/${gameId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching game by ID:', error);
      throw error;
    }
  }

  async getGamesByDate(): Promise<any> {
    try {
      const response = await fetch(`http://localhost:9090/game/sequence/date`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des jeux');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur :', error);
      throw error;
    }
  }
  async searchGames(query: string): Promise<any> {
    const response = await fetch(`http://localhost:9090/game/search?q=${query}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des jeux');
    }
    return await response.json();
  }
    } 




