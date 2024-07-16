import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeckboxTemplateComponent } from './checkbox-template.component';

describe('CeckboxTemplateComponent', () => {
  let component: CeckboxTemplateComponent;
  let fixture: ComponentFixture<CeckboxTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CeckboxTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CeckboxTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
