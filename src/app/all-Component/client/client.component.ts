import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ApiService } from '../../services/api.service';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { URLCONSTANT } from '../../services/url-constant';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Drawer } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { environment } from '../../environments/environment';
import { ImageCropperComponent } from 'ngx-image-cropper';
import type { ImageCroppedEvent } from 'ngx-image-cropper';
import { Client, EditClient, UpdateClient } from './client.model';
interface Country {
  country_id: number;
  country_name: string;
}
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
  imports: [
    PaginatorModule,
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    TooltipModule,
    FormsModule,
    ConfirmDialogModule,
    DialogModule,
    Drawer,
    ReactiveFormsModule,
    DropdownModule,
  ],

  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
})
export class ClientComponent implements OnInit{
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  default_img= CricketKeyConstant.default_image_url.officials;
  previewUrl: string | ArrayBuffer | null = null;

  searchKeyword: string = '';
  public addClientForm!: FormGroup<any>;
  @ViewChild('dt') dt!: Table;
  public ShowForm: any = false;
  Clientdata: Client[] = [];
  rows: number = 10;
  totalData: any = 0;
  first: number = 1;
  pageData: number = 0;
  countriesList: Country[] = []; 
  citiesList = [];
  statesList = [];
  loading = false;
  country_id: any;
  isEditMode: boolean = false;
  submitted: boolean = true;
  seletedclient: any = [];
  viewDialogVisible: boolean = false;
    mobileRegex = '^((\\+91-?)|0)?[0-9]{10,13}$';
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  ClientNamePattern = /^[^'"]+$/; //allstringonly allow value

  conditionConstants= CricketKeyConstant.condition_key;
  statusConstants= CricketKeyConstant.status_code;

  envImagePath = environment.imagePath;
  showCropperModal = false;
  imageBase64: any = null;
  profile_img: any
  length: any
  profileImages: any;
  imageCropAlter: any;
  imageDefault: any;
  filedata: any;
  url: any;
  src: any;
  oldPath: any;
  base64: any;
  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private urlConstant: URLCONSTANT, private msgService: MessageService,
  private confirmationService: ConfirmationService, public cricketKeyConstant: CricketKeyConstant) {

  }

  ngOnInit() {
    this.getCountries();
    this.addClientForm = this.formBuilder.group({
      client_name: ['',[Validators.required]],
      client_code: ['',[Validators.required]],
      address_1: ['',[Validators.required]],
      address_2: [''],
      post_code:['',[Validators.required]],
      email_id: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      mobile: ['', [Validators.required, Validators.pattern(this.mobileRegex)]],
      website: [''],
      description: [''],
      connection_id: [''],
      country_id: ['',[Validators.required]],
      state_id: ['',[Validators.required]],
      city_id: ['',[Validators.required]],
      profile_img_url: this.filedata,
      client_id: [''],
      header_color: [''],
      tbl_header_color: [''],
      tbl_header_font_color: [''],
      button_color: [''],
      button_font_color: [''],
    })
  }

