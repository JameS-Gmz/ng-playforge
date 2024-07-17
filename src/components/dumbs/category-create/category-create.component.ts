import { Component } from '@angular/core';
import { NavItemComponent } from "../../smarts/nav-item/nav-item.component";
import { RatingComponentComponent } from "../rating-component/rating-component.component";
import { CheckboxTemplateComponent } from "../checkbox-template/checkbox-template.component";
import { SelectComponentsComponent } from '../select-components/select-components.component';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [NavItemComponent, RatingComponentComponent, CheckboxTemplateComponent,SelectComponentsComponent],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export class CategoryCreateComponent {

}
