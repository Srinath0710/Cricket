import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { URLCONSTANT } from '../../services/url-constant';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { State, UpdateState, EditState } from './state.model';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { Country } from '../country/country.model';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { Drawer } from 'primeng/drawer';
import { SpinnerService } from '../../services/Spinner/spinner.service';
@Component({
  selector: 'app-state',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, BadgeModule, DialogModule, FormsModule, InputTextModule, ReactiveFormsModule, PaginatorModule, TagModule, ConfirmDialogModule, DropdownModule, TooltipModule, Drawer
    , ToastModule
  ],
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css'],
  providers: [
    { provide: URLCONSTANT },
    { provide: MessageService },
    { provide: CricketKeyConstant },
    { provide: ConfirmationService }
  ],
})
export class StateComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  public addStateForm!: FormGroup<any>;
  User_id: number = Number(localStorage.getItem('user_id'));
  Client_id: number = Number(localStorage.getItem('client_id'));
  public ShowForm: boolean = false;
  sidebarTitle: string = '';
  countriesData: Country[] = [];
  selected_country: number | null = null;
  public statesData: any[] = [];
  statesNameData: any[] = [];
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  totalData: any = 0;
  filedata: any;
  submitted: boolean = true;
  data: any;
  searchKeyword: string = '';
  countryID: any;
  StateNamePattern = /^[^'"]+$/; //allstringonly allow value
  conditionConstants = CricketKeyConstant.condition_key;
  statusConstants = CricketKeyConstant.status_code;
  Actionflag = CricketKeyConstant.action_flag
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
    private confirmationService: ConfirmationService,
    public cricketKeyConstant: CricketKeyConstant,
    public spinnerService: SpinnerService,
  ) { }

  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.countryDropdown();
    this.addStateForm = this.formBuilder.group({
      country_id: ['', [Validators.required]],
      state_name: ['', [Validators.required]],
      state_code: ['', [Validators.required]],
      state_id: [''],
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
    this.addStateForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
  }
  countryDropdown() {
    const params: any = {
      user_id: this.User_id?.toString(),
      client_id: this.Client_id?.toString()
    };
    this.apiService.post(this.urlConstant.countryLookups, params).subscribe((res) => {
      this.countriesData = res.data.countries ?? [];
      this.countryID = this.countriesData[0].country_id;
      this.gridLoad();

    }, (err) => {
      if (
        err.status_code === this.statusConstants.refresh &&
        err.error?.message === this.statusConstants.refresh_msg
      ) {
        this.apiService.RefreshToken();
      } else {
        this.failedToast(err.error);
      }
    }
    );
  }


  gridLoad() {
    this.spinnerService.raiseDataEmitterEvent('on');
    if (this.countryID != null && this.countryID !== '') {
      setTimeout(() => {
        const params: any = {
          user_id: this.User_id.toString(),
          action_flag: this.Actionflag.Gridload,
          country_id: this.countryID.toString(),
          client_id: this.Client_id.toString(),
          page_no: this.first.toString(),
          records: this.rows.toString(),
          search_text: this.searchKeyword.toString()
        };

        this.apiService.post(this.urlConstant.getStateList, params).subscribe(
          (res) => {
            this.statesData = res.data.states ?? [];
            this.totalData = this.statesData.length !== 0 ? res.data.states[0].total_records : 0;
            this.spinnerService.raiseDataEmitterEvent('off');
          },
          (err: any) => {
            if (
              err.status_code === this.statusConstants.refresh &&
              err.error?.message === this.statusConstants.refresh_msg
            ) {
              this.apiService.RefreshToken();
            } else {
              this.statesData = [];
              this.totalData = 0;
              this.spinnerService.raiseDataEmitterEvent('off');
            }
          }
        );
      });
    } else {
      this.spinnerService.raiseDataEmitterEvent('off');
      this.statesData = [];
      this.totalData = 0;
    }
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
    this.resetForm();
    this.ShowForm = false;
    this.gridLoad();
  }

  resetForm() {
    this.addStateForm.reset();
    this.submitted = false;
  }

  successToast(data: any) {

    this.msgService.add({
      severity: 'success',
      summary: 'Success',
      detail: data.message,
      data: { image: 'assets/images/default-logo.png' },
    });
  }
  /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({
      data: { image: 'assets/images/default-logo.png' },
      severity: 'error',
      summary: 'Error',
      detail: data.message
    });
  }
  status(state_id: number, url: string) {
    const params: any = {
      user_id: this.User_id?.toString(),
      client_id: this.Client_id?.toString(),
      state_id: state_id?.toString(),
    };
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.gridLoad()) : this.failedToast(res);
      },
      (err: any) => {
        error: (err: any) => {
          console.error('Error loading state list:', err);
        }
      });
  }

  StatusConfirm(state_id: number, actionObject: { key: string; label: string }, currentStatus: string) {
    const { active_status, deactive_status } = this.conditionConstants;
    const isSameStatus =
      (actionObject.key === active_status.key && currentStatus === active_status.status) ||
      (actionObject.key === deactive_status.key && currentStatus === deactive_status.status);
    if (isSameStatus) return;
    const isActivating = actionObject.key === active_status.key;
    const iconColor = isActivating ? '#4CAF50' : '#d32f2f';
    const message = `Are you sure you want to proceed?`;

    this.confirmationService.confirm({
      header: ``,
      message: `
      <div class="custom-confirm-content">
      <i class="fa-solid fa-triangle-exclamation warning-icon" style="color: ${iconColor};"></i>
        <div class="warning">Warning</div>
        <div class="message-text">${message}</div>
      </div>
    `,
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      styleClass: 'p-confirm-dialog-custom',
      accept: () => {
        const url = isActivating ? this.urlConstant.activateState : this.urlConstant.deactivateState;
        this.status(state_id, url);
        this.confirmationService.close();
      },
      reject: () => this.confirmationService.close()
    } as any);
  }
  addCallBack(res: any) {
    this.countryID = this.addStateForm.value.country_id;
    this.resetForm();
    this.ShowForm = false;

    this.successToast(res);
    this.gridLoad();

  }

  onAddState() {
    this.submitted = true;
    if (this.addStateForm.invalid) {
      this.addStateForm.markAllAsTouched();
      return;
    }

    const params: UpdateState = {
      user_id: String(this.User_id),
      client_id: String(this.Client_id),
      country_id: String(this.addStateForm.value.country_id),
      state_name: this.addStateForm.value.state_name,
      state_code: this.addStateForm.value.state_code,
      state_id: String(this.addStateForm.value.state_id || '0'),
    };


    if (this.addStateForm.value.state_id) {
      this.apiService.post(this.urlConstant.updateState, params).subscribe((res) => {

        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    } else {

      this.apiService.post(this.urlConstant.addState, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    }

  }


  editState(editRecord: any) {
    this.addStateForm.setValue({
      state_id: editRecord.state_id,
      country_id: editRecord.country_id,
      state_name: editRecord.state_name,
      state_code: editRecord.state_code
    });
    this.showAddForm();
  }

  filterGlobal() {
    if (this.searchKeyword.length >= 3 || this.searchKeyword.length === 0) {

      this.dt?.filterGlobal(this.searchKeyword, 'contains');
      this.first = 1;
      this.gridLoad();
    }
  }
  clear() {
    this.searchKeyword = '';
    this.dt.clear();
    this.gridLoad();
  }

}

