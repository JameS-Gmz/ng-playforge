import { Component, ViewChild } from '@angular/core';
import { NavItemComponent } from "../../smarts/nav-item/nav-item.component";
import { CheckboxTemplateComponent } from "../checkbox-template/checkbox-template.component";
import { FormsModule, NgForm } from '@angular/forms';
import { SelectComponentsComponent } from '../../smarts/select-components/select-components.component';


@Component({
  selector: 'app-category-create',
  imports: [NavItemComponent, CheckboxTemplateComponent, FormsModule, SelectComponentsComponent],
  standalone : true,
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export class CategoryCreateComponent {
  formData = {
    languages: '',
    controller: '',
    status: '',
    platforms: '',
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

  getFormValues() {
    return {
      authorStudio : this.categoryCreateForm.value.authorStudio,
      madewith : this.categoryCreateForm.value.madewith,
      category : this.categoryCreateForm ? this.categoryCreateForm.value : {}}
  }
  isValid(): boolean | null {
    return this.categoryCreateForm ? this.categoryCreateForm.valid : null;
  }

}
