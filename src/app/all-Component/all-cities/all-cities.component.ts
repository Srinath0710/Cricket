import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormsModule ,FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { URLCONSTANT } from '../../services/url-constant';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { Country,UpdateCity } from './all-cities.model';
import { Drawer } from 'primeng/drawer';
interface City {
  name: string;
  code: string;
  state: string;
  country?: string;
  status: string;
}

@Component({
  selector: 'app-all-cities',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    SidebarModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    DialogModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    PaginatorModule,
    Drawer
  ],
  templateUrl: './all-cities.component.html',
  styleUrls: ['./all-cities.component.css'],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
})
export class AllCitiesComponent implements OnInit {
  public addCityForm!: FormGroup<any>;
  sidebarVisible: boolean = false;
  public ShowForm: any = false;
  isEditMode: boolean = false;
  viewMode: boolean = false;
  searchKeyword: string = '';
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  state_id: number = Number(localStorage.getItem('state_id'));
  first: number = 1;
  rows: number = 10;
  cityData: any = [];
  countryData: Country[] = [];
  statesList: any[] = [];
  gridStates: any[] = [];
  formStates: any[] = [];
  totalData: any = 0;
  pageData: number = 0;
  submitted: boolean = false;
  gridCountryId: number | null = null;
  gridStateId: number | null = null;
  formCountryId: any;
  formStateId: any;
  selected_country: any;
  stateId: any;
  country_id: any;
  countryId: any;
  addAnother: boolean = false;

  constructor(private formBuilder:FormBuilder, private apiService: ApiService,
    private urlConstant: URLCONSTANT, private msgService: MessageService,
    private confirmationService: ConfirmationService,public cricketKeyConstant :CricketKeyConstant
  ){

  }

  ngOnInit() {
   this.getCountries();
   this.addCityForm = this.formBuilder.group({
    city_id: [''],
    country_id: ['', Validators.required],
    state_id: ['', Validators.required],
    city_name: ['', Validators.required],
  city_code: ['', Validators.required]
  })
  
}
    
getCountries() {
  const params: any = {};
  params.action_flag = 'get_countries';
  params.user_id = this.user_id.toString();
  params.client_id = this.client_id.toString();
  this.apiService.post(this.urlConstant.countryLookups, params).subscribe((res) => {
      this.countryData = res.data.countries != undefined ? res.data.countries : [];
      this.countryId = this.countryData[0].country_id;

      this.getStates(this.countryId);
        }, (err: any) => {
      if (err.status === 401 && err.error.message === "Expired") {
          this.apiService.RefreshToken();
         
      } else {
          this.failedToast(err);
      }
  });
}

getStates(countryId:any) {
  const params: any = {};
  params.action_flag = 'get_state_by_country';
  params.user_id = this.user_id.toString();
  params.client_id = this.client_id.toString();
  params.country_id = countryId.toString();
  this.apiService.post(this.urlConstant.getStatesByCountry, params).subscribe((res) => {
      this.statesList = res.data.states != undefined ? res.data.states : [];
  }, (err: any) => {
      if (err.status === 401 && err.error.message === "Expired") {
          this.apiService.RefreshToken();
          
      }
  });
}
  
  gridLoad() {
    setTimeout(()=>{
      this.getCountries();

  },1000)
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.state_id = this.stateId?.toString();
    params.page_no = this.first.toString();
    params.records = this.rows.toString();    
  
    this.apiService.post(this.urlConstant.getCityList, params).subscribe((res)=>{

      this.cityData = res.data.states ?? [];
      console.log(this.cityData);
      this.totalData = 50;
   
    }, (err: any) => {
           err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : (this.cityData = [],this.totalData = this.cityData.length);

    });

  }
  
  
  calculateFirst(): number {
    return (this.first - 1) * this.rows;
  }
  onPageChange(event: any) {
    this.first = (event.page) + 1;
    this.pageData = event.first;
    this.rows = event.rows;
     this.gridLoad();
  }
  
  showAddForm() {
    this.ShowForm = true;
  }
  cancelForm() {
    this.ShowForm = false;
  }
  resetForm() {
    this.addCityForm.reset();
    this.submitted = false;
  }
  
  showList() {

    this.ShowForm = false;
    this.resetForm();
}
  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

  }

  /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }

  status(city_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      city_id: city_id?.toString()
    };
  
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.cricketKeyConstant.status_code.success && res.status
          ? (this.successToast(res), this.gridLoad())
          : this.failedToast(res);
      },
      (err: any) => {
        err.status === this.cricketKeyConstant.status_code.refresh &&
        err.error.message === this.cricketKeyConstant.status_code.refresh_msg
          ? this.apiService.RefreshToken()
          : this.failedToast(err);
      }
    );
  }
  
  onAddCity() {
    this.submitted = true;
    this.isEditMode = false;
  
    if (this.addCityForm.invalid) {
      this.addCityForm.markAllAsTouched();
      return;
    }
  
    const params: UpdateCity = {

      user_id: String(this.user_id),
      client_id: String(this.client_id),
      state_id: String(this.addCityForm.value.state_id),
      country_id: String(this.addCityForm.value.country_id),
      city_name:this.addCityForm.value.city_name,
      city_code:this.addCityForm.value.city_code,
      city_id:this.addCityForm.value.city_id,
      action_flag: 'create',
        capital: '',
    };
  
    if (this.addCityForm.value.city_id) {
      params.action_flag = 'update';
      this.apiService.post(this.urlConstant.updateCity, params).subscribe((res) => {

        if (res.status_code == 200) {
          this.countryId = Number(params.country_id);
          this.stateId = Number(params.state_id);

          setTimeout(() => {
            this.getStates(this.countryId);
            this.gridLoad();
              this.successToast(res);
              this.showList();
              // this.ShowDrops();
              this.resetForm();
              if (this.addAnother == true) {
                  this.showAddForm()
              }
          }, 100)
      } else {
          this.failedToast(res)
      }

        res.status_code === this.cricketKeyConstant.status_code.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    } else {
      this.apiService.post(this.urlConstant.addCity, params).subscribe((res) => {
        this.countryId = this.addCityForm.get('country_id')?.value;
        res.status_code === this.cricketKeyConstant.status_code.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    }

  }
  EditCity(city_id: number) {
    this.isEditMode = true;
    this.ShowForm = true;
    const city = this.cityData.find((c: any) => c.city_id === city_id);
    if (city) { 

      this.addCityForm.patchValue({
        city_id: city.city_id,
        country_id: city.country_id,
        state_id: city.state_id,
        city_name: city.city_name,
        city_code: city.city_code
      });
    }
  }

 
  


  addCallBack(res: any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
   this.gridLoad();
  }
  onGridCountryChange(event: any) {
    this.gridCountryId = event.value;
    if (this.gridCountryId !== null) {

    }
    this.gridStateId = null;
    this.cityData = [];
  }
  


  StatusConfirm(city_id: number, actionObject: { key: string; label: string }) {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this city?`, 
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.cricketKeyConstant.condition_key.active_status.key === actionObject.key
          ? this.urlConstant.activecity
          : this.urlConstant.deactiveCity;
        this.status(city_id, url);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }
  
}
