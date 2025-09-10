import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAnalysisComponent } from './player-analysis.component';

describe('PlayerAnalysisComponent', () => {
  let component: PlayerAnalysisComponent;
  let fixture: ComponentFixture<PlayerAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
