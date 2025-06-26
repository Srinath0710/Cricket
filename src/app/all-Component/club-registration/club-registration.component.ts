import { Component, ViewChild } from '@angular/core';
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
import { OnInit } from '@angular/core';
import { Drawer } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Club, UpdateClub, EditClub } from './club-registration.model';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { environment } from '../../environments/environment';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { UploadImgService } from '../../Profile_Img_service/upload-img.service';

interface Country {
  country_id: any;
  country_name: string;
}

@Component({
  selector: 'app-club-registration',
  standalone: true,
  imports: [CommonModule, ButtonModule, BadgeModule,
    DialogModule, DropdownModule, InputTextModule, Drawer,
    PaginatorModule, DrawerModule, TableModule, FormsModule, ReactiveFormsModule,
    ConfirmDialogModule, TooltipModule, FileUploadModule, ToastModule, TagModule, ImageCropperComponent
  ],
  templateUrl: './club-registration.component.html',
  styleUrls: ['./club-registration.component.css'],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
})

export class ClubRegistrationComponent implements OnInit {
  public addClubForm!: FormGroup<any>;
  @ViewChild('dt') dt!: Table;
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = 0;
  public ShowForm: boolean = false;
  isEditMode: boolean = false;
  isClientShow: boolean = false;
  club_id: any;
  loading = false;
  clubsData: Club[] = [];
  countriesList: Country[] = [];
  stateList = [];
  citiesList = [];
  allClubData: Club[] = [];
  clubForm: any;
  Client: any;
  profileImages: any;
  url: any;
  gridData: any = [];
  submitted: boolean = true;
  visible: boolean = false;
  envImagePath = environment.imagePath;
  // default_flag_img = this.envImagePath + '/images/Default Flag.png';
  default_img = CricketKeyConstant.default_image_url.clubs;
  searchKeyword: string = '';
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  totalData: any = 0;
  filedata: any;
  clientData: any[] = [];
  previewUrl: string | ArrayBuffer | null = null;
  uploadedImage: string | ArrayBuffer | null = null;
  ClubNamePattern = /^[^'"]+$/;
  conditionConstants = CricketKeyConstant.condition_key;
  statusConstants = CricketKeyConstant.status_code;
  dropDownConstants = CricketKeyConstant.dropdown_keys;

  imageBase64: any = null;
  showCropperModal = false;
  imageCropAlter: any;
  imageDefault: any;
  croppedImage: any;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private urlConstant: URLCONSTANT, private msgService: MessageService,
    private confirmationService: ConfirmationService, public cricketKeyConstant: CricketKeyConstant, private uploadImgService: UploadImgService) {

  }

