import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompTeamComponent } from './comp-team.component';

describe('CompTeamComponent', () => {
  let component: CompTeamComponent;
  let fixture: ComponentFixture<CompTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
