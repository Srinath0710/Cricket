import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../services/api.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { URLCONSTANT } from '../services/url-constant';
import { TagModule } from 'primeng/tag';
import { UpdateGround, EditGround, Grounds } from './grounds.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CricketKeyConstant } from '../services/cricket-key-constant';
import { Sidebar } from 'primeng/sidebar';

@Component({
  selector: 'app-grounds',
  standalone: true,
  imports: [CommonModule, TableModule, BadgeModule, ButtonModule,
            DialogModule, ReactiveFormsModule, DropdownModule, 
            FormsModule, FileUploadModule, InputTextModule, Sidebar,
            ConfirmDialogModule, ToastModule, TagModule, PaginatorModule],
  templateUrl: './grounds.component.html',
  styleUrls: ['./grounds.component.css'],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService}
  ],
})
export class GroundsComponent implements OnInit {
  public addGroundForm!: FormGroup<any>;
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  public ShowForm:any = false;
  isEditMode: boolean = false;
  ViewMode: boolean = false;
  groundsData: any[] = [];
  loading = false;
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  totalData: any = 0;
  filedata: any;
  searchKeyword: string = '';
  submitted: boolean = true;
  ground_id: any;

  constructor(private formBuilder: FormBuilder, 
              private apiService: ApiService,
              private urlConstant: URLCONSTANT,
              private msgService: MessageService,
              private confirmationService: ConfirmationService,
              public cricketKeyConstant: CricketKeyConstant
  ){

  }


  ngOnInit() {
    this.gridload();
    this.addGroundForm = this.formBuilder.group({
      ground_name: ['',[Validators.required]],
      display_name: ['',[Validators.required]],
      address_1: ['',[Validators.required]],
      address_2: ['',[Validators.required]],
      post_code:['',[Validators.required]],
      end_one: ['',[Validators.required]],
      end_two: ['',[Validators.required]],
      country_id: [''],
      ground_id:[''],
      state_id: [''],
      city_id: [''],
      profile: [''],
      ground_photo: ['']
    })
  }
  gridload() {
    const params: any = {
    user_id : this.user_id?.toString(),
    client_id : this.client_id?.toString(),
    page_no : this.first.toString(),
    records : this.rows.toString()
    };

    this.apiService.post(this.urlConstant.getGroundList, params).subscribe({
      next: (res) => {
        this.groundsData = res.data?.grounds || [];
        this.totalData = res.data?.totalRecords || this.groundsData.length;
      },
      error: (err) => {
        if (
          err.status === this.cricketKeyConstant.status_code.refresh &&
          err.error.message  === this.cricketKeyConstant.status_code.refresh_msg
        ) {
          this.apiService.RefreshToken();
        } else {
          this.groundsData = [];
          this.totalData = 0;
        }
      },
    });
  }

  calaculateFirst(): number{
    return (this.first - 1) * this.rows;
  }
  onPageChange(event:any) {
    this.first = (event.page) + 1;
    this.pageData = event.first;
    this.rows = event.rows;
    this.gridload();
  }

  showAddForm() {
    this.ShowForm = true;
  }
  cancelForm() {
    this.ShowForm = false;
  }

  resetForm() {
    this.addGroundForm.reset();
    this.submitted = false;
  }

  successToast(data: any) {
    this.msgService.add({ key: 'tg', severity: 'success', summary: 'Success', detail:data.message});
  }

  failedToast(data: any){
    this.msgService.add({ key: 'ts', severity: 'error', summary: 'Error', detail:data.message});
  }

  onAddGround() {
    this.submitted = true;
    if(this.addGroundForm.invalid) {
      this.addGroundForm.markAllAsTouched();
      return
    }
    const params: UpdateGround = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      ground_id: this.addGroundForm.value.ground_id,
      ground_name: this.addGroundForm.value.ground_name,
      display_name:this.addGroundForm.value.display_name,
      country_id:this.addGroundForm.value.country_id,
      state_id:this.addGroundForm.value.state_id,
      city_id:this.addGroundForm.value.city_id,
      address_1:this.addGroundForm.value.address_1,
      address_2:this.addGroundForm.value.address_2,
      post_code:this.addGroundForm.value.post_code,
      end_one:this.addGroundForm.value.end_one,
      end_two:this.addGroundForm.value.end_two
    };
    const url = this.addGroundForm.value.ground_id ? this.urlConstant.updateCountry : this.urlConstant.addCountry;

    this.apiService.post(url, params).subscribe(
      (res) => {
        res.status_code === this.cricketKeyConstant.status_code.success && res.status
        ? this.addCallBack(res) : this.failedToast(res);
      },
      (err) => {
        if(err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg) {
          this.apiService.RefreshToken();
        }else{
          this.failedToast(err);
        }
      }
    );
    }

  addCallBack(res:any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
    this.gridload();
  }

  EditGround(ground_id: number) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      ground_id: ground_id?.toString() 
    };
  
    this.apiService.post(this.urlConstant.editGround, params).subscribe(
      (res) => {
        if (res.status_code == 200) {
          const editRecord: EditGround = res.data.grounds[0] ?? {};
          if (editRecord != null) {
            this.addGroundForm.setValue({
              ground_id: editRecord.ground_id,
              ground_name: editRecord.ground_name,
              display_name: editRecord.display_name,
              country_id: editRecord.country_id,
              state_id: editRecord.state_id,
              city_id: editRecord.city_id,
              address_1: editRecord.address_1,
              address_2: editRecord.address_2,
              post_code: editRecord.post_code,
              end_one: editRecord.end_one,
              end_two: editRecord.end_two
            });
            this.showAddForm();
          }
        } else {
          this.failedToast(res);
        }
      },
      (err: any) => {
        err.status === this.cricketKeyConstant.status_code.refresh &&
        err.error.message === this.cricketKeyConstant.status_code.refresh_msg
          ? this.apiService.RefreshToken()
          : this.failedToast(err);
      }
    );
  }
  

  status(ground_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      ground_id: ground_id?.toString() 
    };
  
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.cricketKeyConstant.status_code.success && res.status
          ? (this.successToast(res), this.gridload())
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
  

  StatusConfirm(ground_id: number,actionObject:{key:string,label:string}) { 
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this.ground?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url:string= this.cricketKeyConstant.condition_key.active_status.key===actionObject.key?this.urlConstant.activateGround:this.urlConstant.deactivateGround;
        this.status(ground_id,url);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }
  }


