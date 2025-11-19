import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-component.component.html',
  styleUrl: './rating-component.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponentComponent),
      multi: true
    }
  ]
})
export class RatingComponentComponent implements ControlValueAccessor {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  hoveredRating: number = 0;
  private onChange = (rating: number) => {};
  private onTouched = () => {};

  onStarClick(starValue: number): void {
    if (this.readonly) return;
    
    this.rating = starValue;
    this.onChange(this.rating);
    this.ratingChange.emit(this.rating);
  }

  onStarHover(starValue: number): void {
    if (this.readonly) return;
    this.hoveredRating = starValue;
  }

  onStarLeave(): void {
    if (this.readonly) return;
    this.hoveredRating = 0;
  }

  getStarClass(starValue: number): string {
    const activeRating = this.hoveredRating || this.rating;
    if (starValue <= activeRating) {
      return 'active';
    }
    return '';
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    if (value !== undefined && value !== null) {
      this.rating = value;
    }
  }

  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