    //mobileno enter the only number alowed
  onPhoneNumberInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const phoneNumber = inputElement.value.replace(/\D/g, '').slice(0, 10); // Allow only digits, max 10
    this.addClientForm.get('mobile')?.setValue(phoneNumber, { emitEvent: false });
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
  this.addClientForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
}
  gridLoad() {
    this.Clientdata = [];
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.page_no = this.first.toString();
    params.records = this.rows.toString();
    params.search_text = this.searchKeyword.toString(),
    this.apiService.post(this.urlConstant.getclientList, params).subscribe((res) => {
      this.Clientdata = res.data?? [];
        // this.totalData = this.Clientdata.length != 0 ? res.data[0].total_records : 0
      this.totalData = this.Clientdata.length ?? res.data[0].total_records ;
      this.Clientdata.forEach((val: any) => {
        val.country_image = `${val.country_image}?${Math.random()}`;
      });
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.Clientdata = [], this.totalData = this.Clientdata.length);

    });

  }
  onAddClient() {
    this.isEditMode = false;
    this.submitted = true;
    if (this.addClientForm.invalid) {
      this.addClientForm.markAllAsTouched();
      return
    }
    const params: UpdateClient = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      client_name: this.addClientForm.value.client_name,
      address_1: this.addClientForm.value.address_1,
      address_2: this.addClientForm.value.address_2,
      post_code: this.addClientForm.value.post_code,
      email_id: this.addClientForm.value.email_id,
      mobile: this.addClientForm.value.mobile,
      website: this.addClientForm.value.website,
      description: this.addClientForm.value.description,
      client_code: this.addClientForm.value.client_code,
      state_id: String(this.addClientForm.value.state_id),
      country_id: String(this.addClientForm.value.country_id),
      city_id: String(this.addClientForm.value.city_id),

      action_flag: 'create',
      header_color: '',
      tbl_header_color: '',
      tbl_header_font_color: '',
      button_color: '',
      button_font_color: '',
      connection_id:'',
      profile_img_url:this.addClientForm.value.profile_img_url

    };

    if (this.addClientForm.value.client_id) {

      params.action_flag = 'update';
      params.client_id = String(this.addClientForm.value.client_id);
      this.apiService.post(this.urlConstant.updateclient, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    } else {

      this.apiService.post(this.urlConstant.createclient, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    }

  }
  
  EditClient(client_id: number) {
    this.isEditMode = true;
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = client_id?.toString();
    this.apiService.post(this.urlConstant.editclient, params).subscribe((res) => {
      if (res.status_code == this.statusConstants.success && res.status) {
        const editRecord: EditClient = res.data[0] ?? {};
        if (editRecord != null) {
          this.addClientForm.setValue({
            client_id: editRecord.client_id,
            client_name: editRecord.client_name,
            client_code: editRecord.client_code,
            country_id: editRecord.country_id,
            address_1: editRecord.address_1,
            address_2: editRecord.address_2,
            state_id: editRecord.state_id,
            city_id: editRecord.city_id,
            post_code: editRecord.post_code,
            email_id: editRecord.email_id,
            mobile: editRecord.mobile,
            website: editRecord.website,
            description: editRecord.description,
            profile_img_url: editRecord.profile_img_url,
            header_color: null,
            tbl_header_color: null,
            tbl_header_font_color: null,
            button_color: null,
            button_font_color: null,
            connection_id: editRecord.connection_id ?? null 
          });
          
          this.showAddForm();
        }
      } else {
        this.failedToast(res);
      }
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });


  }
  showAddForm() {
    this.ShowForm = true;
  }
  cancelForm() {
    this.ShowForm = false;
  }
   resetForm() {
    this.addClientForm.reset();
    this.submitted = false;
  }
  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

  }

  /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }
  addCallBack(res: any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
    this.gridLoad();
  }
  onPageChange(event: any) {
    this.first = (event.page) + 1;
    this.pageData = event.first;
    this.rows = event.rows;
    this.gridLoad();
  }
  status(client_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: client_id?.toString(),
    };
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.gridLoad()) : this.failedToast(res);
      },
      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      }
    );
  }
  StatusConfirm(client_id: number, actionObject: { key: string, label: string },currentStatus:string) {
    const AlreadyStatestatus =
    (actionObject.key === this.conditionConstants.active_status.key && currentStatus === 'Active') ||
    (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === 'InActive');

  if (AlreadyStatestatus) {
    return; 
  }
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this Client?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.conditionConstants.active_status.key === actionObject.key ? this.urlConstant.activeClient : this.urlConstant.deactiveClient;
        this.status(client_id, url);
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
  getCountries() {
    const params: any = {};
    params.action_flag = 'get_countries';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.countryLookups, params).subscribe((res) => {
        this.countriesList = res.data.countries != undefined ? res.data.countries : [];
        this.loading = false;
        this.country_id = this.countriesList[0].country_id;
        this.gridLoad();
    }, (err: any) => {
        if ( err.status_code === this.statusConstants.refresh &&
          err.error?.message === this.statusConstants.refresh_msg) {
            this.apiService.RefreshToken();
           
        } else {
            this.failedToast(err.error);
        }
    });
}

