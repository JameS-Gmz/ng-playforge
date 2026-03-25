import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GameDateListComponent } from './game-date-list.component';

describe('GameDateListComponent', () => {
  let component: GameDateListComponent;
  let fixture: ComponentFixture<GameDateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameDateListComponent, HttpClientTestingModule]
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
