import { Component, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { Drawer } from 'primeng/drawer';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { ApiService } from '../../services/api.service';
import { URLCONSTANT } from '../../services/url-constant';
import { UpdateUser, CreateUser } from './users.model';
import { SpinnerService } from '../../services/Spinner/spinner.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    Drawer,
    DialogModule,
    DrawerModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    BadgeModule,
    TagModule,
    CalendarModule,
    TooltipModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [
    { provide: URLCONSTANT },
    { provide: MessageService },
    { provide: ConfirmationService },
    { provide: CricketKeyConstant },
    { provide: ToastService }
  ],
})
export class UsersComponent implements OnInit {
  readonly dt = viewChild.required<Table>('dt');
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  public addUsersForm!: FormGroup<any>;
  public ShowForm: any = false;
  loading = false;
  isEditMode: boolean = false;
  isClientShow: boolean = false;
  clientData: any[] = [];
  searchkeyword: string = '';
  user_type: string = '';
  usersData: any = [];
  // totalRecords: number = 0;
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  totalData: any = 0;
  filedata: any;
  url: any;
  profileImages: any;
  submitted: boolean = true;
  users: any;
  userTypesDropdown: any[] = [];
  rolesDropdown: any[] = [];
  OfficialDropdown: any[] = [];
  associationDropdown: any[] = [];
  showClientDropdown = false;
  showRolesDropdown = false;
  showAssociationsDropdown = false;
  showOfficialDropdown = false;


  conditionConstants = CricketKeyConstant.condition_key;
  Actionflag = CricketKeyConstant.action_flag;
  statusConstants = CricketKeyConstant.status_code;

