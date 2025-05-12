import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompOfficialComponent } from './comp-official.component';

describe('CompOfficialComponent', () => {
  let component: CompOfficialComponent;
  let fixture: ComponentFixture<CompOfficialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompOfficialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompOfficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
