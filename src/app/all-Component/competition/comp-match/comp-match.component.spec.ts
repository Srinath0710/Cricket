import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompMatchComponent } from './comp-match.component';

describe('CompMatchComponent', () => {
  let component: CompMatchComponent;
  let fixture: ComponentFixture<CompMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
