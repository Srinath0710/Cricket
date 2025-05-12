import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompPlayerComponent } from './comp-player.component';

describe('CompPlayerComponent', () => {
  let component: CompPlayerComponent;
  let fixture: ComponentFixture<CompPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
