import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { URLCONSTANT } from '../../services/url-constant';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UpdateSeason, EditSeason, Season } from './seasons.model';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { Drawer } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-seasons',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule,
    BadgeModule, DialogModule, FormsModule,
    DropdownModule, FileUploadModule, InputTextModule,
    PaginatorModule, TagModule, ReactiveFormsModule,
    ConfirmDialogModule, Drawer, TooltipModule, CalendarModule, ToastModule

  ],
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.css',
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
})
export class SeasonsComponent implements OnInit {

  statusOptions = [
    { label: 'Active ', value: 'Active' },
    { label: 'Current', value: 'Current' }
  ];


  public addSeasonsForm!: FormGroup<any>;
  @ViewChild('dt') dt!: Table;
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  public ShowForm: boolean = false;
  isEditMode: boolean = false;
  viewMode: boolean = false;
  seasonsData: any[] = [];
  isClientShow: boolean = false;
  association_id: any;
  loading = false;
  showTime = false;
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  totalData: any = 50;
  fileData: any;
  clientData: any[] = [];
  searchKeyword: string = '';
  submitted: boolean = true;
  season: any;
  SeasonsNamePattern = /^[^'"]+$/; //allstringonly allow value

  conditionConstants = CricketKeyConstant.condition_key;
  statusConstants = CricketKeyConstant.status_code;
  dropDownConstants = CricketKeyConstant.dropdown_keys;
  Actionflag = CricketKeyConstant.action_flag;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private urlConstant: URLCONSTANT, private msgService: MessageService,
    private confirmationService: ConfirmationService, public cricketKeyConstant: CricketKeyConstant) {

  }

  ngOnInit() {
    this.gridload();
    this.Clientdropdown();
    this.addSeasonsForm = this.formBuilder.group({
      season_name: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      season_status: ['', [Validators.required]],
      season_id: ['']
    })
  }

  gridload() {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      page_no: this.first.toString(),
      records: this.rows.toString(),
      search_text: this.searchKeyword.toString()
    };

    this.apiService.post(this.urlConstant.getSeasons, params).subscribe({
      next: (res) => {
        this.seasonsData = res.data?.seasons || [];
        this.totalData = res.data?.totalRecords || this.seasonsData.length;
      },
      error: (err) => {
        if (
          err.status_code === this.statusConstants.refresh &&
          err.error.message === this.statusConstants.refresh_msg
        ) {
          this.apiService.RefreshToken();
        } else {
          this.seasonsData = [];
          this.totalData = 0;
        }
      },
    });
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
    this.addSeasonsForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
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

  showAddForm() {
    this.isEditMode = false;
    this.ShowForm = true;
  }

  cancelForm() {
    this.ShowForm = false;
  }

  resetForm() {
    this.addSeasonsForm.reset();
    this.submitted = false;
  }

  successToast(data: any) {
    this.msgService.add({ key: 'ts', severity: 'success', summary: 'Success', detail: data.message });
  }

  failedToast(data: any) {
    this.msgService.add({ key: 'ts', severity: 'error', summary: 'Error', detail: data.message });
  }

  onAddSeason() {
    this.submitted = true;
    if (this.addSeasonsForm.invalid) {
      this.addSeasonsForm.markAllAsTouched();
      return
    }

    const params: UpdateSeason = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      season_id: String(this.addSeasonsForm.value.season_id),
      season_name: this.addSeasonsForm.value.season_name,
      start_date: this.addSeasonsForm.value.start_date,
      end_date: this.addSeasonsForm.value.end_date,
      season_status: String(this.addSeasonsForm.value.season_status),
      action_flag: this.Actionflag.Create,

    };
    if (this.addSeasonsForm.value.season_id) {
      params.action_flag = this.Actionflag.Update;
      this.apiService.post(this.urlConstant.updateSeason, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    } else {
      this.apiService.post(this.urlConstant.addSeason, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    }

  }
  addCallBack(res: any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
    this.gridload();
  }


  EditSeason(season_id: number) {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.season_id = season_id?.toString();

    this.apiService.post(this.urlConstant.editSeason, params).subscribe((res) => {
      console.log(res);
      if (res.status_code == 200) {
        const editRecord: EditSeason = res.data.seasons[0] ?? {};
        if (editRecord != null) {
          this.addSeasonsForm.setValue({
            season_id: editRecord.season_id,
            season_name: editRecord.season_name,
            start_date: typeof editRecord.start_date === 'string' ? editRecord.start_date.slice(0, 10) : '',
            end_date: typeof editRecord.end_date === 'string' ? editRecord.end_date.slice(0, 10) : '',
            season_status: editRecord.season_status
          });
          this.showAddForm();
           this.isEditMode = true;
        }
      } else {
        this.failedToast(res);
      }
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh &&
        err.error.message === this.statusConstants.refresh_msg
        ? this.apiService.RefreshToken()
        : this.failedToast(err.error);
    });
  }


  status(season_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      season_id: season_id?.toString()
    };
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.gridload()) : this.failedToast(res);
      },
      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      }
    );
  }

  StatusConfirm(season_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
    const AlreadyStatestatus =
      (actionObject.key === this.conditionConstants.active_status.key && currentStatus === this.conditionConstants.active_status.status) ||
      (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === this.conditionConstants.deactive_status.status);

    if (AlreadyStatestatus) {
      return;
    }
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this season?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.conditionConstants.active_status.key === actionObject.key ? this.urlConstant.activateSeason : this.urlConstant.deactivateSeason;
        this.status(season_id, url);
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
    this.gridload();
  }

  Clientdropdown() {
    const params: any = {
      user_id: this.user_id?.toString()
    };
    this.apiService.post(this.urlConstant.groundUserClient, params).subscribe((res) => {
      this.clientData = res.data ?? [];
      this.client_id = this.clientData[0].client_id;
      this.isClientShow = this.clientData.length > 1 ? true : false;
      this.gridload();
      // this.getGlobalData();

    }, (err) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });
  }
  // getGlobalData() {
  //   const params: any = {
  //     action_flag: this.Actionflag.Dropdown,
  //     user_id: this.user_id.toString(),
  //     client_id: this.client_id.toString()
  //   };

  //   this.apiService.post(this.urlConstant.dropdownTeam, params).subscribe(
  //     (res) => {
  //       const dropdowns = Array.isArray(res.data?.dropdowns) ? res.data.dropdowns : [];
  //       this.statusOptions = dropdowns.filter((item: any) => item.config_key === this.dropDownConstants.config_key);
  //     },
  //     (err: any) => {
  //       this.seasonsData = [];
  //     }
  //   );
  // }

}