  constructor(
    private formBuilder: FormBuilder,
    private msgService: MessageService,
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private urlConstant: URLCONSTANT,
    public spinnerService: SpinnerService,
    public toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.first = 0;
    this.spinnerService.raiseDataEmitterEvent('on');
    this.Clientdropdown();
    this.UserDropdowns();

    this.addUsersForm = this.formBuilder.group(
      {
        client_id: [''],
        user_name: ['', Validators.required],
        u_password: ['', Validators.required],
        confirm_password: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
          ],
        ],
        user_type: ['', Validators.required],
        ref_id: [''],
        role_id: ['', Validators.required],
        // association: [''],
        login_user_id: [''],
      },
      {
        validator: this.matchPasswords('u_password', 'confirm_password'),
      }
    );

    this.addUsersForm.get('user_type')?.valueChanges.subscribe((val) => {
      this.onUserTypeChange(val);
    });
  }


  gridLoad() {
    // this.Clientdropdown();
    this.spinnerService.raiseDataEmitterEvent('on');
    this.usersData = [];
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.page_no = (this.first / this.rows + 1).toString();
    params.records = this.rows.toString();
    params.search_text = this.searchkeyword.toString(),
      this.apiService.post(this.urlConstant.getUsersList, params).subscribe((res) => {
        this.usersData = res.data.users ?? [];
        this.totalData = this.usersData.length != 0 ? res.data.users[0].total_records : 0;
        this.spinnerService.raiseDataEmitterEvent('off');
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.spinnerService.raiseDataEmitterEvent('off'), this.usersData = [], this.totalData = this.usersData.length);
      });
  }

  successToast(data: any) {
    this.toastService.successToast({ message: data.message })
  }

  failedToast(data: any) {
    this.toastService.failedToast({ message: data.message })
  }

  calculateFirst(): number {
    return (this.first - 1) * this.rows;
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.gridLoad();
  }


  showAddForm() {
    this.isEditMode = false;
    this.resetForm();
    this.ShowForm = true;
    this.addUsersForm.get('u_password')?.setValidators([Validators.required]);
    this.addUsersForm.get('confirm_password')?.setValidators([Validators.required]);
    this.addUsersForm.get('u_password')?.updateValueAndValidity();
    this.addUsersForm.get('confirm_password')?.updateValueAndValidity();
  }


  blockQuotesOnly(event: KeyboardEvent) {
    if (event.key === '"' || event.key === "'") {
      event.preventDefault();
    }
  }

  sanitizeQuotesOnly(controlName: string, event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const cleaned = input.replace(/['"]/g, '');
    this.addUsersForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
  }

  status(user_id: number, url: string) {
    const params: any = {
      user_id: user_id?.toString(),
      login_user_id: 0
    };

    this.apiService.post(url, params).subscribe(
      (res: any) => {
        if (res.status_code === this.statusConstants.success && res.status) {
          this.successToast(res);
          this.usersData = this.usersData.map((user: any) => {
            if (user.user_id === user_id) {
              return {
                ...user, record_status: url === this.urlConstant.activateUsers
                  ? 'Active'
                  : 'InActive'
              };
            }
            return user;
          });
        } else {
          this.failedToast(res);
        }
      },
      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg
          ? this.apiService.RefreshToken()
          : this.failedToast(err.error);
      }
    );
  }

  //   status(user_id: number, url: string) {
  //   const params: any = {
  //     user_id: this.user_id?.toString(),
  //     login_user_id: 0
  //   };
  //   this.apiService.post(url, params).subscribe(
  //     (res: any) => {
  //       res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.gridLoad()) : this.failedToast(res);
  //     },
  //     (err: any) => {
  //       err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
  //     }
  //   );
  // }

  StatusConfirm(user_id: number, actionObject: { key: string; label: string }) {
    const { active_status } = this.conditionConstants;
    const isActivating = actionObject.key === active_status.key;
    const iconColor = isActivating ? '#4CAF50' : '#d32f2f';
    const message = `Are you sure you want to proceed?`;

    this.confirmationService.confirm({
      header: '',
      message: `
      <div class="custom-confirm-content">
        <i class="fa-solid fa-triangle-exclamation warning-icon" style="color: ${iconColor};"></i>
        <div class="warning">Warning</div>
        <div class="message-text">${message}</div>
      </div>
    `,
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url = isActivating ? this.urlConstant.activateUsers : this.urlConstant.deactivateUsers;
        this.status(user_id, url);
      },
      reject: () => { }
    });
  }

  onAddUser() {
    this.submitted = true;
    console.log(this.addUsersForm);
    if (this.addUsersForm.invalid) {
      this.addUsersForm.markAllAsTouched();
      return;
    }


    const params: UpdateUser | CreateUser = {
      client_id: String(this.client_id),
      user_id: String(this.user_id),
      user_name: this.addUsersForm.value.user_name,
      u_password: this.isEditMode ? undefined : this.addUsersForm.value.u_password,
      email: this.addUsersForm.value.email,
      user_type: this.addUsersForm.value.user_type,
      ref_id: String(this.addUsersForm.value.client_id),

      role_id: String(this.addUsersForm.value.role_id),
      action_flag: this.isEditMode ? this.Actionflag.Update : this.Actionflag.Create,

    };


    if (this.addUsersForm.value.login_user_id) {
      params.login_user_id = String(this.addUsersForm.value.login_user_id),

        this.apiService.post(this.urlConstant.updateUsers, params).subscribe((res) => {
          res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
        }, (err: any) => {
          err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
        });
    } else {
      this.apiService.post(this.urlConstant.createUsers, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    }
  }

  EditUser(user: any) {
    this.isEditMode = true;
    this.ShowForm = true;

    if (user != null) {
      this.addUsersForm.patchValue({

        client_id: user.client_id,
        user_name: user.user_name,
        email: user.email,
        role_id: user.role_id,
        ref_id: user.ref_id ?? 0,
        user_type: user.user_type,
        login_user_id: user.user_id
      });
      this.addUsersForm.get('u_password')?.clearValidators();
      this.addUsersForm.get('confirm_password')?.clearValidators();
      this.addUsersForm.get('u_password')?.updateValueAndValidity();
      this.addUsersForm.get('confirm_password')?.updateValueAndValidity();
    }
    console.log(this.addUsersForm)

  }

  matchPasswords(passwordField: string, confirmPasswordField: string) {
    return (formGroup: FormGroup) => {
      const password = formGroup.get(passwordField);
      const confirmPassword = formGroup.get(confirmPasswordField);

      if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
          confirmPassword.setErrors({ mismatch: true });
        } else {
          confirmPassword.setErrors(null);
        }
      }
    };
  }


  cancelForm() {
    this.ShowForm = false;
    // this.isEditMode = false;
  }

  resetForm() {
    this.addUsersForm.reset();
    this.submitted = false;
    this.showClientDropdown = false;
    this.showRolesDropdown = false;
    this.showAssociationsDropdown = false;
    this.showOfficialDropdown = false;
  }

  filterGlobal() {
    if (this.searchkeyword.length >= 3 || this.searchkeyword.length === 0) {

      this.dt()?.filterGlobal(this.searchkeyword, 'contains');
      this.first = 1;
      this.gridLoad();
    }
  }

  clear() {
    this.searchkeyword = '';
    this.first = 0;
    this.dt().clear();
    this.gridLoad();
  }

  Clientdropdown() {
    const params: any = {
      user_id: this.user_id?.toString()
    };
    this.apiService.post(this.urlConstant.groundUserClient, params).subscribe((res) => {
      this.clientData = res.data ?? [];
      this.client_id = this.clientData[0].client_id;
      this.isClientShow = this.clientData.length > 1 ? true : false;
      this.gridLoad();
    }, (err) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });
  }

  addCallBack(res: any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
    this.first = 0;
    this.gridLoad();
    this.UserDropdowns();
  }

  UserDropdowns() {
    const params = { user_id: this.user_id?.toString() };

    this.apiService.post(this.urlConstant.getUserDropdown, params).subscribe({
      next: (res: any) => {
        if (res.status_code === this.statusConstants.success && res.status) {
          this.userTypesDropdown = res.data.user_types.map((item: any) => ({
            label: item.user_type,
            value: item.user_type
          }));
          this.rolesDropdown = res.data.roles
        } else {
          this.failedToast(res);
        }
      },
      error: (err) => {
        err.status_code === this.statusConstants.refresh &&
          err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      }
    });
  }

  // User Types Dropdown Change

  onUserTypeChange(userType: string | null) {
    this.showRolesDropdown = true;
    this.showClientDropdown = false;

    if (!userType) {
      return;
    }
    if (userType === 'Client') {
      this.showRolesDropdown = true;
      this.showClientDropdown = true;
      this.showAssociationsDropdown = false;
      this.showOfficialDropdown = false;
    } else if (userType === 'Association') {
      this.showClientDropdown = true;
      this.showAssociationsDropdown = true;
      this.showRolesDropdown = true;
      this.showOfficialDropdown = false;
    } else if (userType === 'Official') {
      this.showRolesDropdown = true;
      this.showClientDropdown = true;
      this.showAssociationsDropdown = true;
      this.showOfficialDropdown = true;
    }


    if (userType === 'Association') {
      this.spinnerService.raiseDataEmitterEvent('on');
      const params = {
        user_id: this.user_id?.toString(),
        client_id: this.client_id?.toString(),
        user_type: 'player'
      };

      this.apiService.post(this.urlConstant.getUserListCreation, params).subscribe({
        next: (res: any) => {
          this.spinnerService.raiseDataEmitterEvent('off');
          if (res.status_code === '200' && res.status !== false) {
            this.associationDropdown = res.data.user_details.map((item: any) => ({
              asslabel: item.user_name,
              assvalue: item.user_id
            }));
          } else {
            this.failedToast(res);
          }
        },
        error: (err: any) => {
          this.spinnerService.raiseDataEmitterEvent('off');
          if (
            err.status_code === this.statusConstants.refresh &&
            err.error?.message === this.statusConstants.refresh_msg
          ) {
            this.apiService.RefreshToken();
          } else {
            this.failedToast(err.error);
          }
        }
      });
    }

    if (userType === 'Official') {
      this.spinnerService.raiseDataEmitterEvent('on');
      const params = {
        user_id: this.user_id?.toString(),
        client_id: this.client_id?.toString(),
        user_type: 'official'
      };

      this.apiService.post(this.urlConstant.getUserListCreation, params).subscribe({
        next: (res: any) => {
          this.spinnerService.raiseDataEmitterEvent('off');
          if (res.status_code === '200' && res.status !== false) {
            this.OfficialDropdown = res.data.user_details.map((item: any) => ({
              label: item.user_name,
              value: item.user_id
            }));
          } else {
            this.failedToast(res);
          }
        },
        error: (err: any) => {
          this.spinnerService.raiseDataEmitterEvent('off');
          if (
            err.status_code === this.statusConstants.refresh &&
            err.error?.message === this.statusConstants.refresh_msg
          ) {
            this.apiService.RefreshToken();
          } else {
            this.failedToast(err.error);
          }
        }
      });
    }
  }

  get visibleRecords(): number {
    return this.usersData?.length || 0;
  }
}