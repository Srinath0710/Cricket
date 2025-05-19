import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WicketDismissalComponent } from './wicket-dismissal.component';

describe('WicketDismissalComponent', () => {
  let component: WicketDismissalComponent;
  let fixture: ComponentFixture<WicketDismissalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WicketDismissalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WicketDismissalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
