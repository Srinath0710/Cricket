import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { URLCONSTANT } from '../../services/url-constant';
import { TagModule } from 'primeng/tag';
import { UpdateGround, EditGround, Grounds } from './grounds.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { Drawer } from 'primeng/drawer';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../../environments/environment';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { UploadImgService } from '../../Profile_Img_service/upload-img.service';
import { SpinnerService } from '../../services/Spinner/spinner.service';
import { ToastService } from '../../services/toast.service';
interface Country {
  country_id: number;
  country_name: string;
}

@Component({
  selector: 'app-grounds',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    FormsModule,
    FileUploadModule,
    InputTextModule,
    Drawer,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
    PaginatorModule,
    TooltipModule,
    ImageCropperComponent
  ],
  templateUrl: './grounds.component.html',
  styleUrls: ['./grounds.component.css'],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService },
    { provide: ToastService },
  ],
})
export class GroundsComponent implements OnInit {

  showPopup: boolean = true;

  @ViewChild('dt') dt!: Table;

  public addGroundForm!: FormGroup<any>;
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = 0;
  public ShowForm: any = false;
  isEditMode: boolean = false;
  ViewMode: boolean = false;
  clientData: any[] = [];
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
  country_id: any;
  uploadedImageFile: File | null = null;
  croppedImageResult: string | null = null;
  imagePreviewUrl: string | null = null;
  imageForCropper: string | null = null;

  profileImages: any;
  url: any;
  envImagePath = environment.imagePath;
  default_img = CricketKeyConstant.default_image_url.grounds;
  Actionflag = CricketKeyConstant.action_flag;
  countriesList: Country[] = [];
  citiesList = [];
  statesList = [];

  viewDialogVisible: boolean = false;
  selectedGround: any = [];
  ClientID: any = [];
  groundsData: any;
  configDataList: any;
  previewUrl: string | ArrayBuffer | null = null;
  uploadedImage: string | ArrayBuffer | null = null;
  decimalPattern = /^\d*\.?\d+$/;
  decimalnoPattern = /^\d+$/; // Only digits
  GroundsNamePattern = /^[^'"]+$/; //allstringonly allow value
  isClientShow: boolean = false;

  conditionConstants = CricketKeyConstant.condition_key;
  statusConstants = CricketKeyConstant.status_code;


  imageBase64: any = null;
  showCropperModal: boolean = false;
  imageCropAlter: any;
  imageDefault: any;
  croppedImage: any = null;
  originalFile: File | null = null;
  croppedFile: File | null = null;
  // croppedImageBlob: Blob | null = null;

  imagePreview: string | ArrayBuffer | null = null;
  imageSizeError: string = '';
  selectedImage: File | null = null;

  constructor(private formBuilder: FormBuilder,
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
    private confirmationService: ConfirmationService,
    public cricketKeyConstant: CricketKeyConstant,
    private uploadImgService: UploadImgService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
  ) {
  }


  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');
    
    this.Clientdropdown();

    this.addGroundForm = this.formBuilder.group({
      ground_name: ['', [Validators.required]],
      display_name: ['', [Validators.required]],
      country_id: ['', [Validators.required]],
      state_id: ['', [Validators.required]],
      city_id: ['', [Validators.required]],
      address_1: [''],
      address_2: [''],
      post_code: [''],
      northern_end: [''],
      sourthern_end: [''],
      north: [null, [Validators.pattern(this.decimalPattern)]],
      south: [null, [Validators.pattern(this.decimalPattern)]],
      east: [null, [Validators.pattern(this.decimalPattern)]],
      west: [null, [Validators.pattern(this.decimalPattern)]],
      club_id: ['', [Validators.required]],
      latitude: [''],
      longitude: [''],
      capacity: [''],
      profile: [''],
      ground_photo: [''],
      ground_id: [''],
      reference_id: ['']
    });
  }


  // Allow only numbers and one decimal point
  allowDecimalOnly(event: KeyboardEvent) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    const inputChar = event.key;

    if (!allowedKeys.includes(inputChar)) {
      event.preventDefault(); // block all except digits and "."
      return;
    }

