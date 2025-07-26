import { Component, ElementRef, ViewChild } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { officials } from './officials.model';
import { HttpClient } from '@angular/common/http';
import { URLCONSTANT } from '../../services/url-constant';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { offcialupdate } from './officials.model';
import { ReactiveFormsModule } from '@angular/forms';
import { offcialedit } from './officials.model';
import { offcialpersonalupadate } from './officials.model';
import { offcialpersonaledit } from './officials.model';
import { TooltipModule } from 'primeng/tooltip';
import { OnInit } from '@angular/core';
import { Drawer } from 'primeng/drawer';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../environments/environment';
import { UploadImgService } from '../../Profile_Img_service/upload-img.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { SpinnerService } from '../../services/Spinner/spinner.service';
interface official {
  config_id: string;
  country_id: number;
  profile_img: string;

}

@Component({
  selector: 'app-officials',
  templateUrl: './officials.component.html',
  styleUrl: './officials.component.css',
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TagModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    CalendarModule,
    DrawerModule,
    ConfirmDialogModule,
    Drawer,
    PaginatorModule,
    ToastModule,
    TooltipModule,
    ImageCropperComponent
  ],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }

  ],
})
export class OfficialsComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  pageno: number = 1;
  records: number = 10;
  searchKeyword: string = '';
  visible: boolean = false;
  isEditing: boolean = false;
  public ShowForm: boolean = false;
  public personalShowForm: boolean = false;
  position: 'right' = 'right';
  addOfficialForm!: FormGroup;
  addPersonalForm!: FormGroup;
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  totalData: any = 0;
  filedata: any;
  backScreen: any;
  selectedOfficial: any = null;
  visibleDialog: boolean = false;
  official: officials[] = [];
  officialList: any[] = [];
  isEditMode: boolean = false;
  ispersonalupadate: boolean = false;
  isEditPersonal: boolean = false;
  submitted: boolean = false;
  officialDataList: official[] = [];
  configDataList: official[] = [];
  countrydropdownData: any;
  countriesData: any;
  genderSelect: official[] = [];
  teamformat: official[] = [];
  officialcategory: official[] = [];
  officialtype: any[] = [];
  childOptions: any[] = [];
  childLabel: string = '';
  officialId: any;
  clientData: any[] = [];
  countryData: official[] = [];
  loading = false;
  countriesList: official[] = [];
  statesFormList: any[] = [];
  stateId: any;
  countryId: any;
  cityData: any = [];
  statesList: any[] = [];
  FormValue: boolean = false;
  country_id: any;
  citiesList = [];
  profileImages: any;
  url: any;
  clientID: any;
  envImagePath = environment.imagePath;
  default_img = CricketKeyConstant.default_image_url.officials;
  Actionflag = CricketKeyConstant.action_flag;
  accreditationList: any[] = [];
  childAccreditationList: any[] = [];
  officialStatusList: any[] = [];
  emergencyTypeList: any[] = [];
  bloodgroup: any[] = [];

  mobileRegex = '^((\\+91-?)|0)?[0-9]{10,13}$';
  officialNamePattern = /^[^'"]+$/; //allstringonly allow value
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  dropDownConstants = CricketKeyConstant.dropdown_keys;
  conditionConstants = CricketKeyConstant.condition_key;
  statusConstants = CricketKeyConstant.status_code;
  clubsDropdownData: any;
  personal_official_id: any;
  isFormEmpty: boolean = true;
  isPersonalDataIntialized: boolean = false;
  disableReadonly: boolean = true;
  isClientShow: boolean = false;
  showCropperModal = false;
  imageBase64: any = null;
  profile_img: any
  imageCropAlter: any;
  imageDefault: any;
  imageChangedEvent: any = '';
  croppedImage: any;
  enableEditMode() {
    this.disableReadonly = !this.disableReadonly;
  }


  constructor(private fb: FormBuilder, private apiService: ApiService, private httpClient: HttpClient, private urlConstant: URLCONSTANT,
    private msgService: MessageService, private confirmationService: ConfirmationService, private uploadImgService: UploadImgService, private spinnerService: SpinnerService,
  ) {

  }


  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.Clientdropdown()
    this.Natinalitydropdown()
    this.getCountries();

    this.addOfficialForm = this.fb.group({
      first_name: ['', [Validators.required]],
      middle_name: [''],
      sur_name: ['', [Validators.required]],
      display_name: ['', [Validators.required]],
      format_id: ['', [Validators.required]],
      official_category_id: [''],
      official_type_id: ['', [Validators.required]],
      profile_img: [''],
      country_id: ['', [Validators.required]],
      official_id: [''],
      reference_id: [''],
      club_id: ['', [Validators.required]],
      dob: ['',],
      gender_id: ['', [Validators.required]],

    })

    this.addPersonalForm = this.fb.group({

      nationality_id: ['', [Validators.required]],
      country_of_birth: ['', [Validators.required]],
      residence_country_id: ['', [Validators.required]],
      primary_email_id: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      secondary_email_id: [''],
      primary_phone: ['', [Validators.required, Validators.pattern(this.mobileRegex)]],
      secondary_phone: [''],
      blood_group_id: [''],
      father_name: [''],
      mother_name: [''],
      guardian_name: [''],
      address_1: [''],
      address_2: [''],
      country_id: ['', [Validators.required]],
      state_id: ['', [Validators.required]],
      city_id: [''],
      post_code: [''],
      emergency_contact: [''],
      emergency_type: [''],
      emergency_number: [''],
      emergency_email: [''],
      profile_status_id: [''],
      accreditation_level_id: [''],
      accreditation_id: [''],
      accreditation_expiry_date: [''],
      years_of_experience: [''],
      twitter_handle: [''],
      instagram_handle: [''],
      facebook_url: ['']
    });


  }

  Clientdropdown() {
    const params: any = {
      user_id: this.user_id?.toString()
    };
    this.apiService.post(this.urlConstant.groundUserClient, params).subscribe((res) => {
      this.clientData = res.data ?? [];
      this.isClientShow = this.clientData.length > 1 ? true : false;
      this.client_id = this.clientData[0].client_id;
      this.callBackClientChange();



    }, (err) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();
      }
    });
  }

  callBackClientChange() {
    this.dropdown();
    this.gridload();

  }

  dropdown() {
    const params: any = {};
    params.action_flag = this.Actionflag.Dropdown;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.dropdownofficial, params).subscribe((res) => {
      this.configDataList = res.data.dropdowns != undefined ? res.data.dropdowns : [];
      this.clubsDropdownData = res.data?.clubs || [];
      const configFilterKeys = this.dropDownConstants.config_key
      this.teamformat = res.data.dropdowns
        .filter((item: any) => item.config_key === configFilterKeys.team_format)
        .map((item: any) => ({ ...item }));

      this.genderSelect = res.data.dropdowns
        .filter((item: any) => item.config_key === configFilterKeys.gender)
        .map((item: any) => ({ ...item }));

      this.officialtype = res.data.dropdowns
        .filter((item: any) => item.config_key === configFilterKeys.officials)
        .map((item: any) => ({ ...item }));

      setTimeout(() => {
        const teamId = this.addOfficialForm.get('team_id')?.value;
        if (!teamId) {
        }
      }, 100);

    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();

      }
    })
  }

  gridload() {
    this.spinnerService.raiseDataEmitterEvent('on');
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.page_no = this.first.toString();
    params.records = this.rows.toString();
    params.search_text = this.searchKeyword.toString();
    this.apiService.post(this.urlConstant.officiallist, params).subscribe((res) => {


      if (res.data?.officials) {
        this.officialDataList = res.data.officials;
        this.totalData = this.officialDataList.length !== 0 ? res.data.officials[0].total_records : 0;
        this.spinnerService.raiseDataEmitterEvent('off');

      } else {
        this.officialDataList = [];
        this.totalData = 0;
        this.spinnerService.raiseDataEmitterEvent('off');

      }
      this.officialDataList.forEach((val) => {
        val.profile_img = `${val.profile_img}?${Math.random()}`;
      });
    },

      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.officialDataList = [], this.spinnerService.raiseDataEmitterEvent('off'),
          this.totalData = this.officialDataList.length);

      });
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

  onPhoneNumberInput(event: Event, controlName: string) {
    const inputElement = event.target as HTMLInputElement;
    const phoneNumber = inputElement.value.replace(/\D/g, '').slice(0, 10); // Allow only digits, max 10
    this.addPersonalForm.get(controlName)?.setValue(phoneNumber, { emitEvent: false });
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
    this.addOfficialForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
  }

  addOfficialdata() {
    this.submitted = true;
    this.isEditMode = false;
    if (this.addOfficialForm.invalid) {
      this.addOfficialForm.markAllAsTouched();
      return
    }
    const params: offcialupdate = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      first_name: this.addOfficialForm.value.first_name,
      middle_name: this.addOfficialForm.value.middle_name,
      sur_name: this.addOfficialForm.value.sur_name,
      display_name: String(this.addOfficialForm.value.display_name),
      format_id: String(this.addOfficialForm.value.format_id),
      official_type_id: String(this.addOfficialForm.value.official_type_id),
      official_category_id: this.addOfficialForm.value.official_category_id != null ? this.addOfficialForm.value.official_category_id.toString() : null,
      country_id: String(this.addOfficialForm.value.country_id),
      reference_id: this.addOfficialForm.value.reference_id,
      club_id: String(this.addOfficialForm.value.club_id),
      gender_id: String(this.addOfficialForm.value.gender_id),
      dob: this.addOfficialForm.value.dob,
      profile_img: this.filedata ? '' : this.profileImages,
      action_flag: this.Actionflag.Create
    };
    if (this.addOfficialForm.value.official_id) {
      params.action_flag = this.Actionflag.Update;
      params.official_id = String(this.addOfficialForm.value.official_id),
        this.apiService.post(this.urlConstant.updateOfficial, params).subscribe((res) => {
          if (res.status_code === this.statusConstants.success && res.status) {
            if (res.data !== null && this.filedata != null) {
              this.profileImgAppend(params.official_id);
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

      this.apiService.post(this.urlConstant.addofficial, params).subscribe((res) => {
        if (res.status_code === this.statusConstants.success && res.status) {
          if (res.data !== null && this.filedata != null) {
            this.profileImgAppend(res.data.officials[0].official_id);
          }
          else {
            this.addCallBack(res)
          }
        }
        else {
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

  showAddForm() {
    this.ShowForm = true;
  }
  cancelForm() {
    this.ShowForm = false;
    this.personalShowForm = false;
    this.addPersonalForm.reset();
    this.disableReadonly = true;
    this.filedata = null;
    this.url = null;
    this.profileImages = null;
    this.imageCropAlter = null;
    this.imageBase64 = null;
    this.imageDefault = null;
    this.croppedImage = null;
  }

  onOfficialChange(selectedId: number) {
    const selectedItem = this.officialtype.find(item => item.config_id === selectedId);
    this.addOfficialForm.patchValue({
      official_category_id: null

    })
    const officialConstants = this.dropDownConstants.official_keys;

    const roleMap: any = {
      [officialConstants.umpire_category.short_key]: officialConstants.umpire_category,
      [officialConstants.scorer.short_key]: officialConstants.scorer,
      [officialConstants.analyst.short_key]: officialConstants.analyst,
    };

    const selectedRole = roleMap[selectedItem.config_short];

    if (selectedRole) {
      this.childOptions = this.configDataList.filter(
        (item: any) => item.config_key === selectedRole.key
      );
      this.childLabel = selectedRole.label;
    } else {
      this.childOptions = [];
      this.childLabel = '';
    }
  }

  Editofficial(official: any) {
    this.isEditMode = true;
    this.showCropperModal = false;
    this.officialId = official.official_id;
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.official_id = official.official_id?.toString();
    this.apiService.post(this.urlConstant.editofficial, params).subscribe((res) => {
      if (res.status_code === this.statusConstants.success && res.status) {
        const editRecord: offcialedit = res.data.officials[0] ?? {};
        if (editRecord != null) {
          this.onOfficialChange(editRecord.official_type_id);
          this.addOfficialForm.setValue({
            first_name: editRecord.first_name,
            middle_name: editRecord.middle_name,
            sur_name: editRecord.sur_name,
            display_name: editRecord.display_name,
            official_type_id: editRecord.official_type_id,
            format_id: editRecord.format_id,
            official_category_id: editRecord.official_category_id,
            country_id: editRecord.country_id,
            profile_img: '',
            official_id: editRecord.official_id,
            reference_id: editRecord.reference_id,
            gender_id: editRecord.gender_id,
            dob: editRecord.dob != null ? editRecord.dob.split('T')[0] : null,
            club_id: editRecord.club_id,
          });
          this.showAddForm();
          this.profileImages = editRecord.profile_img + '?' + Math.random();
          this.convertUrlToBase64(editRecord.profile_img + '?' + Math.random());
          this.filedata = null;
        }
      } else {
        this.failedToast(res);
      }
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });

  }

  PersonalupdateOfficial() {
    this.submitted = true;
    this.ispersonalupadate = false;

    if (this.addPersonalForm.invalid) {
      this.addPersonalForm.markAllAsTouched();
      return;
    }

    const params: offcialpersonalupadate = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      official_id: String(this.personal_official_id),
      nationality_id: String(this.addPersonalForm.value.nationality_id?.region_id),
      country_of_birth: String(this.addPersonalForm.value.country_of_birth),
      residence_country_id: String(this.addPersonalForm.value.residence_country_id),
      primary_email_id: String(this.addPersonalForm.value.primary_email_id),
      secondary_email_id: this.addPersonalForm.value.secondary_email_id,
      primary_phone: String(this.addPersonalForm.value.primary_phone),
      secondary_phone: this.addPersonalForm.value.secondary_phone,
      blood_group_id: this.addPersonalForm.value.blood_group_id != null ? this.addPersonalForm.value.blood_group_id.toString() : null,
      father_name: this.addPersonalForm.value.father_name,
      mother_name: this.addPersonalForm.value.mother_name,
      guardian_name: this.addPersonalForm.value.guardian_name,
      address_1: this.addPersonalForm.value.address_1,
      address_2: this.addPersonalForm.value.address_2,
      country_id: String(this.addPersonalForm.value.country_id),
      state_id: String(this.addPersonalForm.value.state_id),
      city_id: this.addPersonalForm.value.city_id != null ? this.addPersonalForm.value.city_id.toString() : null,
      post_code: this.addPersonalForm.value.post_code,
      emergency_contact: this.addPersonalForm.value.emergency_contact,
      emergency_type: this.addPersonalForm.value.emergency_type != null ? this.addPersonalForm.value.emergency_type.toString() : null,
      emergency_number: this.addPersonalForm.value.emergency_number,
      emergency_email: this.addPersonalForm.value.emergency_email,
      profile_status_id: this.addPersonalForm.value.profile_status_id != null ? this.addPersonalForm.value.profile_status_id.tostring() : null,
      accreditation_level_id: this.addPersonalForm.value.accreditation_level_id != null ? this.addPersonalForm.value.accreditation_level_id.tostring() : null,
      accreditation_id: this.addPersonalForm.value.accreditation_id,
      accreditation_expiry_date: this.addPersonalForm.value.accreditation_expiry_date,
      years_of_experience: this.addPersonalForm.value.years_of_experience,
      twitter_handle: this.addPersonalForm.value.twitter_handle,
      instagram_handle: this.addPersonalForm.value.instagram_handle,
      facebook_url: this.addPersonalForm.value.facebook_url,
    };

    this.apiService.post(this.urlConstant.officialpersonalupadate, params).subscribe(
      (res) => {
        if (res.status_code === this.statusConstants.success && res.status) {
          this.addCallBack(res);

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

  formInputAccess(): boolean {

    return this.isPersonalDataIntialized && !this.disableReadonly !== null && this.addPersonalForm.value.true
  }

  Editpersonalofficial(official: any) {
    this.getGlobalData();
    this.personalShowForm = true;
    this.isPersonalDataIntialized = true;
    this.disableReadonly = true;
    this.isEditPersonal = true;
    this.personal_official_id = official.official_id;
    // this.officialId = official.official_id;  

    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      official_id: official.official_id?.toString(),
    };

    this.apiService.post(this.urlConstant.officialpersonaledit, params).subscribe(
      (res) => {

        if (res.data != null) {
          const editpersonalRecord: offcialpersonaledit = res.data?.officials[0] ?? {};
          this.isPersonalDataIntialized = true;
          this.addPersonalForm.setValue({
            nationality_id: editpersonalRecord.nationality_id,
            country_of_birth: editpersonalRecord.country_of_birth,
            residence_country_id: editpersonalRecord.residence_country_id,
            primary_email_id: editpersonalRecord.primary_email_id,
            secondary_email_id: editpersonalRecord.secondary_email_id,
            primary_phone: editpersonalRecord.primary_phone,
            secondary_phone: editpersonalRecord.secondary_phone,
            blood_group_id: editpersonalRecord.blood_group_id,
            father_name: editpersonalRecord.father_name,
            mother_name: editpersonalRecord.mother_name,
            guardian_name: editpersonalRecord.guardian_name,
            address_1: editpersonalRecord.address_1,
            address_2: editpersonalRecord.address_2,
            country_id: editpersonalRecord.country_id,
            state_id: editpersonalRecord.state_id,
            city_id: editpersonalRecord.city_id,
            post_code: editpersonalRecord.post_code,
            emergency_contact: editpersonalRecord.emergency_contact,
            emergency_type: Number(editpersonalRecord.emergency_type) || null,
            emergency_number: editpersonalRecord.emergency_number,
            emergency_email: editpersonalRecord.emergency_email,
            profile_status_id: editpersonalRecord.profile_status_id,
            accreditation_level_id: editpersonalRecord.accreditation_level_id,
            accreditation_id: editpersonalRecord.accreditation_id,
            accreditation_expiry_date: editpersonalRecord.accreditation_expiry_date != null ? editpersonalRecord.accreditation_expiry_date.split('T')[0] : null,
            years_of_experience: editpersonalRecord.years_of_experience,
            twitter_handle: editpersonalRecord.twitter_handle,
            instagram_handle: editpersonalRecord.instagram_handle,
            facebook_url: editpersonalRecord.facebook_url,
          });

        } else {
          this.isEditPersonal = false;
          this.isPersonalDataIntialized = false;
          // this.addPersonalForm.reset();
          this.resetForm();

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

  Natinalitydropdown() {

    const params: any = {};
    params.action_flag = this.urlConstant.countryofficial.action_flag;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.countryofficial.url, params).subscribe((res) => {
      this.countrydropdownData = res.data.region != undefined ? res.data.region : [];

    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();

      }
    })


  }

  getCountries() {
    const params: any = {};
    params.action_flag = this.Actionflag.Country;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.countryLookups, params).subscribe((res) => {
      this.countriesList = res.data.countries != undefined ? res.data.countries : [];
      this.loading = false;
      this.country_id = this.countriesList[0].country_id;
      // this.gridload();
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
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

    params.action_flag = this.Actionflag.City;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    params.state_id = state_id.toString();
    this.apiService.post(this.urlConstant.getcitylookups, params).subscribe((res) => {
      this.citiesList = res.data.cities != undefined ? res.data.cities : [];
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
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
    params.action_flag = this.Actionflag.State;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    params.country_id = country_id.toString();
    this.apiService.post(this.urlConstant.getStatesByCountry, params).subscribe((res) => {
      this.statesList = res.data.states != undefined ? res.data.states : [];
      this.loading = false;
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();

      }
    });
  }



  getGlobalData() {
    const params: any = {
      action_flag: this.Actionflag.Dropdown,
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString(),
    };

    this.apiService.post(this.urlConstant.dropdownofficial, params).subscribe((res) => {
      const dropdowns = res.data?.dropdowns || [];

      this.accreditationList = dropdowns.filter((d: any) => d.config_key === 'accreditation_level');
      this.officialStatusList = dropdowns.filter((d: any) => d.config_key === 'official_profile_status');
      this.emergencyTypeList = dropdowns.filter((d: any) => d.config_key === 'emergency_type');
      this.bloodgroup = dropdowns.filter((d: any) => d.config_key === 'blood_group');


      setTimeout(() => {
        const teamId = this.addPersonalForm.get('official_id')?.value;
        if (!teamId) {
        }
      }, 100);
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();
      }
    });
  }

  //PROFILE UPLOAD

  closeSuccess() {
    this.resetForm();
    this.gridload();
  }


  fileEvent(event: any) {
    if (this.addOfficialForm.value.profile_img.value !== null &&
      this.addOfficialForm.value.profile_img.value !== '') {
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
  profileImgAppend(official_id: any) {
    const myFormData = new FormData();
    if (this.filedata != null && this.filedata != '') {
      myFormData.append('imageFile', this.filedata);
      myFormData.append('client_id', this.client_id.toString());
      myFormData.append('file_id', official_id);
      myFormData.append('upload_type', 'officials');
      myFormData.append('user_id', this.user_id?.toString());
      this.uploadImgService.post(this.urlConstant.uploadprofile, myFormData).subscribe(
        (res) => {
          if (res.status_code == this.statusConstants.success) {
            if (res.url != null && res.url != '') {
              this.addCallBack(res)
            }
          }
        },
        (err: any) => {
          if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
            this.apiService.RefreshToken();

          }
        }
      );
    }
  }
  viewShowDialog() {
    this.visibleDialog = true
    this.backScreen = "overlay1"
  }
  viewofficial(official: any) {
    this.selectedOfficial = official;
    this.visibleDialog = true;
  }

  onSubmit() {
    if (this.addOfficialForm.invalid) return;

    const officialData = this.addOfficialForm.value;

    if (this.isEditing) {
      this.official = Object.assign({}, officialData);
    }
    else {
      this.official.push(Object.assign({}, officialData));
    }

    this.visible = false;
  }
  successToast(data: any) {

    this.msgService.add({
      severity: 'success',
      summary: 'Success',
      detail: data.message,
      data: { image: 'assets/images/default-logo.png' },
      life:800
    });
  }
  /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({
      data: { image: 'assets/images/default-logo.png' },
      severity: 'error',
      summary: 'Error',
      detail: data.message,
      life:800
    });
  }

  status(official_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      official_id: official_id?.toString()
    };
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.gridload()) : this.failedToast(res);
      },
      (err: any) => {
        error: (err: any) => {
          console.error('Error loading official list:', err);
        }
      });
  }

  // StatusConfirm(official_id: number, actionObject: { key: string; label: string }, currentStatus: string) {
  //   const { active_status, deactive_status } = this.conditionConstants;
  //   const isSameStatus =
  //     (actionObject.key === active_status.key && currentStatus === active_status.status) ||
  //     (actionObject.key === deactive_status.key && currentStatus === deactive_status.status);
  //   if (isSameStatus) return;
  //   const isActivating = actionObject.key === active_status.key;
  //   const iconColor = isActivating ? '#4CAF50' : '#d32f2f';
  //   const message = `Are you sure you want to proceed?`;

  //   this.confirmationService.confirm({
  //     header: ``,
  //     message: `
  //     <div class="custom-confirm-content">
  //     <i class="fa-solid fa-triangle-exclamation warning-icon" style="color: ${iconColor};"></i>
  //       <div class="warning">Warning</div>
  //       <div class="message-text">${message}</div>
  //     </div>
  //   `,
  //     acceptLabel: 'Yes',
  //     rejectLabel: 'No',
  //     styleClass: 'p-confirm-dialog-custom',
  //     accept: () => {
  //       const url = isActivating ? this.urlConstant.activateofficial : this.urlConstant.deactivateofficial;
  //       this.status(official_id, url);
  //       this.confirmationService.close();
  //     },
  //     reject: () => this.confirmationService.close()
  //   } as any);
  // }
  StatusConfirm(official_id: number, actionObject: { key: string; label: string }) {
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
        const url = isActivating ? this.urlConstant.activateofficial : this.urlConstant.deactivateofficial;
        this.status(official_id, url);
      },
      reject: () => { }
    });
  }
  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
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
  resetForm() {
    this.addOfficialForm.reset();
    this.addPersonalForm.reset();
    this.submitted = false;
    this.filedata = null;
    this.profileImages = null;
    this.url = null;
    this.imageBase64 = null;
    this.imageCropAlter = null;
    this.imageDefault = null;
  }
  cancel() {
    this.filedata = null;
    this.url = null;
    this.imageBase64 = null;
    this.profileImages = null;
    this.imageCropAlter = null;
    this.imageBase64 = null;
    this.imageDefault = null;
    this.croppedImage = null;
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

  cancelImg(): void {
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
}
