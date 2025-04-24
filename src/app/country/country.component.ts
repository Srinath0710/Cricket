import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { Sidebar } from 'primeng/sidebar';
import { ApiService } from '../services/api.service';
import { URLCONSTANT } from '../services/url-constant';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    FileUploadModule,
    InputTextModule,
    ReactiveFormsModule,
    Sidebar,
    PaginatorModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule
    
  ],
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
  providers: [
    { provide: URLCONSTANT },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
})

export class CountryComponent implements OnInit {
  public addCountryForm!: FormGroup<any>;
  user_id = localStorage.getItem('user_id');
  client_id = localStorage.getItem('client_id');
  public ShowForm: any = false;
  isEditMode: boolean = false;
  viewMode: boolean = false;
  region_id: any;
  loading = false;
  regionsData = [];
  timezoneData = [];
  countriesData = [];
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 5;
  totalData: any = 0;
  filedata: any;

  submitted: boolean = true;
  time_zone_id: any;


  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private urlConstant: URLCONSTANT, private msgService: MessageService,private confirmationService: ConfirmationService) {
    // this.statuses = [
    //     {label: 'Active', value: 'active'},
    //     {label: 'Inactive', value: 'inactive'},
    // ];

  }
  ngOnInit() {
    this.gridLoad();
    this.timezoneDropdown();
    this.addCountryForm = this.formBuilder.group({
      country_id: [''],
      iso_code_2: ['', [Validators.required]],
      iso_code_3: ['', [Validators.required]],
      country_name: ['', [Validators.required]],
      region_id: ['', [Validators.required]],
      sub_region: ['', [Validators.required]],
      time_zone_id: ['', [Validators.required]],
      country_image: ['']

    })
  }
  //   ngAfterViewInit() {
  //     setTimeout(()=>{

  //     },100)
  // }

  timezoneDropdown() {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    const url = this.urlConstant.getCountryDropdown;
    this.apiService.post(url, params).subscribe((res) => {
      this.timezoneData = res.data.timezone ?? [];
      this.regionsData = res.data.region ?? [];

    }, (err: any) => {
      if (err.status === 401 && err.error.message === "Expired") {
        this.apiService.RefreshToken();
      }

    });
  }
  gridLoad() {

    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.page_no = this.first.toString();
    params.records = this.rows.toString();
    const url = this.urlConstant.getCountryList;
    this.apiService.post(url, params).subscribe((res) => {
      this.countriesData = res.data.countries ?? [];
      this.totalData = 50;
      this.countriesData.forEach((val: any) => {
        val.country_image = `${val.country_image}?${Math.random()}`;
      });
    }, (err: any) => {
      if (err.status === 401 && err.error.message === "Expired") {
        this.apiService.RefreshToken()
      }
      else {
        this.countriesData = []
        this.totalData = this.countriesData.length;
      }
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
    this.addCountryForm.reset();
    this.submitted = false;
  }
  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

  }

  /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }
  onAddCountry() {
    this.submitted = true;
    console.log(this.addCountryForm)
    if (this.addCountryForm.invalid) {
      this.addCountryForm.markAllAsTouched();
      return
    }

    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.iso_code_2 = this.addCountryForm.value.iso_code_2.toString();
    params.iso_code_3 = this.addCountryForm.value.iso_code_3.toString();
    params.country_name = this.addCountryForm.value.country_name.toString();
    params.region_id = this.addCountryForm.value.region_id.toString();
    params.sub_region = this.addCountryForm.value.sub_region.toString();
    params.time_zone_id = this.addCountryForm.value.time_zone_id.toString();
    const country_id = this.addCountryForm.value.country_id;
    if (this.addCountryForm.value.country_id !== null && this.addCountryForm.value.country_id !== '') {
      params.country_id = country_id.toString();
      params.action_flag = 'update';
      const url = this.urlConstant.updateCountry;
      this.apiService.post(url, params).subscribe((res) => {
        if (res.status_code == 200) {
          this.resetForm();
          this.cancelForm();
          this.successToast(res);
          this.gridLoad();

        } else {
          this.failedToast(res);
        }
      }, (err: any) => {
        if (err.status === 401 && err.error.message === "Expired") {
          this.apiService.RefreshToken();
        } else {
          this.failedToast(err);
        }
      });
    } else {
      params.action_flag = 'create';

      const url = this.urlConstant.addCountry;
      this.apiService.post(url, params).subscribe((res) => {
        if (res.status_code == 200) {
          this.resetForm();
          this.cancelForm();

          this.successToast(res);
          this.gridLoad();


        } else {
          this.failedToast(res);
        }
      })
    }

  }
  EditCountry(country_id: any) {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.country_id = country_id?.toString();
    const url = this.urlConstant.editCountry;
    this.apiService.post(url, params).subscribe((res) => {
      console.log(res);
      if (res.status_code == 200) {

      const editRecord: any = res.data.countries[0] ?? {};
      if (editRecord != null) {
        this.addCountryForm.setValue({
          country_id: editRecord.country_id,
          iso_code_2: editRecord.iso_code_2,
          iso_code_3: editRecord.iso_code_3,
          country_name: editRecord.country_name,
          region_id: editRecord.region_id,
          sub_region: editRecord.sub_region,
          time_zone_id: editRecord.time_zone_id,
          country_image: null
        });
        this.showAddForm();
      }
    }else{
      this.failedToast(res);
    }
    }, (err: any) => {
      if (err.status === 401 && err.error.message === "Expired") {
        this.apiService.RefreshToken()
      }
      else {
        this.failedToast(err);
      }
    });


  }

  ActiveCountry(country_id: any) {
    console.log("hi")
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      country_id: country_id?.toString()
    };
    const url = this.urlConstant.activeCountry;
    this.apiService.post(url, params).subscribe(
      (res) => {
        this.gridLoad();
        console.log('Country activated:', res);
      },
      (error) => {
        console.error('Error activating country:', error);
      }
    );
  }
  DeactivatedCountry(country_id: any) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      country_id: country_id?.toString()
    };
    const url = this.urlConstant.deactiveCountry;
    this.apiService.post(url, params).subscribe(
      (res) => {
        this.gridLoad();
        console.log('Country Deactivated:', res);
      },
      (error) => {
        console.error('Error Deactivated country:', error);
      }
    );
  }
  confirmActivation(country_id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to activate this country?',
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.ActiveCountry(country_id);
      this.confirmationService.close();
      },
      reject: () => {
        this.msgService.add({ severity: 'info', summary: 'Cancelled', detail: 'Country activation cancelled' });
      this.confirmationService.close();
      }
    });
  }
  confirmDeactivation(country_id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to Deactivate this country?',
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.DeactivatedCountry(country_id);
      this.confirmationService.close();
      },
      reject: () => {
        this.msgService.add({ severity: 'info', summary: 'Cancelled', detail: 'Country Deactivation cancelled' });
      this.confirmationService.close();
      }
    });
  }
}