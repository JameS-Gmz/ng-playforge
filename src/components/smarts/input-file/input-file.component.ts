import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface InputFileItem {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.css',
})
export class InputFileComponent {
  @Input() text = 'Images du jeu';
  @Input() description = 'Cliquez ou glissez-déposez une ou plusieurs images';
  /** Sélection / dépôt de plusieurs fichiers à la fois */
  @Input() multiple = true;
  @Input() maxFiles = 12;

  @Output() filesSelected = new EventEmitter<File[]>();

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  items: InputFileItem[] = [];
  isDragOver = false;
  errorMessage: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const list = input.files;
    if (list?.length) {
      this.addFiles(Array.from(list));
    }
    input.value = '';
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
    if (files?.length) {
      this.addFiles(Array.from(files));
    }
  }

  triggerFileInput(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.fileInputRef?.nativeElement.click();
  }

  removeAt(index: number) {
    this.items.splice(index, 1);
    this.emitFiles();
    this.errorMessage = null;
  }

  /** Réinitialise la liste (ex. après envoi du formulaire) */
  clear(): void {
    this.items = [];
    this.errorMessage = null;
    this.filesSelected.emit([]);
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  private addFiles(files: File[]) {
    this.errorMessage = null;
    const valid: File[] = [];
    for (const file of files) {
      if (!this.isValidImageFile(file)) {
        this.errorMessage =
          'Formats acceptés : JPEG, PNG, GIF ou WEBP uniquement.';
        continue;
      }
      valid.push(file);
    }
    if (!valid.length) {
      this.emitFiles();
      return;
    }

    const room = this.maxFiles - this.items.length;
    if (room <= 0) {
      this.errorMessage = `Maximum ${this.maxFiles} image(s).`;
      this.emitFiles();
      return;
    }

    const toAdd = valid.slice(0, room);
    if (valid.length > room) {
      this.errorMessage = `Seules ${room} image(s) supplémentaire(s) ont été ajoutées (max. ${this.maxFiles}).`;
    }

    if (toAdd.length === 0) {
      this.emitFiles();
      return;
    }

    let pending = toAdd.length;
    for (const file of toAdd) {
      const reader = new FileReader();
      reader.onload = () => {
        this.items.push({
          file,
          previewUrl: reader.result as string,
        });
        pending--;
        if (pending === 0) {
          this.emitFiles();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  private emitFiles() {
    this.filesSelected.emit(this.items.map((i) => i.file));
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }
}
