import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.css'
})
export class InputFileComponent {
  @Input() text = "Upload Image";
  @Input() description = "Click or drag and drop your image here";

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isDragOver = false;
  errorMessage: string | null = null;

  // Emet le fichier sélectionné au parent
  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  triggerFileInput(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput.click();
  }

  private processFile(file: File) {
    if (this.isValidImageFile(file)) {
      this.selectedFile = file;
      this.createImagePreview(file);
      this.fileSelected.emit(file);
      this.errorMessage = null;
    } else {
      this.errorMessage = 'Veuillez sélectionner une image valide (JPEG, PNG, GIF ou WEBP)';
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }

  private createImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
