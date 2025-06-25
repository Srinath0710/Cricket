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

interface Country {
  country_id: number;
  country_name: string;
}

@Component({
  selector: 'app-grounds',
  standalone: true,
  imports: [CommonModule, TableModule, BadgeModule, ButtonModule,
    DialogModule, ReactiveFormsModule, DropdownModule,
    FormsModule, FileUploadModule, InputTextModule, Drawer,
    ConfirmDialogModule, ToastModule, TagModule, PaginatorModule, TooltipModule, ImageCropperComponent],
  templateUrl: './grounds.component.html',
  styleUrls: ['./grounds.component.css'],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
})
export class GroundsComponent implements OnInit {

  showPopup: boolean = true;

  @ViewChild('dt') dt!: Table;

  public addGroundForm!: FormGroup<any>;
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
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
  filedata: File | Blob | null = null; 
  searchKeyword: string = '';
  submitted: boolean = true;
  ground_id: any;
  country_id: any;

  profileImages: any;
  url: string | ArrayBuffer | null = null;
  envImagePath = environment.imagePath;
  default_img = CricketKeyConstant.default_image_url.grounds;
  default_image_url = 'assets/images/ground-logo.png';
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

  croppedImageBlob: Blob | null = null;
  imageBase64: any = null;
  showCropperModal: boolean = false;
  imageCropAlter: any;
  imageDefault: any;
  croppedImage: string = '';

  constructor(private formBuilder: FormBuilder,
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
    private confirmationService: ConfirmationService,
    public cricketKeyConstant: CricketKeyConstant,
    private uploadImgService: UploadImgService) {
  }