    // Prevent multiple decimals
    const inputElement = event.target as HTMLInputElement;
    if (inputChar === '.' && inputElement.value.includes('.')) {
      event.preventDefault();
    }
  }

  // Clean unwanted characters if pasted
  sanitizeDecimalInput(controlName: string, event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const cleaned = input.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'); // Only one "."
    this.addGroundForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
  }

  // Allow only digits (0-9), block dot and others
  allowNumberOnly(event: KeyboardEvent) {
    const inputChar = event.key;
    const isNumber = /^[0-9]$/.test(inputChar);
    if (!isNumber) {
      event.preventDefault(); // Block non-numeric keys (including dot)
    }
  }

  sanitizeNumberInput(controlName: string, event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const cleaned = input.replace(/[^0-9]/g, ''); // Keep only digits
    this.addGroundForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
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
    this.addGroundForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
  }

  Clientdropdown() {
    const params: any = {
      user_id: this.user_id?.toString()
    };
    this.apiService.post(this.urlConstant.groundUserClient, params).subscribe((res) => {
      this.clientData = res.data ?? [];
      this.ClientID = this.clientData[0].client_id;
      this.isClientShow = this.clientData.length > 1 ? true : false;
      this.gridload();
      this.getCountries();
      
    }, (err) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });
  }

  clubsdropdown() {
    const params: any = {
      action_flag: this.Actionflag.Dropdown,
      user_id: this.user_id.toString(),
      client_id: this.ClientID.toString()
    };

    this.apiService.post(this.urlConstant.groundclubdropdown, params).subscribe(
      (res) => {
        this.configDataList = res.data?.clubs || [];
      },
      (err: any) => {
        if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
          this.apiService.RefreshToken();
          this.failedToast(err.error);
        }
        else {
          this.configDataList = [];
          console.error("Error fetching clubs dropdown:", err);
        }
      }
    );
  }


  gridload() {
    this.spinnerService.raiseDataEmitterEvent('on');
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.ClientID?.toString(),
      page_no: this.first.toString(),
      records: this.rows.toString()
    };
    params.search_text = this.searchKeyword.toString(),

      this.apiService.post(this.urlConstant.getGroundList, params).subscribe({
        next: (res) => {
          this.groundsData = res.data?.grounds || [];
          this.totalData = this.groundsData.length != 0 ? res.data.grounds[0].total_records : 0
          this.spinnerService.raiseDataEmitterEvent('off');
          this.clubsdropdown();

        },
        error: (err) => {
          if (
            err.status_code === this.statusConstants.refresh &&
            err.error.message === this.statusConstants.refresh_msg
          ) {
            this.apiService.RefreshToken();
          } else {
            this.groundsData = [];
            this.configDataList = [];
            this.totalData = 0;
            this.spinnerService.raiseDataEmitterEvent('off');
          }
          this.groundsData.forEach((val: any) => {
            val.profile_img = `${val.profile_img}?${Math.random()}`;
          });
        },
      });


  }

  onViewGroundDetails(groundId: any) {
    const params = {
      ground_id: groundId.toString(),
      client_id: this.ClientID?.toString(),
      user_id: String(this.user_id)
    };


    this.apiService.post(this.urlConstant.viewGround, params).subscribe({
      next: (res) => {
        if (res.status && res.data) {
          this.selectedGround = res.data.grounds;
          this.selectedGround.forEach((grounds: any) => {
            grounds.profile_img = grounds.profile_img + '?' + Math.random();
          });
          this.viewDialogVisible = true;
        }
      },
      error: (err) => {
        console.error('Failed to fetch ground details', err);
      }
    });
  }


  closePopup() {
    this.showPopup = false;
  }

  openPopup() {
    this.showPopup = true;
  }


  getImageUrl(img: string) {
    return `your-image-base-path/${img}`;
  }

  calaculateFirst(): number {
    return (this.first - 1) * this.rows;
  }

  onPageChange(event: any) {
    this.first = (event.page) + 1;
    this.pageData = event.first;
    this.rows = event.rows;
    this.gridload();
  }

  showAddForm() {
    this.ShowForm = true;
    this.showCropperModal = false;

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
    this.addGroundForm.reset();
    this.submitted = false;
    this.previewUrl = null;
    this.filedata = null;
    this.profileImages = null;
    this.url = null;
    this.imageBase64 = null;

    this.imageCropAlter = null;
    this.imageDefault = null;
    this.selectedImage = null;
    this.imagePreview = null;
    this.imageSizeError = '';
  }

  successToast(data: any) {
    this.toastService.successToast({ message: data.message })
  }
  /* Failed Toast */
  failedToast(data: any) {
    this.toastService.failedToast({ message: data.message })
  }

  onAddGround() {
    this.submitted = true;
    if (this.addGroundForm.invalid) {
      this.addGroundForm.markAllAsTouched();
      return
    }
    const params: UpdateGround = {
      user_id: String(this.user_id),
      client_id: String(this.ClientID),
      ground_id: this.addGroundForm.value.ground_id != null ? String(this.addGroundForm.value.ground_id) : null,
      ground_name: this.addGroundForm.value.ground_name,
      display_name: this.addGroundForm.value.display_name,
      country_id: String(this.addGroundForm.value.country_id),
      state_id: String(this.addGroundForm.value.state_id),
      city_id: String(this.addGroundForm.value.city_id),
      address_1: this.addGroundForm.value.address_1,
      address_2: this.addGroundForm.value.address_2,
      post_code: this.addGroundForm.value.post_code,
      northern_end: this.addGroundForm.value.northern_end,
      sourthern_end: this.addGroundForm.value.sourthern_end,
      north: this.addGroundForm.value.north,
      south: this.addGroundForm.value.south,
      east: this.addGroundForm.value.east,
      west: this.addGroundForm.value.west,
      club_id: this.addGroundForm.value.club_id ? String(this.addGroundForm.value.club_id) : null,
      latitude: this.addGroundForm.value.latitude,
      longitude: this.addGroundForm.value.longitude,
      capacity: this.addGroundForm.value.capacity,
      profile: this.addGroundForm.value.profile,
      action_flag: this.isEditMode ? this.Actionflag.Update : this.Actionflag.Create,
      reference_id: this.addGroundForm.value.reference_id,
      ground_photo: this.filedata ? '' : this.profileImages

    };
    if (this.addGroundForm.value.ground_id) {
      params.action_flag = this.Actionflag.Update;
      params.ground_id = String(this.addGroundForm.value.ground_id),
        this.apiService.post(this.urlConstant.updateGround, params).subscribe((res) => {
          if (res.status_code === this.statusConstants.success && res.status) {

            if (res.data !== null && this.filedata != null) {
              this.profileImgAppend(params.ground_id);
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
      this.apiService.post(this.urlConstant.addGround, params).subscribe((res) => {
        if (res.status_code === this.statusConstants.success && res.status) {
          if (res.data !== null && this.filedata != null) {
            this.profileImgAppend(res.data.grounds[0].ground_id);
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
    this.gridload();
  }

  EditGround(ground: any) {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.ClientID?.toString();
    params.ground_id = ground.ground_id?.toString();

    this.apiService.post(this.urlConstant.editGround, params).subscribe((res) => {
      if (res.status_code == this.statusConstants.success && res.status) {
        const editRecord: EditGround = res.data.grounds[0] ?? {};

        if (editRecord != null) {
          this.addGroundForm.patchValue({
            ground_id: editRecord.ground_id,
            ground_name: editRecord.ground_name,
            display_name: editRecord.display_name,
            country_id: editRecord.country_id,
            state_id: editRecord.state_id,
            city_id: editRecord.city_id,
            address_1: editRecord.address_1,
            address_2: editRecord.address_2,
            post_code: editRecord.post_code,
            northern_end: editRecord.northern_end,
            sourthern_end: editRecord.sourthern_end,
            north: editRecord.north,
            south: editRecord.south,
            east: editRecord.east,
            west: editRecord.west,
            club_id: editRecord.club_id,
            latitude: editRecord.latitude,
            longitude: editRecord.longitude,
            capacity: editRecord.capacity,
            reference_id: editRecord.reference_id,
            profile: null,
          });
          this.showAddForm();
          this.filedata = null;
          this.profileImages = editRecord.ground_photo + '?' + Math.random();
          this.convertUrlToBase64(editRecord.ground_photo + '?' + Math.random());
        }
      } else {
        this.failedToast(res);
      }
    },
      (err: any) => {
        err.status_code === this.statusConstants.refresh &&
          err.error.message === this.statusConstants.refresh_msg
          ? this.apiService.RefreshToken()
          : this.failedToast(err.error);
      }
    );
  }
  onImageUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedImage = reader.result;
    };
    reader.readAsDataURL(file);
  }

  status(ground_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.ClientID?.toString(),
      ground_id: ground_id?.toString()
    };

    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.statusConstants.success && res.status
          ? (this.successToast(res), this.gridload())
          : this.failedToast(res);
      },
      (err: any) => {
        err.status_code === this.statusConstants.refresh &&
          err.error.message === this.statusConstants.refresh_msg
          ? this.apiService.RefreshToken()
          : this.failedToast(err.error);
      }
    );
  }

  StatusConfirm(ground_id: number, actionObject: { key: string; label: string }) {
    const { active_status } = this.conditionConstants;
    const isActivating = actionObject.key === active_status.key;
    const iconClass = isActivating ? 'icon-success' : 'icon-danger';
    const message = `Are you sure you want to proceed?`;

    this.confirmationService.confirm({
      header: '',
      message: `
      <div class="custom-confirm-content">
        <i class="fa-solid fa-triangle-exclamation warning-icon ${iconClass}"></i>
        <div class="warning">Warning</div>
        <div class="message-text">${message}</div>
      </div>
    `,
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url = isActivating ? this.urlConstant.activateGround : this.urlConstant.deactivateGround;
        this.status(ground_id, url);
      },
      reject: () => { }
    });
  }
  getCountries() {
    const params: any = {};
    params.action_flag = this.Actionflag.Country;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.countryLookups, params).subscribe((res) => {
      this.countriesList = res.data.countries != undefined ? res.data.countries : [];
      this.loading = false;
      this.country_id = this.countriesList[0]?.country_id;
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });
  }

  getCities(state_id: any) {
    const params: any = {};

    if (state_id == null || state_id == '') {
      return;
    }

    params.action_flag = this.Actionflag.City;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    params.state_id = state_id.toString();
    this.apiService.post(this.urlConstant.getcitylookups, params).subscribe((res) => {
      this.citiesList = res.data.cities != undefined ? res.data.cities : [];
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);

    });
  }

  getStates(country_id: any) {
    const params: any = {};
    if (country_id == null || country_id == '') {
      return;
    }
    params.action_flag = this.Actionflag.State;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    params.country_id = country_id.toString();
    this.apiService.post(this.urlConstant.getStatesByCountry, params).subscribe((res) => {
      this.statesList = res.data.states != undefined ? res.data.states : [];
      this.loading = false;
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);

    });
  }

  formSetValue() {
    if (this.groundsData.length > 0 && this.groundsData[0].config_id) {
      this.addGroundForm.patchValue({
        ground_format: this.groundsData[0].config_id
      });
    } else {
      console.warn('No valid data in groundsData to set form value');
    }
  }

  filterGlobal() {
    if (this.searchKeyword.length >= 3 || this.searchKeyword.length === 0) {

      this.dt?.filterGlobal(this.searchKeyword, 'contains');
      this.first = 1;
      this.gridload();
    }
  }

  clear() {
    this.searchKeyword = '';
    this.dt.clear();
    this.gridload();
  }


  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

  cropPopOpen() {
    this.showCropperModal = true;
    this.imageBase64 = this.imageDefault;
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
    this.previewUrl = null;
    this.croppedImage = null;
  }

  cancelImg(): void {
    this.showCropperModal = false;
    this.url = this.imageCropAlter;
    this.filedata = this.base64ToBinary(this.filedata);

  }

  imageLoaded() {
    console.log('Image loaded in cropper');
  }

  cropperReady() {
    console.log('Cropper ready');
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

  profileImgAppend(ground_id: any) {
    const myFormData = new FormData();
    if (this.filedata != null && this.filedata != '') {
      myFormData.append('imageFile', this.filedata);
      myFormData.append('client_id', this.ClientID);
      myFormData.append('file_id', ground_id);
      myFormData.append('upload_type', 'ground');
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

  fileEvent(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const maxSizeKB = 500;

    if (this.addGroundForm.value.ground_photo !== null && this.addGroundForm.value.ground_photo !== '') {
      this.profileImages = null;
    }

    if (file) {
      const fileSizeKB = file.size / 500;
      if (fileSizeKB > maxSizeKB) {
        this.imageSizeError = 'Max.size is 500KB';
        this.imagePreview = null;
        this.selectedImage = null;
        this.filedata = null;
        this.addGroundForm.get('ground_photo')?.reset();
        return;
      }

      this.imageSizeError = '';
      this.filedata = file;
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const result = e.target.result;
        this.url = result;
        this.imageCropAlter = result;
        this.imageDefault = result;
        this.imagePreview = result;
      };
      reader.readAsDataURL(file);
    } else {
      this.filedata = null;
      this.url = this.imageDefault;
      this.imagePreview = this.imageDefault;
      this.filedata = this.base64ToBinary(this.imageDefault);
    }
  }

  cancelCropping(): void {
    this.showCropperModal = false;
  }

  clearImage(): void {
    this.previewUrl = null;
    this.filedata = null;
    this.addGroundForm.patchValue({ ground_photo: null });
    const fileInput = document.getElementById('groundPhotoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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

}
