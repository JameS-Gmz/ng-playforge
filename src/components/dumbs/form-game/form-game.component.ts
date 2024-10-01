import { booleanAttribute, Component, ViewChild } from '@angular/core';
import { InputFileComponent } from "../../smarts/input-file/input-file.component";
import { FormBuilder, FormsModule, NgForm } from "@angular/forms";
import { CategoryCreateComponent } from '../../smarts/category-create/category-create.component';
@Component({
  selector: 'app-form-game',
  standalone: true,
  imports: [InputFileComponent, FormsModule, CategoryCreateComponent],
  templateUrl: './form-game.component.html',
  styleUrl: './form-game.component.css'
})
export class FormGameComponent {


  @ViewChild('postGameForm') postGameForm!: NgForm;
  selectedFile: File | null = null;
  
  form = {
    title: '',
    description: '',
  };

  isValid(): boolean | null {
    return this.postGameForm ? this.postGameForm.valid : null;

  }

  getFormValues() {
    return {
      title: this.postGameForm.value.title,
      description: this.postGameForm.value.description,
      price: this.postGameForm.value.price,
    }
  }

  resetForm() {
    if (this.postGameForm) {
      this.postGameForm.resetForm(); // Réinitialiser le formulaire
    }
  }

  onFileSelected(file: File) {
    this.selectedFile = file;
  }
}



