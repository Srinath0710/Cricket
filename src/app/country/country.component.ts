import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
// import { Sidebar } from 'primeng/sidebar';
import { ApiService } from '../services/api.service';
import { URLCONSTANT } from '../services/url-constant';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Country, EditCountry, UpdateCountry } from './country.model';
import { CricketKeyConstant } from '../services/cricket-key-constant';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';

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
    // Sidebar,
    PaginatorModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    DrawerModule

  ],
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
})

export class CountryComponent implements OnInit {
  public addCountryForm!: FormGroup<any>;
  @ViewChild('dt') dt!: Table;
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  public ShowForm: any = false;
  isEditMode: boolean = false;
  // viewMode: boolean = false;
  region_id: any;
  loading = false;
  regionsData = [];
  timezoneData = [];
  countriesData: Country[] = [];
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  totalData: any = 0;
  filedata: any;
  searchKeyword: string = '';
  visible2: boolean = false;
  submitted: boolean = true;
  time_zone_id: any;
  CountryNamePattern = /^[^'"]+$/; //allstringonly allow value
  conditionConstants= CricketKeyConstant.condition_key;
  statusConstants= CricketKeyConstant.status_code;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private urlConstant: URLCONSTANT, private msgService: MessageService,
    private confirmationService: ConfirmationService, public cricketKeyConstant: CricketKeyConstant) {

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


  timezoneDropdown() {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    this.apiService.post(this.urlConstant.getCountryDropdown, params).subscribe((res) => {
      this.timezoneData = res.data.timezone ?? [];
      this.regionsData = res.data.region ?? [];

    }, (err: any) => {
      if (err.status === 401 && err.error.message === "Expired") {
        this.apiService.RefreshToken();
      }

    });
  }
  gridLoad() {
    this.countriesData = [];
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.page_no = this.first.toString();
    params.records = this.rows.toString();
    params.search_text = this.searchKeyword.toString(),
    this.apiService.post(this.urlConstant.getCountryList, params).subscribe((res) => {
      this.countriesData = res.data.countries ?? [];
      this.totalData = this.countriesData.length != 0 ? res.data.countries[0].total_records : 0
      this.countriesData.forEach((val: any) => {
        val.country_image = `${val.country_image}?${Math.random()}`;
      });
    }, (err: any) => {
      err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.countriesData = [], this.totalData = this.countriesData.length);

    });

  }

  blockQuotesOnly(event: KeyboardEvent) {
  if (event.key === '"' || event.key === "'") {
    event.preventDefault();
  }
}


sanitizeQuotesOnly(controlName: string, event: Event) {
  const input = (event.target as HTMLInputElement).value;
  const cleaned = input.replace(/['"]/g, ''); // remove ' and "
  this.addCountryForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
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
    this.isEditMode = false;
    if (this.addCountryForm.invalid) {
      this.addCountryForm.markAllAsTouched();
      return
    }
    const params: UpdateCountry = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      iso_code_2: this.addCountryForm.value.iso_code_2,
      iso_code_3: this.addCountryForm.value.iso_code_3,
      country_name: this.addCountryForm.value.country_name,
      region_id: String(this.addCountryForm.value.region_id),
      sub_region: this.addCountryForm.value.sub_region,
      time_zone_id: String(this.addCountryForm.value.time_zone_id),
      country_id: String(this.addCountryForm.value.country_id),
      action_flag: 'create',
      capital: '',
      phonecode: '0'
    };
    if (this.addCountryForm.value.country_id) {
      params.action_flag = 'update';
      this.apiService.post(this.urlConstant.updateCountry, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    } else {
      this.apiService.post(this.urlConstant.addCountry, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    }

  }
  addCallBack(res: any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
    this.gridLoad();
  }
  EditCountry(country_id: number) {
    this.isEditMode = true;
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.country_id = country_id?.toString();
    this.apiService.post(this.urlConstant.editCountry, params).subscribe((res) => {
      if (res.status_code == 200) {
        const editRecord: EditCountry = res.data.countries[0] ?? {};
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
      } else {
        this.failedToast(res);
      }
    }, (err: any) => {
      err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
    });


  }

  status(country_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      country_id: country_id?.toString()
    };
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.gridLoad()) : this.failedToast(res);
      },
      (err: any) => {
        err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      }
    );
  }

  StatusConfirm(country_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
    const AlreadyStatestatus =
    (actionObject.key === this.conditionConstants.active_status.key && currentStatus === 'Active') ||
    (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === 'InActive');

  if (AlreadyStatestatus) {
    return; 
  }
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this country?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.conditionConstants.active_status.key === actionObject.key
          ? this.urlConstant.activeCountry
          : this.urlConstant.deactiveCountry;
        this.status(country_id, url);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }
  filterGlobal() {
    this.dt?.filterGlobal(this.searchKeyword, 'contains');
  }
  clear() {
  this.searchKeyword = '';   
  this.dt.clear();          
  this.gridLoad();          
}
  }
