import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayInBrowserComponent } from './play-in-browser.component';

describe('PlayInBrowserComponent', () => {
  let component: PlayInBrowserComponent;
  let fixture: ComponentFixture<PlayInBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayInBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayInBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
