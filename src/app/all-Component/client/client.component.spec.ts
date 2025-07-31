// ✅ All imports must be at the top
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientComponent } from './client.component'; // use correct component

describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,ClientComponent  ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);

    component.addClientForm = fb.group({
      app_con_id: [''],
      client_id: ['']
    });

    fixture.detectChanges();
  });

  it('should set ShowForm to true', () => {
    component.showAddForm();
    expect(component.ShowForm).toBeTrue();
  });

  it('should set app_con_id as required if client_id is empty', () => {
    component.addClientForm.get('client_id')?.setValue('');
    component.showAddForm();

    const app_con_id = component.addClientForm.get('app_con_id');
    app_con_id?.setValue('');
    expect(app_con_id?.valid).toBeFalse();
    expect(app_con_id?.errors?.['required']).toBeTruthy();
  });

  it('should clear validators from app_con_id if client_id is present', () => {
    component.addClientForm.get('client_id')?.setValue('123');
    component.showAddForm();

    const app_con_id = component.addClientForm.get('app_con_id');
    app_con_id?.setValue('something');
    expect(app_con_id?.valid).toBeTrue();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
