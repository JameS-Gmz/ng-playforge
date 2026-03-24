import { Component, ViewChild } from '@angular/core';
import { InputFileComponent } from "../input-file/input-file.component";
import { FormsModule, NgForm } from "@angular/forms";
import { CategoryCreateComponent } from '../category-create/category-create.component';
@Component({
  selector: 'app-form-game',
  standalone: true,
  imports: [InputFileComponent, FormsModule, CategoryCreateComponent],
  templateUrl: './form-game.component.html',
  styleUrl: './form-game.component.css'
})
export class FormGameComponent {


  @ViewChild('postGameForm') postGameForm!: NgForm;
  @ViewChild(InputFileComponent) inputFileComponent?: InputFileComponent;

  /** Fichiers choisis (upload multiple après création du jeu) */
  selectedFiles: File[] = [];
  previewImageUrl: string | null = null;
  
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
      this.postGameForm.resetForm();
    }
    this.selectedFiles = [];
    this.previewImageUrl = null;
    this.inputFileComponent?.clear();
  }

  onFilesSelected(files: File[]) {
    this.selectedFiles = files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewImageUrl = e.target?.result as string;
      };
      reader.readAsDataURL(files[0]);
    } else {
      this.previewImageUrl = null;
    }
  }
}



