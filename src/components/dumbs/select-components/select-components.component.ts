import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import {NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-components',
  standalone: true,
  imports: [],
  templateUrl: './select-components.component.html',
  styleUrl: './select-components.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponentsComponent),
      multi: true,
    }
  ]
})

export class SelectComponentsComponent{


@Input() text!: string;
  @Input() value1!: string;
  @Input() value2!: string;
  @Input() value3!: string;
  @Input() value4!: string;
  @Input() value5!: string;
  @Input() value6!: string;
  @Input() value7!: string;
  @Input() value8!: string;
  @Input() value9!: string;
  @Input() value10!: string;
  @Input() value11!: string;
  @Input() value12!: string;

 @Output() valueChange = new EventEmitter<string>();

  selectedValue: string = '';

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSelectChange($event: Event) {
    const selectElement = $event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    this.selectedValue = selectedValue;
    this.onChange(this.selectedValue); 
    this.onTouched(); 

    // Emit the value to the parent component
    this.valueChange.emit(this.selectedValue);
  }
}
