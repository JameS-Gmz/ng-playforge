import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDateListComponent } from './game-date-list.component';

describe('GameDateListComponent', () => {
  let component: GameDateListComponent;
  let fixture: ComponentFixture<GameDateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameDateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameDateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
