import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxTemplateComponent } from './checkbox-template.component';

describe('CeckboxTemplateComponent', () => {
  let component: CheckboxTemplateComponent;
  let fixture: ComponentFixture<CheckboxTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