getCities(state_id:any) {
    const params: any = {};

    if (state_id == null || state_id == '') {
        return
    }

    params.action_flag = 'get_city_by_state';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    params.state_id = state_id.toString();
    this.apiService.post(this.urlConstant.getcitylookups, params).subscribe((res) => {
        this.citiesList = res.data.cities != undefined ? res.data.cities : [];
    }, (err: any) => {
        if ( err.status_code === this.statusConstants.refresh &&
          err.error?.message === this.statusConstants.refresh_msg) {
            this.apiService.RefreshToken();
           
        } else {
            this.failedToast(err.error);
        }
    });
}

getStates(country_id:any) {
    const params: any = {};
    if (country_id == null || country_id == '') {
        return
    }
    params.action_flag = 'get_state_by_country';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    params.country_id = country_id.toString();
    this.apiService.post(this.urlConstant.getStatesByCountry, params).subscribe((res) => {
        this.statesList = res.data.states != undefined ? res.data.states : [];
        this.loading = false;
    }, (err: any) => {
        if ( err.status_code === this.statusConstants.refresh &&
          err.error?.message === this.statusConstants.refresh_msg) {
            this.apiService.RefreshToken();
            
        }
    });
}
viewClient(client_id: any) {
  const params = { 
    client_id: client_id.toString() ,
    user_id: String(this.user_id )
  };
  this.apiService.post(this.urlConstant.viewclient, params).subscribe({
    next: (res) => {
      if (res.status && res.data) {
        this.seletedclient = res.data; 
        this.viewDialogVisible = true;
      }
    },
    error: (err) => {
      console.error('Failed to fetch Client details', err);
    }
  });
}
handleImageError(event: Event, fallbackUrl: string): void {
  const target = event.target as HTMLImageElement;
  target.src = fallbackUrl;
}

/* profile image File onchange event */
fileEvent(event: any) {
      // Reset preview if new file
      if (this.addClientForm.get('profile_img_url')?.value) {
        this.profileImages = null;
      }
    
      if (event?.target?.files?.length > 0) {
        this.filedata = event.target.files[0];
    
        const reader = new FileReader();
        reader.readAsDataURL(this.filedata);
        reader.onload = (e: any) => {
          this.url = e.target.result;
          this.imageCropAlter = e.target.result;
          this.imageDefault = e.target.result;
    
          this.addClientForm.patchValue({
            profile_img_url: this.filedata
          });
        };
      } else {
        this.url = this.imageDefault;
        this.filedata = this.base64ToBinary(this.imageDefault);
      }
    }
    

cropPopOpen(){
  this.showCropperModal=true;
  this.imageBase64=this.imageDefault
}
saveCroppedImage(): void {
  this.profileImages = this.filedata;
  this.imageCropAlter = this.filedata;
  this.filedata=this.base64ToBinary(this.filedata);
  this.showCropperModal = false;

}
cancelImg(): void {
  this.showCropperModal = false;
  this.url=this.imageCropAlter;
  this.filedata=this.base64ToBinary(this.imageCropAlter);
}
base64ToBinary(base64:any){
  // Convert base64 to binary (Blob)
  const byteCharacters = atob(base64.split(',')[1]); // Decode base64 string
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset++) {
      byteArrays.push(byteCharacters.charCodeAt(offset));
  }

  const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' }); 
  return blob;
}
convertUrlToBase64(imageUrl: string): void {
  fetch(imageUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      return response.blob(); // Convert response to a Blob
    })
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string; 
        this.imageBase64 = base64Image; 
        this.imageCropAlter=base64Image
        this.imageDefault=base64Image
      };
      reader.readAsDataURL(blob); 
    })
    .catch((error) => {
    });
}
cancel() {
  this.filedata = null;
  this.url = null;
  this.profileImages = null;
  this.imageCropAlter=null;
  this.imageBase64 = null;
}
imageCropped(event: ImageCroppedEvent): void {
  this.url = event.base64
  this.filedata = event.base64
   this.profileImages=null
}
loadImageFailed(): void {
  console.error('Image loading failed');
}
}
