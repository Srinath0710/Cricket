import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompGroundComponent } from './comp-ground.component';

describe('CompGroundComponent', () => {
  let component: CompGroundComponent;
  let fixture: ComponentFixture<CompGroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompGroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompGroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
