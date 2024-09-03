import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFetchService {

  constructor() { }

  async getDataFromTable(tableName: string): Promise<any[]> {
    try {
      const response = await fetch(`http://localhost:9090/data/${tableName}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des données de la table ${tableName}: ` + response.statusText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
