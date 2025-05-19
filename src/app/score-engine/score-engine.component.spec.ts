import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreEngineComponent } from './score-engine.component';

describe('ScoreEngineComponent', () => {
  let component: ScoreEngineComponent;
  let fixture: ComponentFixture<ScoreEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreEngineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
