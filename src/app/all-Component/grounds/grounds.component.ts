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
      post_code: [''],
      northern_end: [''],
      sourthern_end: [''],
      north: [null, [Validators.pattern(this.decimalPattern)]],
      south: [null, [Validators.pattern(this.decimalPattern)]],
      east: [null, [Validators.pattern(this.decimalPattern)]],
      west: [null, [Validators.pattern(this.decimalPattern)]],
      club_id: ['', []],
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
  }

  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

  }

  /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }

  // onAddGround() {
  //   this.submitted = true;
  //   this.isEditMode = false;
  //   if (this.addGroundForm.invalid) {

  //     this.addGroundForm.markAllAsTouched();
  //     return;
  //   }

  //   const isEdit = !!this.addGroundForm.value.ground_id;

  //   const params: UpdateGround = {

  //     user_id: String(this.user_id),
  //     client_id: String(this.ClientID),
  //     ground_id: this.addGroundForm.value.ground_id != null ? String(this.addGroundForm.value.ground_id) : null,
  //     ground_name: this.addGroundForm.value.ground_name,
  //     display_name: this.addGroundForm.value.display_name,
  //     country_id: String(this.addGroundForm.value.country_id),
  //     state_id: String(this.addGroundForm.value.state_id),
  //     city_id: String(this.addGroundForm.value.city_id),
  //     address_1: this.addGroundForm.value.address_1,
  //     address_2: this.addGroundForm.value.address_2,
  //     post_code: this.addGroundForm.value.post_code,
  //     northern_end: this.addGroundForm.value.northern_end,
  //     sourthern_end: this.addGroundForm.value.sourthern_end,
  //     north: this.addGroundForm.value.north,
  //     south: this.addGroundForm.value.south,
  //     east: this.addGroundForm.value.east,
  //     west: this.addGroundForm.value.west,
  //     club_id: String(this.addGroundForm.value.club_id),
  //     latitude: this.addGroundForm.value.latitude,
  //     longitude: this.addGroundForm.value.longitude,
  //     capacity: String(this.addGroundForm.value.capacity),
  //     profile: this.addGroundForm.value.profile,
  //     action_flag: isEdit ? 'update' : 'create',
  //     ground_photo: this.addGroundForm.value.ground_photo,
  //     reference_id: this.addGroundForm.value.reference_id,
  //   };

  //   const apiUrl = isEdit ? this.urlConstant.updateGround : this.urlConstant.addGround;

  //   this.apiService.post(apiUrl, params).subscribe(
  //     (res) => {
  //       if (res.status_code === this.statusConstants.success && res.status) {
  //         const groundId = isEdit ? params.ground_id : res.data?.grounds?.[0]?.ground_id;
  //         if (this.filedata instanceof Blob && groundId) {
  //           this.profileImgAppend(groundId, res);
  //         } else {
  //           this.addCallBack(res);
  //         }
  //       } else {
  //         this.failedToast(res);
  // user_id: String(this.user_id),
  //     client_id: String(this.ClientID),
  //     ground_id: this.addGroundForm.value.ground_id != null ? String(this.addGroundForm.value.ground_id) : null,
  //     ground_name: this.addGroundForm.value.ground_name,
  //     display_name: this.addGroundForm.value.display_name,
  //     country_id: String(this.addGroundForm.value.country_id),
  //     state_id: String(this.addGroundForm.value.state_id),
  //     city_id: String(this.addGroundForm.value.city_id),
  //     address_1: this.addGroundForm.value.address_1,
  //     address_2: this.addGroundForm.value.address_2,
  //     post_code: this.addGroundForm.value.post_code,
  //     northern_end: this.addGroundForm.value.northern_end,
  //     sourthern_end: this.addGroundForm.value.sourthern_end,
  //     north: this.addGroundForm.value.north,
  //     south: this.addGroundForm.value.south,
  //     east: this.addGroundForm.value.east,
  //     west: this.addGroundForm.value.west,
  //     club_id: String(this.addGroundForm.value.club_id),
  //     latitude: this.addGroundForm.value.latitude,
  //     longitude: this.addGroundForm.value.longitude,
  //     capacity: String(this.addGroundForm.value.capacity),
  //     profile: this.addGroundForm.value.profile,
  //     action_flag: this.isEditMode ? 'update' : 'create',
  //     ground_photo: this.addGroundForm.value.ground_photo,
  //     reference_id: this.addGroundForm.value.reference_id,
  //       }
  //     },
  //     (err: any) => {
  //       if (err.status_code === this.statusConstants.refresh &&
  //           err.error.message === this.statusConstants.refresh_msg) {
  //         this.apiService.RefreshToken();
  //       } else {
  //         this.failedToast(err.error);
  //       }
  //     }
  //   );
  // }

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
      ground_photo: this.filedata ? this.addGroundForm.value.ground_photo : '',
      reference_id: this.addGroundForm.value.reference_id,

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
    this.showCropperModal = false;
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

  onProfileImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.filedata = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        this.imageDefault = e.target.result;
      };
      reader.readAsDataURL(file);

      this.addGroundForm.patchValue({
        ground_photo: file
      });
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

  // cancelCropping(): void {
  //   this.showCropperModal = false;
  // }

  // clearImage(): void {
  //   this.previewUrl = null;
  //   this.filedata = null;
  //   this.addGroundForm.patchValue({ ground_photo: null });
  //   const fileInput = document.getElementById('groundPhotoInput') as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.value = '';
  //   }
  // }

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

  // fileEvent(event: any) {
  //   if (this.addGroundForm.value.profile_img.value !== null &&
  //     this.addGroundForm.value.profile_img.value !== '') {
  //     this.profileImages = null;
  //   }
  //   if (event && event.target && event.target.files && event.target.files.length > 0) {
  //     this.filedata = event.target.files[0];
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);
  //     reader.onload = (event: any) => {
  //       var img = new Image;
  //       this.url = event.target.result;
  //       this.imageCropAlter = event.target.result
  //       this.imageDefault = event.target.result
  //     }
  //   } else {
  //     this.filedata = null;
  //     this.url = this.imageDefault
  //     this.filedata = this.base64ToBinary(this.imageDefault);

  //   }
  // }

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
  //  profileImgUpdate(upload_profile_url: any, ground_id: any) {
  //     const params: any = {
  //       action_flag: 'update_profile_url',
  //       ground_photo: upload_profile_url.toString(),
  //       user_id: this.user_id.toString(),
  //       client_id: this.client_id.toString(),
  //       ground_id: ground_id?.toString() 
  //     };

  //     this.apiService.post(this.urlConstant.profileGround, params).subscribe(
  //       (res) => {
  //         if (res.status_code == this.statusConstants.success && res.status) {
  //           this.filedata = null;
  //           this.addCallBack(res)
  //         } else {
  //           this.failedToast(res);
  //         }
  //       },
  //       (err: any) => {
  //         if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
  //           this.apiService.RefreshToken();

  //         } else {
  //           this.failedToast(err.error);
  //         }
  //       }
  //     );
  //   }

  profileImgAppend(ground_id: any) {
    const myFormData = new FormData();
    if (this.filedata != null && this.filedata != '') {
      myFormData.append('imageFile', this.filedata);
      myFormData.append('client_id', this.client_id.toString());
      myFormData.append('file_id', ground_id);
      myFormData.append('upload_type', 'ground');
      myFormData.append('user_id', this.user_id?.toString());
      this.uploadImgService.post(this.urlConstant.uploadprofile, myFormData).subscribe(
        (res) => {
          if (res.status_code == this.statusConstants.success) {
            if (res.url != null && res.url != '') {
              console.log('Image uploaded successfully:', res.url);

              // this.filedata = null;
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

//   onImageSelected(event: any): void {
//   const fileInput = event.target as HTMLInputElement;
//   if (!fileInput.files || fileInput.files.length === 0) return;

//   const file = fileInput.files[0];
  
//   // Validation
//   const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//   if (!validTypes.includes(file.type)) {
//     this.msgService.add({
//       severity: 'error',
//       summary: 'Invalid File',
//       detail: 'Only JPG/PNG images are allowed'
//     });
//     fileInput.value = '';
//     return;
//   }

//   const maxSize = 2 * 1024 * 1024; // 2MB
//   if (file.size > maxSize) {
//     this.msgService.add({
//       severity: 'error',
//       summary: 'File Too Large',
//       detail: 'Maximum image size is 2MB'
//     });
//     fileInput.value = '';
//     return;
//   }

//   // Store the original file
//   this.uploadedImageFile = file;
  
//   // Create preview
//   const reader = new FileReader();
//   reader.onload = (e: any) => {
//     this.previewUrl = e.target.result;
//     this.imageBase64 = e.target.result; // For cropper
//     this.showCropperModal = true; // Open cropper immediately
//   };
//   reader.readAsDataURL(file);
// }

  fileEvent(event: any) {
    if (this.addGroundForm.value.profile_img !== null &&
      this.addGroundForm.value.profile_img !== '') {
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

  // private dataURItoBlob(dataURI: string): Blob {
  //   const byteString = atob(dataURI.split(',')[1]);
  //   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);

  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }

  //   return new Blob([ab], { type: mimeString });
  // }

  //   private handleUploadError(error: any): void {
  //   let errorMessage = 'Failed to upload image';

  //   if (error.status === 400) {
  //     errorMessage = 'Invalid request format. Please check the image and try again.';
  //   } else if (error.status === 413) {
  //     errorMessage = 'File size too large. Maximum size is 2MB.';
  //   } else if (error.status === 415) {
  //     errorMessage = 'Unsupported media type. Only JPG/PNG images are allowed.';
  //   } else if (error.error?.message) {
  //     errorMessage = error.error.message;
  //   }

  //   this.msgService.add({
  //     severity: 'error',
  //     summary: 'Upload Failed',
  //     detail: errorMessage
  //   });
  // }

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
