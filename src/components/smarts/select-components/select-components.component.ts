import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
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

export class SelectComponentsComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() tableName: string = '';  // Nom de la table à interroger
  @Input() multiple: boolean = false; // Indique si la sélection multiple est autorisée
  @Output() selectionChange = new EventEmitter<any>(); // Événement pour émettre les données sélectionnées

  data: any[] = []; // Contient les données récupérées
  selectedValues: any[] = []; // Contiendra les valeurs sélectionnées
  isLoading: boolean = false;
  private dataLoaded: boolean = false;

  constructor(private dataFetchService: DataFetchService) {
    console.log(`🔧 SelectComponentsComponent créé avec tableName: ${this.tableName}`);
  }

  async loadData(): Promise<void> {
    if (this.tableName && !this.isLoading && !this.dataLoaded) {
      this.isLoading = true;
      this.data = []; // Réinitialiser les données avant le chargement
      
      try {
        // Normaliser le nom de la table (Controllers -> controllers, Platforms -> platforms, etc.)
        const normalizedTableName = this.tableName.toLowerCase();
        console.log(`🔄 [${this.tableName}] Chargement des données (normalisé: ${normalizedTableName})`);
        
        this.data = await this.dataFetchService.getDataFromTable(normalizedTableName);
        this.dataLoaded = true;
        
        console.log(`✅ [${this.tableName}] ${this.data.length} donnée(s) chargée(s):`, this.data);
        if (this.data.length === 0) {
          console.warn(`⚠️ [${this.tableName}] Aucune donnée trouvée`);
        }
      } catch (error: any) {
        console.error(`❌ [${this.tableName}] Erreur lors de la récupération:`, error);
        this.data = []; // S'assurer que data est un tableau vide en cas d'erreur
        if (error.message) {
          console.error(`Détails:`, error.message);
        }
      } finally {
        this.isLoading = false;
      }
    } else if (!this.tableName) {
      console.warn(`⚠️ [SelectComponents] tableName est vide`);
    } else if (this.dataLoaded) {
      console.log(`ℹ️ [${this.tableName}] Données déjà chargées, skip`);
    }
  }

  async ngOnInit(): Promise<void> {
    console.log(`🚀 [${this.tableName}] ngOnInit appelé`);
    // Ne pas charger ici car tableName peut ne pas être encore défini
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    console.log(`🔄 [${this.tableName}] ngOnChanges appelé:`, changes);
    // Recharger les données si le tableName change ou est défini pour la première fois
    if (changes['tableName']) {
      this.dataLoaded = false; // Réinitialiser le flag
      if (this.tableName) {
        console.log(`📝 [${this.tableName}] tableName défini, chargement des données...`);
        await this.loadData();
      }
    }
  }

  async ngAfterViewInit(): Promise<void> {
    console.log(`👁️ [${this.tableName}] ngAfterViewInit appelé`);
    // Si les données n'ont pas encore été chargées, les charger maintenant
    if (this.tableName && !this.dataLoaded) {
      console.log(`📝 [${this.tableName}] Chargement différé dans ngAfterViewInit...`);
      await this.loadData();
    }
  }

  onSelect(event: any) {
    console.log('Event target value:', event.target.value);
    console.log('Event target selectedOptions:', event.target.selectedOptions);

    if (this.multiple) {
      // Pour la sélection multiple, on récupère toutes les options sélectionnées
      const select = event.target;
      const selectedOptions = Array.from(select.selectedOptions)
        .filter((option: any) => option.value !== '') // Filtrer l'option par défaut
        .map((option: any) => {
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
      // Pour la sélection simple, on émet juste l'ID (si ce n'est pas l'option par défaut)
      const selectedId = +event.target.value;
      if (selectedId && !isNaN(selectedId)) {
        console.log('Selected ID:', selectedId);
        this.selectionChange.emit(selectedId);
      }
    }
  }
}

