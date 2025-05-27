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
  clientData: any[] = [];
  officialNamePattern = /^[^'"]+$/; //allstringonly allow value
  default_img= CricketKeyConstant.default_image_url.officials;
  dropDownConstants= CricketKeyConstant.dropdown_keys;
  conditionConstants= CricketKeyConstant.condition_key;
  statusConstants= CricketKeyConstant.status_code;


  constructor(private fb: FormBuilder, private apiService: ApiService, private httpClient: HttpClient, private urlConstant: URLCONSTANT,
    private msgService: MessageService, private confirmationService: ConfirmationService
  ) {

  }


  ngOnInit() {
    this.countrydropdown();
    this.Clientdropdown()
    this.addOfficialForm = this.fb.group({
      first_name: ['', [Validators.required]],
      middle_name: [''],
      sur_name: [''],
      display_name: ['', [Validators.required]],
      format_id: ['', [Validators.required]],
      official_category_id: ['', [Validators.required]],
      official_type_id: ['', [Validators.required]],
      profile_img: [''],
      country_id: ['', [Validators.required]],
      official_id: [''],
      reference_id: [''],
      club_id: ['', []],

    })



  }

  countrydropdown() {

    const params: any = {};
    params.action_flag = this.urlConstant.countryofficial.action_flag;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.countryofficial.url, params).subscribe((res) => {
      this.countrydropdownData = res.data.region != undefined ? res.data.region : [];

    }, (err: any) => {
      if (err.status === 401 && err.error.message === "Expired") {
        this.apiService.RefreshToken();

      }
    })


  }
  Clientdropdown() {
    const params: any = {
      user_id: this.user_id?.toString()
    };
    this.apiService.post(this.urlConstant.groundUserClient, params).subscribe((res) => {
      this.clientData = res.data ?? [];
      this.client_id = this.clientData[0].client_id;
      console.log(this.client_id);
      this.callBackClientChange();


    }, (err) => {
      if (err.status === 401 && err.error.message === 'Token expired') {
        this.apiService.RefreshToken();
      }
    });
  }

  callBackClientChange() {
    this.clubsdropdown();
    this.dropdown();
    this.gridload();
  }
  clubsdropdown() {
    const params: any = {
      action_flag: 'dropdown',
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString()
    };

    this.apiService.post(this.urlConstant.officialclubdropdown, params).subscribe(
      (res) => {
        this.configDataList = res.data?.clubs || [];
        console.log("All clubs:", this.configDataList);
      },
      (err: any) => {
        if (err.status === 401 && err.error.message === "Expired") {
          this.apiService.RefreshToken();
        } else {
          this.configDataList = [];
          console.error("Error fetching clubs dropdown:", err);
        }
      }
    );
  }


  dropdown() {
    const params: any = {};
    params.action_flag = 'dropdown';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.dropdownofficial, params).subscribe((res) => {
      this.configDataList = res.data.dropdowns != undefined ? res.data.dropdowns : [];
      const configFilterKeys = this.dropDownConstants.config_key
      this.teamformat = res.data.dropdowns
        .filter((item: any) => item.config_key === configFilterKeys.team_format)
        .map((item: any) => ({ ...item }));
      this.officialtype = res.data.dropdowns
        .filter((item: any) => item.config_key === configFilterKeys.officials)
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

    },

      (err: any) => {


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

  //single quotes and doble quotes remove all label box 
  blockQuotesOnly(event: KeyboardEvent) {
    if (event.key === '"' || event.key === "'") {
      event.preventDefault();
    }
  }


  sanitizeQuotesOnly(controlName: string, event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const cleaned = input.replace(/['"]/g, ''); // remove ' and "
    this.addOfficialForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
  }


  addOfficialdata() {
    this.submitted = true;
    this.isEditMode = false;
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
      reference_id: String(this.addOfficialForm.value.reference_id),
      club_id: String(this.addOfficialForm.value.club_id),
      action_flag: 'create'

    };


    if (this.addOfficialForm.value.official_id) {
      // params.action_flag='update';
      this.apiService.post(this.urlConstant.updateOfficial, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    } else {

      this.apiService.post(this.urlConstant.addofficial, params).subscribe((res) => {
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





  onOfficialChange(selectedId: number) {
    const selectedItem = this.officialtype.find(item => item.config_id === selectedId);
    this.addOfficialForm.patchValue({
      official_category_id: null

    })
    const officialConstants = this.dropDownConstants.official_keys;

    const roleMap: any = {
      [officialConstants.umpire_category.short_key]: officialConstants.umpire_category,
      [officialConstants.scorer.short_key]: officialConstants.scorer,
      [officialConstants.analyst.short_key]: officialConstants.analyst,
    };

    const selectedRole = roleMap[selectedItem.config_short];

    if (selectedRole) {
      this.childOptions = this.configDataList.filter(
        (item: any) => item.config_key === selectedRole.key
      );
      this.childLabel = selectedRole.label;
    } else {
      this.childOptions = [];
      this.childLabel = '';
    }

  }

  formSetValue() {
    this.addOfficialForm.patchValue({
      team_format: this.teamformat[0].config_id,


    })
  }

  Editofficial(official: any) {
    this.isEditMode = true;
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
            reference_id: editRecord.reference_id,
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
        res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.gridload()) : this.failedToast(res);
      },
      (err: any) => {
        error: (err: any) => {
          console.error('Error loading official list:', err);
        }
      });
  }

  StatusConfirm(official_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
    const AlreadyStatestatus =
      (actionObject.key === this.conditionConstants.active_status.key && currentStatus === this.conditionConstants.active_status.status) ||
      (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === this.conditionConstants.deactive_status.status);

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
        const url: string = this.conditionConstants.active_status.key === actionObject.key ? this.urlConstant.activateofficial : this.urlConstant.deactivateofficial;
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



}