  ngOnInit(): void {

    this.addClubForm = this.formBuilder.group({
      club_id: [''],
      parent_club_id: ['', [Validators.required]],
      club_short: ['', [Validators.required]],
      club_name: ['', Validators.required],
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
      address_1: [''],
      address_2: [''],
      post_code: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]],
      email_id: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      mobile: ['', [Validators.pattern('^[0-9]{10}$')]],
      website: [''],
      contact: [''],
      remarks: [''],
      profile_img: ['']
    });

    this.Clientdropdown();
    this.getCountries();
  }

  ClubDropdown() {
    const params: any = {
      action_flag: 'dropdown',
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString()
    };
    this.apiService.post(this.urlConstant.Clubdropdown, params).subscribe((res) => {
      this.clubsData = res.data.clubs ?? [];
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh &&
        err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();
      } else {
        this.failedToast(err.error);
      }
    });
  }

  gridload() {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.page_no = this.first.toString();
    params.records = this.rows.toString();
    params.search_text = this.searchKeyword.toString();
    this.apiService.post(this.urlConstant.getClubList, params).subscribe((res) => {
      if (res.data.clubs) {
        this.gridData = res.data.clubs ?? [];
        this.totalData = res.data.clubs[0]?.total_records ?? this.gridData.length;
      }
      else {
        this.gridData = [];
        this.totalData = 0;
      }
      this.gridData.forEach((val: any) => {
        val.profile_image = `${val.profile_image}?${Math.random()}`;
      });

    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.gridData = [], this.totalData = this.gridData.length);
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
    this.addClubForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
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
    this.ShowForm = true;
  }
  cancelForm() {
    this.ShowForm = false;
  }

  resetForm() {
    this.addClubForm.reset();
    this.submitted = false;
    this.previewUrl = null;
    this.stateList = [];
    this.citiesList = [];
    this.filedata = null;
    this.profileImages = null;
    this.url = null;
    this.imageBase64 = null;
    this.imageCropAlter = null;
    this.imageDefault = null;
  }
  clearForm() {
    if (!this.isEditMode) {
      this.addClubForm.reset();
      this.previewUrl = null;
      this.submitted = false;
      this.stateList = [];
      this.citiesList = [];
    }
  }

  onSearchChange() {
    this.dt.filterGlobal(this.searchKeyword, 'contains');
  }
  clearSearch() {
    this.searchKeyword = '';
    this.dt.filterGlobal('', 'contains');
  }

  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });
  }

  failedToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }

  onAddClub() {
    this.submitted = true;

    if (this.addClubForm.invalid) {
      this.addClubForm.markAllAsTouched();
      return;
    }

    const isEdit = !!this.addClubForm.value.club_id;

    const params: UpdateClub = {
      user_id: String(this.user_id),
      club_id: String(this.addClubForm.value.club_id || ''),
      client_id: String(this.client_id),
      club_short: this.addClubForm.value.club_short,
      club_name: this.addClubForm.value.club_name,
      parent_club_id: this.addClubForm.value.parent_club_id ? String(this.addClubForm.value.parent_club_id) : null,
      address_1: this.addClubForm.value.address_1,
      address_2: this.addClubForm.value.address_2,
      country_id: String(this.addClubForm.value.country_id),
      state_id: String(this.addClubForm.value.state_id),
      city_id: String(this.addClubForm.value.city_id),
      post_code: this.addClubForm.value.post_code,
      email_id: this.addClubForm.value.email_id,
      mobile: this.addClubForm.value.mobile,
      website: this.addClubForm.value.website || '',
      contact: this.addClubForm.value.contact || '',
      action_flag: isEdit ? 'update' : 'create',
      remarks: this.addClubForm.value.remarks,
      profile_img: this.filedata ? '' : this.profileImages
    };

    const apiUrl = isEdit ? this.urlConstant.updateClub : this.urlConstant.addClub;

    this.apiService.post(apiUrl, params).subscribe(
      (res) => {
        if (res.status_code === this.statusConstants.success && res.status) {
          const clubId = isEdit ? params.club_id : res.data?.clubs?.[0]?.club_id;
          if (this.filedata && clubId) {
            this.profileImgAppend(clubId, res);
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
    this.ClubDropdown();
  }


  getGlobalData() {
    const params: any = {
      action_flag: 'dropdown',
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString()
    };

    this.apiService.post(this.urlConstant.Clubdropdown, params).subscribe(
      (res) => {
        const dropdowns = Array.isArray(res.data?.dropdowns) ? res.data.dropdowns : [];

        this.clubsData = dropdowns.filter((item: any) => item.config_key === this.dropDownConstants.config_key);
      },
      (err: any) => {
        this.clubsData = [];
      }
    );
  }

  EditClub(club_id: any) {
    this.isEditMode = true;
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.club_id = club_id?.toString();
    this.apiService.post(this.urlConstant.editClub, params).subscribe((res) => {
      if (res.status_code == 200) {
        const editRecord: EditClub = res.data.clubs[0] ?? {};
        if (editRecord != null) {
          this.addClubForm.patchValue({
            club_id: editRecord.club_id?.toString(),
            club_short: editRecord.club_short,
            club_name: editRecord.club_name,
            parent_club_id: editRecord.parent_club_id,
            country_id: editRecord.country_id,
            state_id: editRecord.state_id,
            city_id: editRecord.city_id,
            address_1: editRecord.address_1,
            address_2: editRecord.address_2,
            post_code: editRecord.post_code,
            email_id: editRecord.email_id,
            mobile: editRecord.mobile,
            website: editRecord.website,
            contact: editRecord.contact,
            remarks: editRecord.remarks,
            // profile_img: ''
          });
          this.getStates();
          this.showAddForm();
          this.profileImages = editRecord.profile_img + '?' + Math.random();
          this.convertUrlToBase64(editRecord.profile_img + '?' + Math.random());
        }
      } else {
        this.failedToast(res);
      }
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
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


  status(club_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      club_id: club_id?.toString()
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

  StatusConfirm(club_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
    const AlreadyStatestatus =
      (actionObject.key === this.conditionConstants.active_status.key && currentStatus === this.conditionConstants.active_status.status) ||
      (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === this.conditionConstants.deactive_status.status);
    if (AlreadyStatestatus) {
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this club?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.conditionConstants.active_status.key === actionObject.key
          ? this.urlConstant.activateClub
          : this.urlConstant.deactivateClub;
        this.status(club_id, url);
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

    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh &&
        err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();

      } else {
        this.failedToast(err.error);
      }
    });
  }

  getCities(state_id: any) {
    const params: any = {};

    if (state_id == null || state_id == '') {
      return;
    }
    const isEdit = !!this.addClubForm.value.club_id;

    if (!isEdit) {
      this.citiesList = [];
      this.addClubForm.patchValue({
        city_id: null
      });
    }

    params.action_flag = 'get_city_by_state';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    params.state_id = state_id.toString();
    this.apiService.post(this.urlConstant.getcitylookups, params).subscribe((res) => {
      this.citiesList = res.data.cities != undefined ? res.data.cities : [];
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh &&
        err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();

      } else {
        this.failedToast(err.error);
      }
    });
  }

  getStates() {
    const country_id: number = this.addClubForm.get('country_id')?.value;
    const params: any = {};
    if (country_id == null) {
      return;
    }
    const isEdit = !!this.addClubForm.value.club_id;

    if (!isEdit) {
      this.stateList = [];
      this.addClubForm.patchValue({
        state_id: null
      });
    }

    params.action_flag = 'get_state_by_country';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    params.country_id = country_id.toString();
    this.apiService.post(this.urlConstant.getStatesByCountry, params).subscribe((res) => {
      this.stateList = res.data.states != undefined ? res.data.states : [];
      if (this.addClubForm.value.state_id) {
        this.getCities(this.addClubForm.value.state_id);
      }
      this.loading = false;
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh &&
        err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();

      }
    });
  }

  filterGlobal() {
    this.dt?.filterGlobal(this.searchKeyword, 'contains');
  }

  openAddClubForm() {
    this.isEditMode = false;
    this.ShowForm = true;
    this.submitted = false;
    this.addClubForm.reset();
    this.previewUrl = null;
    this.stateList = [];
    this.citiesList = [];
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
      this.ClubDropdown();

    }, (err) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });
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

  cropPopOpen() {
    this.showCropperModal = true;
    this.imageBase64 = this.imageDefault;
  }
  saveCroppedImage(): void {
    this.profileImages = this.croppedImage; // This seems to be a base64 string
    this.imageCropAlter = this.filedata; // This `filedata` is already a base64 string from imageCropped
    this.filedata = this.base64ToBinary(this.filedata); // <-- Problem: Trying to convert base64 (already stored in filedata) back to binary
    this.showCropperModal = false;
  }

  cancelImg(): void {
    this.showCropperModal = false;
    this.url = this.imageCropAlter;
    this.filedata = this.base64ToBinary(this.imageCropAlter);
  }

  imageLoaded() {
    console.log('Image loaded');
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  loadImageFailed() {
    console.error('Image loading failed');
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

  fileEvent(event: any) {
    if (this.addClubForm.value.profile_img.value !== null &&
      this.addClubForm.value.profile_img.value !== '') {
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
  profileImgUpdate(upload_profile_url: any, club_id: any, baseRes: any) {
    const params: any = {
      action_flag: 'update_profile_url',
      profile_img: upload_profile_url.toString(),
      user_id: this.user_id.toString(),
      club_id: club_id.toString(),
      client_id: this.client_id.toString()
    };

    this.apiService.post(this.urlConstant.profileclub, params).subscribe(
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

  profileImgAppend(club_id: any, baseRes: any) {
    const myFormData = new FormData();

    if (this.filedata) {
      myFormData.append('imageFile', this.filedata);
      myFormData.append('client_id', this.client_id.toString());
      myFormData.append('file_id', club_id);
      myFormData.append('upload_type', 'officials');
      myFormData.append('user_id', this.user_id.toString());

      this.uploadImgService.post(this.urlConstant.uploadprofile, myFormData).subscribe(
        (res) => {
          if (res.status_code == this.statusConstants.success && res.url) {
            this.profileImgUpdate(res.url, club_id, baseRes);
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
      this.addCallBack(baseRes);
    }
  }

}

