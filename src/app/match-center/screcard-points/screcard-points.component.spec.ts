import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrecardPointsComponent } from './screcard-points.component';

describe('ScrecardPointsComponent', () => {
  let component: ScrecardPointsComponent;
  let fixture: ComponentFixture<ScrecardPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrecardPointsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrecardPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
