import { Component, ViewChild } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { officials } from './officials.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { URLCONSTANT } from '../../services/url-constant';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SidebarModule } from 'primeng/sidebar';
// import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { offcialupdate } from './officials.model';
import { ReactiveFormsModule } from '@angular/forms';
import { offcialedit } from './officials.model';
import { OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Drawer } from 'primeng/drawer';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';

interface official {
  config_id: string;
}

@Component({
  selector: 'app-officials',
  templateUrl: './officials.component.html',
  styleUrl: './officials.component.css',
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TagModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    CalendarModule,
    HttpClientModule,
    DrawerModule,
    ConfirmDialogModule,
    Drawer,
    PaginatorModule,
    ToastModule
  ],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }

  ],
})
export class OfficialsComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  pageno: number = 1;
  records: number = 10;
  searchKeyword: string = '';
  visible: boolean = false;
  isEditing: boolean = false;
  public ShowForm: boolean = false;
  position: 'right' = 'right';
  addOfficialForm!: FormGroup;
    first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  totalData: any = 0;

  backScreen: any;
  selectedOfficial: any = null;
  visibleDialog: boolean = false;
  official: officials[] = [];
  officialList: any[] = [];
  // sidebarVisible: boolean = false;
  isEditMode: boolean = false;
  submitted: boolean = false;
  officialDataList = [];
  configDataList: official[] = [];
  countrydropdownData: any;
  teamformat: official[] = [];
  officialcategory: official[] = [];
  officialtype: any[] = [];
  childOptions: any[] = [];
  childLabel: string = '';
  officialId: any;
  default_img: any = 'assets/images/default-player.png';
  clientData: any[] = [];


  constructor(private fb: FormBuilder, private apiService: ApiService, private httpClient: HttpClient, private urlConstant: URLCONSTANT, public cricketKeyConstant: CricketKeyConstant,
    private msgService: MessageService, private confirmationService: ConfirmationService
  ) {

  }


  ngOnInit() {

    this.Clientdropdown()
      this.addOfficialForm = this.fb.group({
      first_name: ['', [Validators.required]],
      middle_name: [''],
      sur_name: [''],
      display_name: ['', [Validators.required]],
       format_id: ['', [Validators.required]],
      official_category_id: ['',[Validators.required]],
      official_type_id: ['', [Validators.required]],
      profile_img: [''],
      country_id: ['', [Validators.required]],
      official_id: [''],

    })
    this.dropdown();
    this.countrydropdown();

  }


  gridload() {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.page_no = this.first.toString();
    params.records = this.rows.toString();
    params.search_text = this.searchKeyword.toString();
    this.apiService.post(this.urlConstant.officiallist, params).subscribe((res) => {
      if (res.data?.officials) {
        this.officialDataList = res.data.officials;
        this.totalData = this.officialDataList.length !== 0 ? res.data.officials[0].total_records : 0;
      } else {
        this.officialDataList = [];
        this.totalData = 0;
      }
      // this.officialDataList = res.data.officials ?? [];
      // this.totalData = this.officialDataList.length!=0 ? res.data.officials[0].total_records:0
    }, (err: any) => {
      error: (err: any) => {
        console.error('Error loading official list:', err);
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
    this.gridload();
    
  }
  addOfficialdata() {
    this.submitted = true;
    this.isEditMode=false;
    if (this.addOfficialForm.invalid) {
      this.addOfficialForm.markAllAsTouched();
      return
    }
    const params: offcialupdate = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      first_name: this.addOfficialForm.value.first_name,
      middle_name: this.addOfficialForm.value.middle_name,
      sur_name: this.addOfficialForm.value.sur_name,
      display_name: String(this.addOfficialForm.value.display_name),
      format_id: String(this.addOfficialForm.value.format_id),
      official_type_id: String(this.addOfficialForm.value.official_type_id),
      official_category_id: String(this.addOfficialForm.value.official_category_id),
      country_id: String(this.addOfficialForm.value.country_id),
      profile_img: String(this.addOfficialForm.value.profile_img),
      official_id: String(this.addOfficialForm.value.official_id),
      action_flag: 'create'

    };


    if (this.addOfficialForm.value.official_id) {
      // params.action_flag='update';
      this.apiService.post(this.urlConstant.updateOfficial, params).subscribe((res) => {
        res.status_code === this.cricketKeyConstant.status_code.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    } else {

      this.apiService.post(this.urlConstant.addofficial, params).subscribe((res) => {
        res.status_code === this.cricketKeyConstant.status_code.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    }

  }

  addCallBack(res: any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
    this.gridload();
  }

  showAddForm() {
    this.ShowForm = true;
  }

  cancelForm() {
    this.ShowForm = false;
  }

  resetForm() {
    this.addOfficialForm.reset();
    this.submitted = false;
  }




  countrydropdown() {

    const params: any = {};
    params.action_flag = 'dropdown';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.countryofficial, params).subscribe((res) => {
      this.countrydropdownData = res.data.region != undefined ? res.data.region : [];

    }, (err: any) => {
      if (err.status === 401 && err.error.message === "Expired") {
        this.apiService.RefreshToken();

      }
    })


  }

  onOfficialChange(selectedId: number) {
    const selectedItem = this.officialtype.find(item => item.config_id === selectedId);
    this.addOfficialForm.patchValue({
      official_category_id: null
      
    })
    switch (selectedItem.config_short) {
      case 'UMP':
        this.childOptions = this.configDataList.filter((item: any) => item.config_key === 'umpire_category');
        this.childLabel = 'Umpire Category';
        break;
      case 'VDA':

        this.childOptions = this.configDataList.filter((item: any) => item.config_key === 'analyst');
        this.childLabel = 'Analyst Level';
        break;
      case 'SCR':

        this.childOptions = this.configDataList.filter((item: any) => item.config_key === 'scorer');
        this.childLabel = 'Scorer Type';
        break;
      default:
        this.childOptions = [];
        this.childLabel = '';
        break;
    }

  }


  dropdown() {
    const params: any = {};
    params.action_flag = 'dropdown';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.dropdownofficial, params).subscribe((res) => {
      this.configDataList = res.data.dropdowns != undefined ? res.data.dropdowns : [];

      this.teamformat = res.data.dropdowns
        .filter((item: any) => item.config_key === 'team_format')
        .map((item: any) => ({ ...item }));
      this.officialtype = res.data.dropdowns
        .filter((item: any) => item.config_key === 'officials')
        .map((item: any) => ({ ...item }));


      setTimeout(() => {
        const teamId = this.addOfficialForm.get('team_id')?.value;
        if (!teamId) {
          this.formSetValue();
        }
      }, 100);

    }, (err: any) => {
      if (err.status === 401 && err.error.message === "Expired") {
        this.apiService.RefreshToken();

      }
    })
  }

  formSetValue() {
    this.addOfficialForm.patchValue({
      team_format: this.teamformat[0].config_id,


    })
  }

  Editofficial(official: any) {
    this.isEditMode=true;
    this.officialId = official.official_id;
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.official_id = official.official_id?.toString();
    this.apiService.post(this.urlConstant.editofficial, params).subscribe((res) => {
      if (res.status_code == 200) {
        const editRecord: offcialedit = res.data.officials[0] ?? {};
        if (editRecord != null) {
          this.onOfficialChange(editRecord.official_type_id);

          this.addOfficialForm.setValue({

            first_name: editRecord.first_name,
            middle_name: editRecord.middle_name,
            sur_name: editRecord.sur_name,
            display_name: editRecord.display_name,
            official_type_id: editRecord.official_type_id,
            format_id: editRecord.format_id,
            official_category_id: editRecord.official_category_id,
            country_id: editRecord.country_id,
            profile_img: null,
            official_id: editRecord.official_id,
          });
          this.showAddForm();
        }
      } else {
        this.failedToast(res);
      }
    }, (err: any) => {
      err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
    });

  }

  viewShowDialog() {
    this.visibleDialog = true
    this.backScreen = "overlay1"
  }
  viewofficial(official: any) {
    this.selectedOfficial = official;
    this.visibleDialog = true;
  }

  onSubmit() {
    if (this.addOfficialForm.invalid) return;

    const officialData = this.addOfficialForm.value;

    if (this.isEditing) {
      this.official = Object.assign({}, officialData);
    }
    else {
      this.official.push(Object.assign({}, officialData));
    }

    this.visible = false;
  }

  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

  }

  /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }

  status(official_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      official_id: official_id?.toString()
    };
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.cricketKeyConstant.status_code.success && res.status ? (this.successToast(res), this.gridload()) : this.failedToast(res);
      },
      (err: any) => {
        error: (err: any) => {
          console.error('Error loading official list:', err);
        }
      });
  }

  StatusConfirm(official_id: number, actionObject: { key: string, label: string },currentStatus:string) {
    const AlreadyStatestatus =
    (actionObject.key === this.cricketKeyConstant.condition_key.active_status.key && currentStatus === 'Active') ||
    (actionObject.key === this.cricketKeyConstant.condition_key.deactive_status.key && currentStatus === 'InActive');

  if (AlreadyStatestatus) {
    return; 
  }
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this Official?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.cricketKeyConstant.condition_key.active_status.key === actionObject.key ? this.urlConstant.activateofficial : this.urlConstant.deactivateofficial;
        this.status(official_id, url);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }


  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

    filterGlobal() {
    this.first = 1; 
    this.gridload();

  }

  clear() {
  this.searchKeyword = '';   
  this.dt.clear();          
  this.gridload();          
}

Clientdropdown() {
  const params: any = {
    user_id: this.user_id?.toString()
  };
  this.apiService.post(this.urlConstant.groundUserClient, params).subscribe((res) => {
    this.clientData = res.data ?? [];
    this.client_id = this.clientData[0].client_id;
    console.log(this.client_id);
    this.gridload();

  }, (err) => {
    if (err.status === 401 && err.error.message === 'Token expired') {
      this.apiService.RefreshToken();
    }
  });
}


}
