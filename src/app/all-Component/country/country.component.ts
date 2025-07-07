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
import { ApiService } from '../../services/api.service';
import { URLCONSTANT } from '../../services/url-constant';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Country, EditCountry, UpdateCountry } from './country.model';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { UploadImgService } from '../../Profile_Img_service/upload-img.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { SpinnerService } from '../../services/Spinner/spinner.service';
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
    PaginatorModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    DrawerModule,
    ImageCropperComponent

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
  CountryNamePattern = /^[^'"]+$/;
  conditionConstants = CricketKeyConstant.condition_key;
  statusConstants = CricketKeyConstant.status_code;
  Actionflag = CricketKeyConstant.action_flag;
  default_img = CricketKeyConstant.default_image_url.countryimg;
  profileImages: any;
  imageCropAlter: any;
  imageDefault: any;
  url: any;
  src: any;
  imageBase64: any = null;
  uploadedImage: string | ArrayBuffer | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  croppedImage: any;
  showCropperModal: boolean = false;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private urlConstant: URLCONSTANT, private msgService: MessageService,
    private confirmationService: ConfirmationService,
    public cricketKeyConstant: CricketKeyConstant, private uploadImgService: UploadImgService,
    public spinnerService: SpinnerService
  ) {

  }
  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');

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
    const params: any = {
      action_flag: this.Actionflag.Dropdown,
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
    };
    this.apiService.post(this.urlConstant.getCountryDropdown, params).subscribe((res) => {
      this.timezoneData = res.data.timezone ?? [];
      this.regionsData = res.data.region ?? [];

    },
      (err: any) => {
        if (
          err.status_code === this.statusConstants.refresh &&
          err.error?.message === this.statusConstants.refresh_msg
        ) {
          this.apiService.RefreshToken();
        } else {
          this.spinnerService.raiseDataEmitterEvent('off');
          this.failedToast(err.error);
        }
      }
    );
  }
  gridLoad() {

    setTimeout(() => {
      this.spinnerService.raiseDataEmitterEvent('on');
    }, 30);
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
        this.spinnerService.raiseDataEmitterEvent('off');
        this.countriesData.forEach((val: any) => {
          val.country_image = `${val.country_image}?${Math.random()}`;
        });
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message
          === this.statusConstants.refresh_msg ? this.apiService.RefreshToken()
          : (this.spinnerService.raiseDataEmitterEvent('off'),
            this.countriesData = [], this.totalData = this.countriesData.length);

      });

  }

  blockQuotesOnly(event: KeyboardEvent) {
    if (event.key === '"' || event.key === "'") {
      event.preventDefault();
    }
  }


  sanitizeQuotesOnly(controlName: string, event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const cleaned = input.replace(/['"]/g, '');
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
    this.filedata = null;
    this.url = null;
    this.profileImages = null;
    this.imageCropAlter = null;
    this.imageBase64 = null;
    this.imageDefault = null;
    this.croppedImage = null;
  }

  resetForm() {
    this.addCountryForm.reset();
    this.submitted = false;
    this.previewUrl = null;
    this.filedata = null;
    this.profileImages = null;
    this.url = null;
    this.imageBase64 = null;
    this.imageCropAlter = null;
    this.imageDefault = null;
  }
  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }
  fileEvent(event: any) {
    if (this.addCountryForm.value.country_image !== null &&
      this.addCountryForm.value.country_image !== '') {
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
  profileImgAppend(country_id: any) {
    const myFormData = new FormData();
    if (this.filedata != null && this.filedata != '') {
      myFormData.append('imageFile', this.filedata);
      myFormData.append('client_id', this.client_id.toString());
      myFormData.append('file_id', country_id);
      myFormData.append('upload_type', 'country');
      myFormData.append('user_id', this.user_id?.toString());
      this.uploadImgService.post(this.urlConstant.uploadprofile, myFormData).subscribe(
        (res) => {
          if (res.status_code == this.statusConstants.success) {
            if (res.url != null && res.url != '') {
              this.addCallBack(res)
            } else {
              this.failedToast(res);
            }
          } else {
            this.failedToast(res);
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

  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

  }

  /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }
  onAddCountry() {
    this.submitted = true;
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
      action_flag: this.Actionflag.Create,
      capital: '',
      phonecode: '0',
      country_image: this.filedata ? '' : this.profileImages
    };
    if (this.addCountryForm.value.country_id) {
      params.action_flag = this.Actionflag.Update;
      params.country_id = String(this.addCountryForm.value.country_id),
        this.apiService.post(this.urlConstant.updateCountry, params).subscribe((res) => {
          if (res.status_code === this.statusConstants.success && res.status) {

            if (res.data !== null && this.filedata != null) {
              this.profileImgAppend(params.country_id);
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
      this.apiService.post(this.urlConstant.addCountry, params).subscribe((res) => {
        if (res.status_code === this.statusConstants.success && res.status) {
          if (res.data !== null && this.filedata != null) {
            this.profileImgAppend(res.data.countries[0].country_id);
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
  addCallBack(res: any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
    this.gridLoad();
  }
  EditCountry(country_id: number) {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.country_id = country_id?.toString();
    this.apiService.post(this.urlConstant.editCountry, params).subscribe((res) => {
      if (res.status_code == this.statusConstants.success && res.status) {
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
          this.filedata = null;
          this.profileImages = editRecord.country_image + '?' + Math.random();
          this.convertUrlToBase64(editRecord.country_image + '?' + Math.random());
        }
      }
    });

  }
  onImageUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedImage = reader.result;
    };
    reader.readAsDataURL(file);
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
    this.imageBase64 = null;
    this.profileImages = null;
    this.imageCropAlter = null;
    this.imageDefault = null;
    this.croppedImage = null;
  }
  cancelImg(): void {
    this.showCropperModal = false;
    this.url = this.imageCropAlter;
    this.filedata = this.base64ToBinary(this.filedata);
  }
  loadImageFailed() {
    console.error('Image loading failed');
  }
  imageCropped(event: ImageCroppedEvent) {
    console.log("hi this ")
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
  imageLoaded() {
    console.log('Image loaded');
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  cropPopOpen() {
    this.showCropperModal = true;
    this.imageBase64 = this.imageDefault;
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
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      }
    );
  }

  StatusConfirm(country_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
    const AlreadyStatestatus =
      (actionObject.key === this.conditionConstants.active_status.key && currentStatus === this.conditionConstants.active_status.status) ||
      (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === this.conditionConstants.deactive_status.status);

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
