import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonRedComponent } from './button-red.component';

describe('ButtonRedComponent', () => {
  let component: ButtonRedComponent;
  let fixture: ComponentFixture<ButtonRedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonRedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
