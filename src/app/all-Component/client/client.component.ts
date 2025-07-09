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
import { Client, EditClient, UpdateClient } from './client.model';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { UploadImgService } from '../../Profile_Img_service/upload-img.service';
import { SpinnerService } from '../../services/Spinner/spinner.service';
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
    ImageCropperComponent

  ],

  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
})
export class ClientComponent implements OnInit {
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  default_img = CricketKeyConstant.default_image_url.clientimg;
  previewUrl: string | ArrayBuffer | null = null;
  envImagePath = environment.imagePath;

  searchKeyword: string = '';
  public addClientForm!: FormGroup<any>;
  @ViewChild('dt') dt!: Table;
  public ShowForm: boolean = false;
  Clientdata: Client[] = [];
  rows: number = 10;
  totalData: number = 0;
  first: number = 1;
  pageData: number = 0;
  countriesList: Country[] = [];
  citiesList = [];
  statesList = [];
  loading = false;
  country_id: any;
  submitted: boolean = true;
  seletedclient: any = [];
  viewDialogVisible: boolean = false;
  mobileRegex = '^((\\+91-?)|0)?[0-9]{10,13}$';
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  ClientNamePattern = /^[^'"]+$/; //allstringonly allow value
  showCropperModal = false;
  imageBase64: any = null;
  length: any
  profileImages: any;
  imageCropAlter: any;
  imageDefault: any;
  filedata: any;
  src: any;
  oldPath: any;
  base64: any;
  url: any;
  croppedImage: any;
  conditionConstants = CricketKeyConstant.condition_key;
  statusConstants = CricketKeyConstant.status_code;
  actionflags = CricketKeyConstant.action_flag;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private urlConstant: URLCONSTANT, private msgService: MessageService,
    private confirmationService: ConfirmationService, private uploadImgService: UploadImgService,
    public cricketKeyConstant: CricketKeyConstant, public spinnerService: SpinnerService) {

  }

  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.getCountries();
    this.addClientForm = this.formBuilder.group({
      client_name: ['', [Validators.required]],
      client_code: ['', [Validators.required]],
      address_1: ['', [Validators.required]],
      address_2: [''],
      post_code: ['', [Validators.required]],
      email_id: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      mobile: ['', [Validators.pattern(this.mobileRegex)]],
      website: [''],
      description: [''],
      connection_id: [''],
      country_id: ['', [Validators.required]],
      state_id: ['', [Validators.required]],
      city_id: ['', [Validators.required]],
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
    const phoneNumber = inputElement.value.replace(/\D/g, '').slice(0, 10);
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
    const cleaned = input.replace(/['"]/g, '');
    this.addClientForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
  }
  gridLoad() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.Clientdata = [];
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.page_no = this.first.toString();
    params.records = this.rows.toString();
    params.search_text = this.searchKeyword.toString(),
      this.apiService.post(this.urlConstant.getclientList, params).subscribe((res) => {
        this.Clientdata = res.data ?? [];
        this.totalData = this.Clientdata.length ?? res.data[0].total_records;
        this.spinnerService.raiseDataEmitterEvent('off');
        this.Clientdata.forEach((val) => {
          val.profile_img_url = `${val.profile_img_url}?${Math.random()}`;
        });
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh &&
          err.error.message === this.statusConstants.refresh_msg ?
          this.apiService.RefreshToken() : (this.Clientdata = [],
            this.spinnerService.raiseDataEmitterEvent('off'),
            this.totalData = this.Clientdata.length);

      });
  }

  onAddClient() {
    this.submitted = true;
    if (this.addClientForm.invalid) {
      this.addClientForm.markAllAsTouched();
      return
    }
    const params: UpdateClient = {
      user_id: String(this.user_id),
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
      action_flag: this.actionflags.Create,
      header_color: '',
      tbl_header_color: '',
      tbl_header_font_color: '',
      button_color: '',
      button_font_color: '',
      connection_id: '',
      profile_img_url: this.filedata ? '' : this.profileImages

    };
 
    if (this.addClientForm.value.client_id) {
      params.action_flag = this.actionflags.Update;
      params.client_id = String(this.addClientForm.value.client_id);
      this.apiService.post(this.urlConstant.updateclient, params).subscribe((res) => {

        if (res.status_code === this.statusConstants.success && res.status) {
          if (res.data !== null && this.filedata != null) {
            console.log("1")
            this.profileImgAppend(params.client_id);
          } else {
            this.addCallBack(res)
          }
        } else {
          this.failedToast(res)
        }
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    } else {

      this.apiService.post(this.urlConstant.createclient, params).subscribe((res) => {
        if (res.status_code === this.statusConstants.success && res.status) {
          if (res.data !== null && this.filedata != null) {
            this.profileImgAppend(res.data.client_id);
          } else {
            this.addCallBack(res)
          }
        } else {
          this.failedToast(res)
        }
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    }

  }

  EditClient(client_id: number) {
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
            profile_img_url: '',
            header_color: null,
            tbl_header_color: null,
            tbl_header_font_color: null,
            button_color: null,
            button_font_color: null,
            connection_id: editRecord.connection_id ?? null
          });
          this.profileImages = editRecord.profile_img_url + '?' + Math.random();
          this.convertUrlToBase64(editRecord.profile_img_url + '?' + Math.random());
          this.filedata = null;
          this.showCropperModal = false;
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
    this.filedata = null;
    this.url = null;
    this.profileImages = null;
    this.imageCropAlter = null;
    this.imageBase64 = null;
    this.imageDefault = null;
    this.croppedImage = null;

  }
  resetForm() {
    this.addClientForm.reset();
    this.submitted = false;
    this.previewUrl = null;
    this.filedata = null;
    this.profileImages = null;
    this.url = null;
    this.imageBase64 = null;
    this.imageCropAlter = null;
    this.imageDefault = null; 
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
  StatusConfirm(client_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
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
  if (this.searchKeyword.length >= 3 || this.searchKeyword.length === 0){

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
  getCountries() {
    const params: any = {};
    params.action_flag = this.actionflags.Country;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.countryLookups, params).subscribe((res) => {
      this.countriesList = res.data.countries != undefined ? res.data.countries : [];
      this.loading = false;
      this.country_id = this.countriesList[0].country_id;
      this.gridLoad();
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh &&
        err.error?.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();

      } else {
        this.failedToast(err.error);
      }
    });
  }

  getCities(state_id: any) {
    const params: any = {};

    if (state_id == null || state_id == '') {
      return
    }

    params.action_flag = this.actionflags.City;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    params.state_id = state_id.toString();
    this.apiService.post(this.urlConstant.getcitylookups, params).subscribe((res) => {
      this.citiesList = res.data.cities != undefined ? res.data.cities : [];
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh &&
        err.error?.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();

      } else {
        this.failedToast(err.error);
      }
    });
  }

  getStates(country_id: any) {
    const params: any = {};
    if (country_id == null || country_id == '') {
      return
    }
    params.action_flag = this.actionflags.State;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    params.country_id = country_id.toString();
    this.apiService.post(this.urlConstant.getStatesByCountry, params).subscribe((res) => {
      this.statesList = res.data.states != undefined ? res.data.states : [];
      this.loading = false;
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh &&
        err.error?.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();

      }
    });
  }
  viewClient(client_id: any) {
    const params = {
      client_id: client_id.toString(),
      user_id: String(this.user_id)
    };
    this.apiService.post(this.urlConstant.viewclient, params).subscribe({
      next: (res) => {
        if (res.status && res.data) {
          this.seletedclient = res.data;
          this.seletedclient.forEach((clients: any) => {
            clients.profile_img_url = clients.profile_img_url + '?' + Math.random();
          });
          
          this.viewDialogVisible = true;
        }
      },
      error: (err) => {
        console.error('Failed to fetch Client details', err);
      }
    });
  }
  handleImageError(event: Event, fallbackUrl: string) {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

  fileEvent(event: any) {
    if (this.addClientForm.value.profile_img_url.value !== null &&
      this.addClientForm.value.profile_img_url.value !== '') {
      this.profileImages = null;
    }
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      this.filedata = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        var img = new Image;
        this.url = event.target.result;
        this.imageCropAlter = event.target.result
        this.imageDefault = event.target.result
      }
    } else {
      this.filedata = null;
      this.url = this.imageDefault
      this.filedata = this.base64ToBinary(this.imageDefault);
    }
  }

  cropPopOpen() {
    this.showCropperModal = true;
    this.imageBase64 = this.imageDefault
  }
  saveCroppedImage(): void {
    this.profileImages = this.croppedImage;
    this.imageCropAlter = this.filedata;
    this.filedata = this.base64ToBinary(this.filedata);
    this.showCropperModal = false;
  }



  cancel() {
    this.filedata = null;
    this.url = null;
    this.profileImages = null;
    this.imageCropAlter = null;
    this.imageBase64 = null;
    this.imageDefault = null;
    this.croppedImage = null;
  }

  cancelImg() {
    this.showCropperModal = false;
    this.url = this.imageCropAlter;
    this.filedata = this.base64ToBinary(this.filedata);


  }
  loadImageFailed() {
    console.error('Image loading failed');
  }

  imageCropped(event: ImageCroppedEvent) {
    const blob = event.blob;

    if (blob) {
      this.convertBlobToBase64(blob).then((base64) => {
        this.url = base64;
        this.filedata = base64;
        this.profileImages = null;
      }).catch((error) => {
        console.error('Failed to convert blob to base64:', error);
      });
    }
  }
  imageLoaded() {
    console.log('Image loaded');
  }

  cropperReady() {
    console.log('Cropper ready');
  }
  base64ToBinary(base64: string): Blob | null {
    if (!base64 || typeof base64 !== 'string' || !base64.includes(',')) {
      console.error('Invalid base64 input:', base64);
      return null;
    }

    try {
      const byteCharacters = atob(base64.split(',')[1]);
      const byteArrays = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }

      return new Blob([byteArrays], { type: 'image/jpeg' });
    } catch (error) {
      console.error('Error converting base64 to binary:', error);
      return null;
    }
  }

  convertUrlToBase64(imageUrl: string): void {
    fetch(imageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        return response.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result as string;
          this.imageBase64 = base64Image;
          this.imageCropAlter = base64Image
          this.imageDefault = base64Image
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
      });
  }
  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject('Failed to convert Blob to base64');
      };

      reader.readAsDataURL(blob);
    });
  }
  /*profile image update */

  // profileImgUpdate(upload_profile_url: string) {

  //   const params: any = {};
  //   params.action_flag = this.actionflags.Uploadprofile;
  //   params.profile_img = upload_profile_url.toString();
  //   params.user_id = this.user_id.toString();
  //   params.client_id = this.client_id.toString();

  //   this.apiService.post(this.urlConstant.profileclient, params).subscribe(
  //     (res) => {
  //       if (res.status_code == this.statusConstants.success && res.status) {
  //         // this.filedata = null;
  //         this.addCallBack(res)
  //       } else {
  //         this.failedToast(res);
  //       }
  //     },
  //     (err: any) => {
  //       if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
  //         this.apiService.RefreshToken();

  //       } else {
  //         this.failedToast(err.error);
  //       }
  //     }
  //   );
  // }
  profileImgAppend(client_id: any) {

    const myFormData = new FormData();
    if (this.filedata != null && this.filedata != '') {
      myFormData.append('imageFile', this.filedata);
      myFormData.append('client_id', client_id);
      myFormData.append('file_id', client_id);
      myFormData.append('upload_type', 'client');
      myFormData.append('user_id', this.user_id?.toString());
      this.uploadImgService.post(this.urlConstant.uploadprofile, myFormData).subscribe(
        (res) => {
          if (res.status_code == this.statusConstants.success) {
            if (res.url != null && res.url != '') {
              this.addCallBack(res)
            } else {
              this.failedToast(res);
            }
          }
        },
        (err: any) => {
          if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
            this.apiService.RefreshToken();

          } else {
            this.failedToast(err.error);
          }
        }
      );
    }
  }
}

