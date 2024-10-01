import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [],
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.css'
})
export class InputFileComponent {
@Input() text =""

selectedFile: File | null = null;

  // Emet le fichier sélectionné au parent
  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.fileSelected.emit(file);  // Emet l'événement au parent
  }
}
