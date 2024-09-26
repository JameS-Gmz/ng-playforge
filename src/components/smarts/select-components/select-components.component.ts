import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataFetchService } from '../../../services/data-fetch.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-components',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-components.component.html',
  styleUrls: ['./select-components.component.css'],
})

export class SelectComponentsComponent {

  @Input() tableName: string = '';  // Nom de la table à interroger
  @Output() selectionChange = new EventEmitter<number>(); // Événement pour émettre les données sélectionnées

  data: any[] = []; // Contient les données récupérées
  selectedId: any; // Contiendra l'ID sélectionné

  constructor(private dataFetchService: DataFetchService) {}

  async ngOnInit(): Promise<void> {
    if (this.tableName) {
      try {
        this.data = await this.dataFetchService.getDataFromTable(this.tableName);
      } catch (error) {
        console.error(`Erreur lors de la récupération des données de la table ${this.tableName}`, error);
      }
    }
  }

  onSelect(event: any) {
    this.selectedId = event.target.value; // Récupère l'ID sélectionné
    this.selectionChange.emit(this.selectedId); // Émet l'ID sélectionné au composant parent
  }
}

