import { Component, Input } from '@angular/core';
import { DataFetchService } from '../../../services/data-fetch.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-components',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-components.component.html',
  styleUrl: './select-components.component.css',
})

export class SelectComponentsComponent{

  @Input() tableName: string = '';  // Nom de la table à interroger
  data: any[] = [];

  constructor(private dataFetchService : DataFetchService) {}

  async ngOnInit(): Promise<void> {
if (this.tableName) {
      try {
        this.data = await this.dataFetchService.getDataFromTable(this.tableName);
      } catch (error) {
        console.error(`Erreur lors de la récupération des données de la table ${this.tableName}`, error);
      }
    }
  }
}
