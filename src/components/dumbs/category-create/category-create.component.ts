import { Component, ViewChild } from '@angular/core';
import { NavItemComponent } from "../../smarts/nav-item/nav-item.component";
import { CheckboxTemplateComponent } from "../checkbox-template/checkbox-template.component";
import { FormsModule, NgForm } from '@angular/forms';
import { SelectComponentsComponent } from '../../smarts/select-components/select-components.component';


@Component({
  selector: 'app-category-create',
  imports: [NavItemComponent, CheckboxTemplateComponent, FormsModule, SelectComponentsComponent],
  standalone: true,
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export class CategoryCreateComponent {
  formData = {
    categories: {
      languages: [],
      controllers: [],
    },
    authorStudio: '',
    madeWith: '',
    genres: {
      fps: false,
      survival: false,
      actionadventure: false,
      roguelike: false,
      simulation: false,
      rts: false,
      rpg: false,
      rhythm: false,
      hacknslash: false,
      reflection: false,
      beatthemall: false,
      plateformer: false,
      tps: false,
      combat: false,
      battleroyale: false,
      mmorpg: false,
      moba: false,
      partygames: false,
      puzzlers: false,
    },
    tags: {
      free: false,
      onSale: false,
      fiveEuroOrLess: false,
      tenEuroOrLess: false,
      localmultiplayer: false,
      servermultiplayer: false,
      networkmultiplayer: false,
    },
    lastUpdated: '',
  };

  @ViewChild('categoryCreateForm') categoryCreateForm!: NgForm;
  @ViewChild('languagesSelect') languagesSelect!: SelectComponentsComponent;
  @ViewChild('controllersSelect') controllersSelect!: SelectComponentsComponent;

  selectedControllerId: any; // ID sélectionné depuis le composant SelectComponents
  selectedStatusId: any; // ID sélectionné depuis le composant SelectComponents
  selectedPlatformId: any; // ID sélectionné depuis le composant SelectComponents
  selectedLanguageId: any; // ID sélectionné depuis le composant SelectComponents

  // Méthode appelée lors de la sélection d'un élément dans SelectComponentsComponent
  onControllersSelected(elementId: number) {
    this.selectedControllerId = elementId;
    console.log('ID sélectionné dans Controllers:', this.selectedControllerId);
  }
  onStatusesSelected(elementId: number) {
    this.selectedStatusId = elementId;
    console.log('ID sélectionné dans Status:', this.selectedStatusId);
  }
  onPlatformsSelected(elementId: number) {
    this.selectedPlatformId = elementId;
    console.log('ID sélectionné dans Plateforms:', this.selectedPlatformId);
  }
  onLanguagesSelected(elementId: number) {
    this.selectedLanguageId = elementId;
    console.log('ID sélectionné dans Language:', this.selectedLanguageId);
  }

  getFormValues() {
    return {
      madeWith: this.formData.madeWith,
      authorStudio: this.formData.authorStudio,
      ControllerId: this.selectedControllerId,
      StatusId: this.selectedStatusId,
      PlatformId: this.selectedPlatformId,
      LanguageId: this.selectedLanguageId,
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
