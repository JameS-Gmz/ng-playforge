import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-checkbox-template',
  standalone: true,
  imports: [],
  templateUrl: './checkbox-template.component.html',
  styleUrl: './checkbox-template.component.css'
})
export class CeckboxTemplateComponent {
@Input() text ="";
}
