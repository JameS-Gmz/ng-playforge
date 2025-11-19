import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFetchService {

  constructor() { }

  async getDataFromTable(tableName: string): Promise<any[]> {
    try {
      console.log(`📡 Requête API: http://localhost:9090/data/${tableName}`);
      const response = await fetch(`http://localhost:9090/data/${tableName}`);
      console.log(`📥 Réponse reçue:`, response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Erreur HTTP ${response.status}:`, errorText);
        throw new Error(`Erreur ${response.status} lors de la récupération des données de la table ${tableName}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Données reçues pour ${tableName}:`, data);
      return data;
    } catch (error: any) {
      console.error(`❌ Erreur lors de la récupération de ${tableName}:`, error);
      throw error; // Propager l'erreur au lieu de retourner un tableau vide
    }
  }

  async getGenres(): Promise<any> {
    const response = await fetch('http://localhost:9090/genre/all');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des genres');
    }
    return await response.json();
  }

  async getTags(): Promise<any> {
    const response = await fetch('http://localhost:9090/tag/all');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des tags');
    }
    return await response.json();
  }
}

