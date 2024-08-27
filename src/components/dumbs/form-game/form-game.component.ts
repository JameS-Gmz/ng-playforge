import { booleanAttribute, Component, ViewChild } from '@angular/core';
import { InputFileComponent } from "../input-file/input-file.component";
import { FormBuilder, FormsModule, NgForm } from "@angular/forms";
import { CategoryCreateComponent } from '../category-create/category-create.component';
@Component({
  selector: 'app-form-game',
  standalone: true,
  imports: [InputFileComponent, FormsModule,CategoryCreateComponent],
  templateUrl: './form-game.component.html',
  styleUrl: './form-game.component.css'
})
export class FormGameComponent {

  @ViewChild('postGameForm') postGameForm!: NgForm;

  form = {
    title: '',
    description: '',
    // autres champs
  };

  isValid(): boolean|null{
    return this.postGameForm ? this.postGameForm.valid : null;

  }

  getFormValues() {
      return {
        title : this.postGameForm.value.title,
        description : this.postGameForm.value.description,
        price : this.postGameForm.value.price
      }
    }
  }

  

