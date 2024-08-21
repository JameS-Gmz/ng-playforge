import { Component, ViewChild } from '@angular/core';
import { NavItemComponent } from "../../smarts/nav-item/nav-item.component";
import { RatingComponentComponent } from "../rating-component/rating-component.component";
import { CheckboxTemplateComponent } from "../checkbox-template/checkbox-template.component";
import { SelectComponentsComponent } from '../select-components/select-components.component';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [NavItemComponent, RatingComponentComponent, CheckboxTemplateComponent,SelectComponentsComponent,FormsModule],
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
    console.log(this.formData.languages)
    return this.categoryCreateForm ? this.categoryCreateForm.value : {};
  }
  isValid(): boolean | null {
    return this.categoryCreateForm ? this.categoryCreateForm.valid : null;
  }

}