  ngOnInit() {
    this.getCountries();
    this.Clientdropdown();

    this.addGroundForm = this.formBuilder.group({
      ground_name: ['', [Validators.required]],
      display_name: ['', [Validators.required]],
      country_id: ['', [Validators.required]],
      state_id: ['', [Validators.required]],
      city_id: ['', [Validators.required]],
      address_1: [''],
      address_2: [''],
      post_code: ['', [Validators.required]],
      northern_end: ['', [Validators.required]],
      sourthern_end: ['', [Validators.required]],
      north: ['', [Validators.required, Validators.pattern(this.decimalPattern)]],
      south: ['', [Validators.required, Validators.pattern(this.decimalPattern)]],
      east: ['', [Validators.required, Validators.pattern(this.decimalPattern)]],
      west: ['', [Validators.required, Validators.pattern(this.decimalPattern)]],
      club_id: ['', []],
      latitude: ['', []],
      longitude: ['', []],
      capacity: [''],
      profile: ['', []], // This is the form control for the image (URL or data)
      ground_photo: ['', []], // This seems redundant if 'profile' is the main image field
      ground_id: ['', []],
      reference_id: ['', [Validators.required]]
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
    }, (err) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });
  }

  clubsdropdown() {
    const params: any = {
      action_flag: 'dropdown',
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
          }
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
  }

  cancelForm() {
    this.ShowForm = false;
  }

  resetForm() {
    this.addGroundForm.reset();
    this.submitted = false;
    this.previewUrl = null;
    this.filedata = null;
    this.profileImages = null;
    this.url = null;
    this.imageBase64 = null;
    this.croppedImageBlob = null;
    this.croppedImage = '';
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

  onAddGround() {
    this.submitted = true;
    this.isEditMode = false;
    if (this.addGroundForm.invalid) {

      this.addGroundForm.markAllAsTouched();
      return;
    }

    const isEdit = !!this.addGroundForm.value.ground_id;

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
      club_id: String(this.addGroundForm.value.club_id),
      latitude: this.addGroundForm.value.latitude,
      longitude: this.addGroundForm.value.longitude,
      capacity: String(this.addGroundForm.value.capacity),
      profile: this.addGroundForm.value.profile,
      action_flag: isEdit ? 'update' : 'create',
      ground_photo: this.addGroundForm.value.ground_photo,
      reference_id: this.addGroundForm.value.reference_id,
    };

    const apiUrl = isEdit ? this.urlConstant.updateGround : this.urlConstant.addGround;

    this.apiService.post(apiUrl, params).subscribe(
      (res) => {
        if (res.status_code === this.statusConstants.success && res.status) {
          const groundId = isEdit ? params.ground_id : res.data?.grounds?.[0]?.ground_id;
          if (this.filedata instanceof Blob && groundId) {
            this.profileImgAppend(groundId, res);
          } else {
            this.addCallBack(res);
          }
        } else {
          this.failedToast(res);
        }
      },
      (err: any) => {
        if (err.status_code === this.statusConstants.refresh &&
            err.error.message === this.statusConstants.refresh_msg) {
          this.apiService.RefreshToken();
        } else {
          this.failedToast(err.error);
        }
      }
    );
  }

  addCallBack(res: any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
    this.gridload();
  }

  EditGround(ground: any) {
    this.isEditMode = true;
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.ClientID?.toString();
    params.ground_id = ground.ground_id?.toString();

    this.apiService.post(this.urlConstant.editGround, params).subscribe((res) => {
      if (res.status_code == this.statusConstants.success && res.status) {
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
            ground_photo: editRecord.ground_photo
          });
          if (editRecord.ground_photo) {
            this.previewUrl = this.envImagePath + editRecord.ground_photo;
            this.url = this.previewUrl;
            this.imageBase64 = this.previewUrl;
          }

          this.showAddForm();
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

  onProfileImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.filedata = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;

      };
      reader.readAsDataURL(file);

    }


  }

  status(ground_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
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


  StatusConfirm(ground_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
    const AlreadyStatestatus =
      (actionObject.key === this.conditionConstants.active_status.key && currentStatus === this.conditionConstants.active_status.status) ||
      (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === this.conditionConstants.deactive_status.status);

    if (AlreadyStatestatus) {
      return;
    }
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this ground?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.conditionConstants.active_status.key === actionObject.key ? this.urlConstant.activateGround : this.urlConstant.deactivateGround;
        this.status(ground_id, url);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  getCountries() {
    const params: any = {};
    params.action_flag = 'get_countries';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.countryLookups, params).subscribe((res) => {
      this.countriesList = res.data.countries != undefined ? res.data.countries : [];
      this.loading = false;
      this.country_id = this.countriesList[0]?.country_id; // Added optional chaining
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });
  }

  getCities(state_id: any) {
    const params: any = {};

    if (state_id == null || state_id == '') {
      return;
    }

    params.action_flag = 'get_city_by_state';
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
    params.action_flag = 'get_state_by_country';
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
        team_format: this.groundsData[0].config_id
      });
    } else {
      console.warn('No valid data in groundsData to set form value');
    }
  }

  filterGlobal() {
    this.dt?.filterGlobal(this.searchKeyword, 'contains');
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

  cropPopOpen(): void {
    if (this.url || this.profileImages) {
      this.imageBase64 = (this.url || this.profileImages) as string;
      this.showCropperModal = true;
    } else {
      this.failedToast({ message: 'No image selected to crop.' });
    }
  }

  saveCroppedImage(): void {
    this.profileImages = this.croppedImage; 
    this.previewUrl = this.croppedImage; 
    this.filedata = this.croppedImageBlob; 
    
    this.showCropperModal = false;
  }

  cancel(): void {
    this.filedata = null;
    this.url = null;
    this.profileImages = null;
    this.previewUrl = null;
    this.croppedImageBlob = null;
    this.croppedImage = ''; 
    this.addGroundForm.get('profile')?.setValue(null); 
  }

  cancelImg(): void {
    this.showCropperModal = false;
    this.croppedImage = '';
    this.imageBase64 = '';
  }

  imageLoaded() {
    console.log('Image loaded in cropper');
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  loadImageFailed() {
    console.error('Image loading failed in cropper');
    this.failedToast({ message: 'Failed to load image into cropper. Please try another image.' });
    this.cancelImg();
  }

  fileEvent(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!allowedTypes.includes(file.type)) {
        this.addGroundForm.get('profile')?.setErrors({ 'invalidFileType': true });
        this.filedata = null;
        this.url = null;
        this.imageBase64 = null;
        this.failedToast({ message: 'Invalid file type. Only JPEG, PNG, JPG are allowed.' });
        return;
      } else {
        this.addGroundForm.get('profile')?.setErrors(null);
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.url = e.target.result;
        this.imageBase64 = e.target.result;
        this.showCropperModal = true;
      };
      reader.readAsDataURL(file);
    } else {
      this.url = null;
      this.filedata = null;
      this.profileImages = null;
      this.imageBase64 = null;
      this.croppedImageBlob = null;
      this.croppedImage = '';
      this.previewUrl = null;
      this.addGroundForm.get('profile')?.setValue(null);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64 as string; 
    this.croppedImageBlob = event.blob || null; 
  }

  profileImgUpdate(upload_profile_url: any, ground_id: any, baseRes: any) {
    const params: any = {
      action_flag: 'update_profile_url',
      profile_img: upload_profile_url.toString(),
      user_id: this.user_id.toString(),
      ground_id: ground_id.toString(),
      client_id: this.client_id.toString()
    };

    this.apiService.post(this.urlConstant.profileGround, params).subscribe(
      (res) => {
        if (res.status_code == this.statusConstants.success && res.status) {
          this.addCallBack(baseRes);
        } else {
          this.failedToast(res);
          this.addCallBack(baseRes);
        }
      },
      (err) => {
        this.failedToast(err.error);
        this.addCallBack(baseRes);
      }
    );
  }

  profileImgAppend(ground_id: any, baseRes: any) {
    const myFormData = new FormData();
    if (this.filedata instanceof Blob) {
      myFormData.append('imageFile', this.filedata, `ground_${ground_id}_profile.jpg`); 
      myFormData.append('client_id', this.client_id.toString());
      myFormData.append('file_id', ground_id);
      myFormData.append('upload_type', 'grounds'); 
      myFormData.append('user_id', this.user_id.toString());

      this.uploadImgService.post(this.urlConstant.uploadprofile, myFormData).subscribe(
        (res) => {
          if (res.status_code == this.statusConstants.success && res.url) {
            this.profileImgUpdate(res.url, ground_id, baseRes);
          } else {
            this.failedToast(res);
            this.addCallBack(baseRes);
          }
        },
        (err) => {
          this.failedToast(err.error);
          this.addCallBack(baseRes);
        }
      );
    } else {
      console.warn('No image blob available for upload or filedata is not a Blob.');
      this.addCallBack(baseRes);
    }
  }

}
