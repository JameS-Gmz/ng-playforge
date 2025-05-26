import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataFetchService } from '../../../services/data-fetch.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-components',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-components.component.html',
  styleUrls: ['./select-components.component.css'],
})

export class SelectComponentsComponent {

  @Input() tableName: string = '';  // Nom de la table à interroger
  @Input() multiple: boolean = false; // Indique si la sélection multiple est autorisée
  @Output() selectionChange = new EventEmitter<any>(); // Événement pour émettre les données sélectionnées

  data: any[] = []; // Contient les données récupérées
  selectedValues: any[] = []; // Contiendra les valeurs sélectionnées

  constructor(private dataFetchService: DataFetchService) {}

  async ngOnInit(): Promise<void> {
    if (this.tableName) {
      try {
        this.data = await this.dataFetchService.getDataFromTable(this.tableName);
        console.log('Données chargées:', this.data);
      } catch (error) {
        console.error(`Erreur lors de la récupération des données de la table ${this.tableName}`, error);
      }
    }
  }

  onSelect(event: any) {
    console.log('Event target value:', event.target.value);
    console.log('Event target selectedOptions:', event.target.selectedOptions);

    if (this.multiple) {
      // Pour la sélection multiple, on récupère toutes les options sélectionnées
      const select = event.target;
      const selectedOptions = Array.from(select.selectedOptions).map((option: any) => {
        console.log('Option value:', option.value);
        console.log('Option text:', option.text);
        return {
          id: +option.value,
          name: option.text
        };
      });
      console.log('Selected options:', selectedOptions);
      this.selectedValues = selectedOptions;
      this.selectionChange.emit(selectedOptions);
    } else {
      // Pour la sélection simple, on émet juste l'ID
      const selectedId = +event.target.value;
      console.log('Selected ID:', selectedId);
      this.selectionChange.emit(selectedId);
    }
  }
}

