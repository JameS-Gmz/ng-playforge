import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSlideComponent } from './button-slide.component';

describe('ButtonSlideComponent', () => {
  let component: ButtonSlideComponent;
  let fixture: ComponentFixture<ButtonSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonSlideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
