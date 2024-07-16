import { Component } from '@angular/core';
import { NavItemComponent } from "../../smarts/nav-item/nav-item.component";
import { RatingComponentComponent } from "../rating-component/rating-component.component";
import { CeckboxTemplateComponent } from "../checkbox-template/checkbox-template.component";

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [NavItemComponent, RatingComponentComponent, CeckboxTemplateComponent],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export class CategoryCreateComponent {

}
