import { Component, OnInit, ViewChild } from '@angular/core';
import { NavItemComponent } from "../nav-item/nav-item.component";

import { FormsModule, NgForm } from '@angular/forms';
import { SelectComponentsComponent } from '../select-components/select-components.component';
import { CommonModule } from '@angular/common';
import { CheckboxTemplateComponent } from '../../dumbs/checkbox-template/checkbox-template.component';
import { DataFetchService } from '../../../services/data-fetch.service';


@Component({
  selector: 'app-category-create',
  imports: [NavItemComponent, CheckboxTemplateComponent, FormsModule, SelectComponentsComponent, CommonModule],
  standalone: true,
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export class CategoryCreateComponent implements OnInit {

  constructor(private datafetchService: DataFetchService) { }

  genreList: any[] = [];
  tagList : any[] = [];
  
  formData = {
    categories: {
      languages: [],
      controllers: [],
    },
    authorStudio: '',
    madeWith: '',
    genres: {} as { [key: number]: boolean },
    tags: {} as { [key: number]: boolean }
  };

  @ViewChild('categoryCreateForm') categoryCreateForm!: NgForm;
  @ViewChild('languagesSelect') languagesSelect!: SelectComponentsComponent;
  @ViewChild('controllersSelect') controllersSelect!: SelectComponentsComponent;

  selectedControllerId: number | null = null; // ID sélectionné depuis le composant SelectComponents
  selectedStatusId: number | null = null; // ID sélectionné depuis le composant SelectComponents
  selectedPlatformId: number | null = null; // ID sélectionné depuis le composant SelectComponents
  selectedLanguageId: number | null = null; // ID sélectionné depuis le composant SelectComponents

  ngOnInit(): void {
    this.datafetchService.getGenres().then((genres) => {
      this.genreList = genres;  // Charger la liste des genres depuis l'API
    }).catch(error => {
      console.error('Erreur lors de la récupération des genres :', error);
    });

    this.datafetchService.getTags().then((tags) => {
      this.tagList = tags;  // Charger la liste des tags depuis l'API
    }).catch(error => {
      console.error('Erreur lors de la récupération des genres :', error);
    });
  }

  // Méthode appelée lors de la sélection d'un élément dans SelectComponentsComponent
  onControllersSelected(elementId: number) {
    this.selectedControllerId = Number(elementId);
    console.log('ID sélectionné dans Controllers:', this.selectedControllerId);
  }
  onStatusesSelected(elementId: number) {
    this.selectedStatusId = Number(elementId);
    console.log('ID sélectionné dans Status:', this.selectedStatusId);
  }
  onPlatformsSelected(elementId: number) {
    this.selectedPlatformId = Number(elementId);
    console.log('ID sélectionné dans Plateforms:', this.selectedPlatformId);
  }
  onLanguagesSelected(elementId: number) {
    this.selectedLanguageId = Number(elementId);
    console.log('ID sélectionné dans Language:', this.selectedLanguageId);
  }
  onGenreCheckedChange(genreId: any, isChecked: boolean) {
    console.log(`Genre ${genreId} sélectionné : ${isChecked}`);
    this.formData.genres[genreId] = isChecked;
  }

  onTagCheckedChange(tagId: any, isChecked: boolean) {
    console.log(`Tag ${tagId} sélectionné : ${isChecked}`);
    this.formData.tags[tagId] = isChecked;
  }

  getFormValues() {
    const selectedGenres = Object.keys(this.formData.genres)
      .filter(id => this.formData.genres[+id])
      .map(id => Number(id));

    const selectedTags = Object.keys(this.formData.tags)
      .filter(id => this.formData.tags[+id])
      .map(id => Number(id));

    return {
      madeWith: this.formData.madeWith,
      authorStudio: this.formData.authorStudio,
      ControllerId: this.selectedControllerId,
      StatusId: this.selectedStatusId,
      PlatformId: this.selectedPlatformId,
      LanguageId: this.selectedLanguageId,
      selectedGenres,
      selectedTags
    };
  }
  isValid(): boolean | null {
    return this.categoryCreateForm ? this.categoryCreateForm.valid : null;
  }

  resetForm() {
    if (this.categoryCreateForm) {
      this.categoryCreateForm.resetForm(); // Réinitialiser le formulaire
    }
  }
}
