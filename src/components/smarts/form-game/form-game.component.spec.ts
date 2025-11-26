import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGameComponent } from './form-game.component';

describe('FormGameComponent', () => {
  let component: FormGameComponent;
  let fixture: ComponentFixture<FormGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
