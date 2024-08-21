import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { OutletContext } from '@angular/router';

@Component({
  selector: 'app-checkbox-template',
  standalone: true,
  imports: [],
  templateUrl: './checkbox-template.component.html',
  styleUrl: './checkbox-template.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxTemplateComponent),
      multi: true,
    }
  ]

})
export class CheckboxTemplateComponent {

  @Input() text = "";
  @Input() isChecked = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  private onChange = (isChecked: boolean) => { };
  private onTouched = () => { };

  writeValue(isChecked: boolean): void {
    this.isChecked = isChecked;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onCheckboxChange($event: Event): void {
    const checkbox = $event.target as HTMLInputElement;
    this.isChecked = checkbox.checked;

    this.onChange(this.isChecked);
    this.onTouched();

    this.checkedChange.emit(this.isChecked);
  }

}
