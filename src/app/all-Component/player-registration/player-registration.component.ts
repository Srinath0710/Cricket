import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';
import { HttpClientModule } from '@angular/common/http';
import { playeredit, Players, playerupdate, playersPersonalEdit, playerspersonalupdate } from './player-registration.model';
import { ApiService } from '../../services/api.service';
import { URLCONSTANT } from '../../services/url-constant';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { ReactiveFormsModule } from '@angular/forms';
import { Drawer } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { UploadImgService } from '../../Profile_Img_service/upload-img.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { environment } from '../../environments/environment';
import { SpinnerService } from '../../services/Spinner/spinner.service';
import { ToastService } from '../../services/toast.service';
import { MultiSelectModule } from 'primeng/multiselect';

interface player {
  parent_config_id: number;
  config_id: number;
  config_name: string;
  config_key: string;
  country_id: number;
}
interface DuplicatePlayer {
  user_id: number | string,
  client_id: number | string,
  first_name: string
  sur_name: string
  display_name: string
}

@Component({
  selector: 'app-player-registration',
  templateUrl: './player-registration.component.html',
  styleUrl: './player-registration.component.css',
  imports: [
    DropdownModule,
    TagModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    TableModule,
    InputTextModule,
    DialogModule,
    CalendarModule,
    HttpClientModule,
    PaginatorModule,
    TooltipModule,
    SidebarModule,
    ReactiveFormsModule,
    DrawerModule,
    RadioButtonModule,
    Drawer,
    ToastModule,
    ImageCropperComponent,
    MultiSelectModule

  ],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService },
    { provide: ToastService },
  ],
})
export class PlayerRegistrationComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  submitted: boolean = true;
  isFirstEdit: boolean = true;
  PlayerData: any[] = [];
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  totalData: any = 0;
  previewUrl: string | ArrayBuffer | null = null;
  filedata: any;
  uploadedImage: string | ArrayBuffer | null = null;
  profileImages: any;
  showCropperModal = false;
  imageBase64: any = null;
  url: any;
  src: any;
  imageCropAlter: any;
  imageDefault: any;
  croppedImage: any;
  envImagePath = environment.imagePath;
  selectedPlayers: any = [];
  viewDialogVisible: boolean = false;
  isEditMode: boolean = false;
  ispersonalupadate: boolean = false;
  isEditPersonal: boolean = false;
  searchKeyword: string = '';
  visible: boolean = false;
  isEditing: boolean = false;
  public ShowForm: any = false;
  public personalShowForm: any = false;
  position: 'center' = 'center';
  playerRegistrationform!: FormGroup;
  addplayerpersonalform!: FormGroup;
  backScreen: any;
  visibleDialog: boolean = false;
  players: Players[] = [];
  playerList: any[] = [];
  showFilters: boolean = false;
  selectedplayer: any = null;
  configDataList: player[] = [];
  clublist = [];
  NationalitydropdownData: any;
  genderSelect: player[] = [];
  playerrole: player[] = [];
  battingstyle: player[] = [];
  battingorder: player[] = [];
  bowlingstyle: player[] = [];
  bowlingtype: player[] = [];
  bowlingspec: player[] = [];
  clientData: any[] = [];
  filteredSpecs: any[] = [];
  playerId: any;
  duplicatePlayers: any[] = [];
  countriesData: any;
  loading = false;
  countriesList: player[] = [];
  country_id: any;
  citiesList = [];
  statesList = [];
  emergencyTypeList: any[] = [];
  bloodgroup: any[] = [];
  mobileRegex = '^((\\+91-?)|0)?[0-9]{10,13}$';
  email = (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  playerNamePattern = /^[^'"]+$/; //allstringonly allow value
  filterPlayerType: string[] = [];
  filterGenderType: string[] = [];
  filterBatOrder: string[] = [];
  filterBatType: string[] = [];
  filterBowlType: string = '';
  filterClubType: string = '';
  filterBowlStyle: string[] = [];
  filterBowlSpec: string[] = [];
  form: any;
  personal_player_id: any;
  isPersonalDataIntialized: boolean = false;
  disableReadonly: boolean = true;
  isClientShow: boolean = false;
  filterNationality: string[] = [];
  // NationalitydropdownData: any[] = [];


  imagePreview: string | ArrayBuffer | null = null;
  imageSizeError: string = '';
  selectedImage: File | null = null;
  activeFilters: any;
  order: any;

  enableEditMode() {
    this.disableReadonly = !this.disableReadonly;
  }
  default_img = CricketKeyConstant.default_image_url.players;
  men_img = CricketKeyConstant.default_image_url.menimg;
  women_img = CricketKeyConstant.default_image_url.womenimg;
  conditionConstants = CricketKeyConstant.condition_key;
  statusConstants = CricketKeyConstant.status_code;
  Actionflag = CricketKeyConstant.action_flag;
  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
    private confirmationService: ConfirmationService,
    private uploadImgService: UploadImgService,
    private spinnerService: SpinnerService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.Clientdropdown();
    this.playerRegistrationform = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      middle_name: [''],
      sur_name: ['', [Validators.required]],
      display_name: ['', [Validators.required]],
      nationality_id: ['', [Validators.required]],
      player_dob: ['',],
      mobile_no: ['', [Validators.pattern(this.mobileRegex)]],
      email: ['', [
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      gender_id: ['', [Validators.required]],
      player_role_id: ['', [Validators.required]],
      batting_style_id: ['', [Validators.required]],
      batting_order_id: [''],
      bowling_style_id: [''],
      bowling_type_id: [''],
      bowling_spec_id: [''],
      remarks: [''],
      jersey_no: [''],
      profile_image: [''],
      // team_represent: [''],
      player_id: [''],
      club_id: ['', [Validators.required]],
      scorecard_name: ['', []],
      reference_id: ['', []],

    })
    this.addplayerpersonalform = this.fb.group({
      nationality_id: ['', [Validators.required]],
      country_of_birth: ['', [Validators.required]],
      residence_country_id: ['', [Validators.required]],
      primary_email_id: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
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
      player_height: [''],
      player_weight: [''],
      medical_conditions: [''],
      allergies: [''],
      medications: [''],
      doctor_name: [''],
      doctor_phone: [''],
      insurance_provider: [''],
      policy_number: [''],
      policy_expiry_date: [''],
      additional_notes: [''],
      twitter_handle: [''],
      instagram_handle: [''],
      facebook_url: ['']
    });

  }
  dropdownapi() {
    this.getCountries();
    this.getGlobalData();
    this.gridLoad();
    this.Nationalitydropdown();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;

  }

  filters: any = {};  // global filter state maintain

  applyFilters() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.filters = {}; // reset local filters before apply

    // if (this.filterBatType) this.filters.batting_style_list = this.filterBatType;
    if (this.filterBatType && this.filterBatType.length > 0) {
      this.filters.batting_style_list = this.filterBatType.join(',');
    }
    if (this.filterBowlType) this.filters.bowling_type_list = this.filterBowlType;
    if (this.filterBatOrder && this.filterBatOrder.length > 0) {
      this.filters.batting_order_list = this.filterBatOrder.join(',');
    }
    // if (this.filterBatOrder) this.filters.batting_order_list = this.filterBatOrder;
    if (this.filterGenderType && this.filterGenderType.length > 0) {
      this.filters.gender_list = this.filterGenderType.join(',');
    }
    // if (this.filterBowlStyle) this.filters.bowling_style_list = this.filterBowlStyle;
    if (this.filterBowlStyle && this.filterBowlStyle.length > 0) {
      this.filters.bowling_style_list = this.filterBowlStyle.join(',');
    }
    // if (this.filterBowlSpec) this.filters.bowling_spec_list = this.filterBowlSpec;
    if (this.filterBowlSpec && this.filterBowlSpec.length > 0) {
      this.filters.bowling_spec_list = this.filterBowlSpec.join(',');
    }
    // if (this.filterNationality) this.filters.nationality_list = this.filterNationality;
    if (this.filterNationality && this.filterNationality.length > 0) {
      this.filters.nationality_list = this.filterNationality.join(',');
    }
    if (this.filterPlayerType && this.filterPlayerType.length > 0) {
      this.filters.player_role_list = this.filterPlayerType.join(',');
    }
    if (this.filterClubType) this.filters.club_list = this.filterClubType;

    console.log('Applying filters:', this.filters);

    this.first = 1;
    this.gridLoad(this.filters);

    this.showFilters = true;
    this.toastService.playerSuccessToast({ message: 'Player list has been filtered' });
  }

  clearFilters() {
    this.filterPlayerType = [];
    this.filterGenderType = [];
    this.filterBatOrder = [];
    this.filterBatType = [];
    this.filterBowlType = '';
    this.filterClubType = '';
    this.filterBowlStyle = [];
    this.filterBowlSpec = [];
    this.filterNationality = [];

    this.filters = {}; // clear global filter state
    this.showFilters = false;
    this.gridLoad();
    this.clear();
  }


  clubsdropdown() {
    const params: any = {
      action_flag: this.Actionflag.Dropdown,
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString()
    };
    this.apiService.post(this.urlConstant.playerdropdown, params).subscribe(
      (res) => {
        this.clublist = res.data?.clubs || [];
        this.genderSelect = res.data.dropdowns.filter((item: any) => item.config_key == 'gender');
        this.playerrole = res.data.dropdowns.filter((item: any) => item.config_key == 'player_role');
        this.battingstyle = res.data.dropdowns.filter((item: any) => item.config_key == 'batting_style');
        this.battingorder = res.data.dropdowns.filter((item: any) => item.config_key == 'batting_order');
        this.bowlingstyle = res.data.dropdowns.filter((item: any) => item.config_key == 'bowling_style');
        this.bowlingtype = res.data.dropdowns.filter((item: any) => item.config_key === 'bowling_type');
        this.bowlingspec = res.data.dropdowns.filter((item: any) => item.config_key === 'bowling_spec');

        this.playerRegistrationform.get('gender_id')?.valueChanges.subscribe((selectedGenderId) => {
          const gender = this.genderSelect.find((g: any) => g.config_id === selectedGenderId);

          if (gender) {
            if (gender.config_name.toLowerCase() === 'men' || gender.config_name.toLowerCase() === 'male') {
              this.default_img = this.men_img;
            } else if (gender.config_name.toLowerCase() === 'women' || gender.config_name.toLowerCase() === 'female') {
              this.default_img = this.women_img;
            } else {
              this.default_img = CricketKeyConstant.default_image_url.players;
            }
          }
        });

        this.filteredSpecs = [];
        this.formSetValue();
      },
      (err: any) => {
        if (err.status_code === this.statusConstants.refresh && err.error.message) {
          this.apiService.RefreshToken();
          this.failedToast(err.error)
        } else {
          this.clublist = [];
          console.error("Error fetching clubs dropdown:", err);
        }
      }
    );
  }
  //mobileno enter the only number alowed
  onPhoneNumberInput(event: Event, controlName: string) {
    const inputElement = event.target as HTMLInputElement;
    const phoneNumber = inputElement.value.replace(/\D/g, '').slice(0, 10); // Allow only digits, max 10

    // Check and update value in addplayerpersonalform
    if (this.addplayerpersonalform?.get(controlName)) {
      this.addplayerpersonalform.get(controlName)?.setValue(phoneNumber, { emitEvent: false });
    }
    // Check and update value in playerRegistrationform
    else if (this.playerRegistrationform?.get(controlName)) {
      this.playerRegistrationform.get(controlName)?.setValue(phoneNumber, { emitEvent: false });
    }
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
    if (this.addplayerpersonalform?.get(controlName)) {
      this.addplayerpersonalform.get(controlName)?.setValue(cleaned, { emitEvent: false });
    }
    else if (this.playerRegistrationform?.get(controlName)) {
      this.playerRegistrationform.get(controlName)?.setValue(cleaned, { emitEvent: false });
    }
  }

  Clientdropdown() {
    const params: any = {
      user_id: this.user_id?.toString()
    };
    this.apiService.post(this.urlConstant.groundUserClient, params).subscribe((res) => {
      this.clientData = res.data ?? [];
      this.isClientShow = this.clientData.length > 1 ? true : false;
      this.client_id = Number(this.clientData[0].client_id) || 0;
      this.dropdownapi();

    }, (err) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message) {
        this.apiService.RefreshToken();
      }
    });
  }

  gridLoad(filters: any = this.filters) {
    this.spinnerService.raiseDataEmitterEvent('on');
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: String(this.client_id),
      page_no: this.first.toString(),
      records: this.rows.toString(),
      search_text: this.searchKeyword.toString()
    };
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        params[key] = filters[key];
      }
    });
    this.apiService.post(this.urlConstant.getplayerlist, params).subscribe((res) => {
      if (res.data?.players) {
        this.PlayerData = res.data.players;
        this.totalData = this.PlayerData.length != 0 ? res.data.players[0].total_records : 0;
        this.spinnerService.raiseDataEmitterEvent('off');

      } else {
        this.PlayerData = [];
        this.totalData = 0;
        this.spinnerService.raiseDataEmitterEvent('off');
      }
      // this.PlayerData.forEach((val: any) => {
      //   val.profile_image = `${val.profile_image}?${Math.random()}`;
      // });
      this.PlayerData.forEach((val: any) => {
        if (!val.profile_image) {
          if (val.gender === 'Men') {
            val.profile_image = this.men_img;
          } else if (val.gender === 'Women') {
            val.profile_image = this.women_img;
          } else {
            val.profile_image = 'assets/images/player.jpg';
          }
        }
        // val.profile_image = `${val.profile_image}?${Math.random()}`;
      });
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg
        ? this.apiService.RefreshToken()
        : (this.spinnerService.raiseDataEmitterEvent('off'), this.PlayerData = [], this.totalData = this.PlayerData.length);
    });
    this.clubsdropdown();
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

  Nationalitydropdown() {

    const params: any = {};
    params.action_flag = this.Actionflag.Dropdown;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.nationalityplayer, params).subscribe((res) => {
      this.NationalitydropdownData = res.data.region != undefined ? res.data.region : [];
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message) {
        this.apiService.RefreshToken();
      }
    })
  }



  onBowlingTypeChange(selectedBowlingTypeId: number): void {
    if (!selectedBowlingTypeId) {
      this.filteredSpecs = [];
      this.playerRegistrationform.get('bowling_spec_id')?.reset();
      return;
    }
    console.log(this.filteredSpecs, 'sdsds');
    this.filteredSpecs = [...this.bowlingspec.filter(
      spec => spec.parent_config_id === selectedBowlingTypeId
    )];
    console.log(this.filteredSpecs, 'selectedBowlingTypeId', selectedBowlingTypeId);

    this.playerRegistrationform.patchValue({
      bowling_spec_id: null
    });
  }

formSetValue() {
  // 🔁 Generic setter
  const setDefaultValue = (list: any[], field: string, keyword: string) => {
    const match = list.find(item => item.config_name?.toLowerCase().includes(keyword));
    if (match) {
      this.playerRegistrationform.patchValue({ [field]: match.config_id });
    }
  };
  
  // 🏏 Set defaults using helper
  setDefaultValue(this.playerrole, 'player_role_id', 'batsman');
  setDefaultValue(this.battingstyle, 'batting_style_id', 'right');
  setDefaultValue(this.bowlingstyle, 'bowling_style_id', '');
  setDefaultValue(this.bowlingtype, 'bowling_type_id', '');
  setDefaultValue(this.genderSelect, 'gender_id', 'men');

  // Set default image based on the selected gender
  const genderId = this.playerRegistrationform.get('gender_id')?.value;
  if (genderId) {
    const gender = this.genderSelect.find(g => g.config_id === genderId);
    if (gender) {
      const genderName = gender.config_name.toLowerCase();
      if (genderName.includes('male') || genderName.includes('men') || genderName.includes('boy')) {
        this.default_img = this.men_img;
      } else if (genderName.includes('female') || genderName.includes('women') || genderName.includes('girl')) {
        this.default_img = this.women_img;
      // } else {
      //   this.default_img = CricketKeyConstant.default_image_url.players;
      }
    }
  }

  this.filteredSpecs = [];
}

  duplicateChange(isEditMode: boolean = false) {
    this.submitted = true;
    if (this.playerRegistrationform.invalid) {
      this.playerRegistrationform.markAllAsTouched();
      return;
    }

    // Skip duplicate check if in edit mode
    if (isEditMode) {
      this.addplayerdata();
      return;
    }

    const params: DuplicatePlayer = {
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString(),
      first_name: this.playerRegistrationform.value.first_name,
      display_name: this.playerRegistrationform.value.display_name,
      sur_name: this.playerRegistrationform.value.sur_name,
    };

    this.apiService.post(this.urlConstant.duplicateplayer, params).subscribe(
      (res) => {
        if (res.status_code === this.statusConstants.success &&
          res.status &&
          (res.data !== null && res.data.players.length !== 0)) {
          this.showDuplicatePopup(res);
        } else {
          this.addplayerdata();
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

  showDuplicatePopup(response: any) {
    this.duplicatePlayers = response.data.players;
    this.viewshowDialog();
  }
  viewshowDialog() {
    this.position = 'center';
    this.visible = true;
  }
  hideDialog() {
    this.visible = false;
  }
  editLabel() {
    this.isEditMode = false;

  }

  profileImgAppend(player_id: any) {
    const myFormData = new FormData();
    if (this.filedata != null && this.filedata != '') {
      myFormData.append('imageFile', this.filedata);
      myFormData.append('client_id', this.client_id.toString());
      myFormData.append('file_id', player_id);
      myFormData.append('upload_type', 'players');
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

  addplayerdata() {
    this.submitted = true;
    this.isEditMode = false;
    if (this.playerRegistrationform.invalid) {
      this.playerRegistrationform.markAllAsTouched();
      return
    }

    const params: playerupdate = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      first_name: this.playerRegistrationform.value.first_name,
      middle_name: this.playerRegistrationform.value.middle_name,
      sur_name: this.playerRegistrationform.value.sur_name,
      display_name: this.playerRegistrationform.value.display_name != null ? this.playerRegistrationform.value.display_name.toString() : null,
      nationality_id: this.playerRegistrationform.value.nationality_id != null ? this.playerRegistrationform.value.nationality_id.toString() : null,
      player_dob: this.playerRegistrationform.value.player_dob != null ? this.playerRegistrationform.value.player_dob.toString() : null,
      mobile_no: this.playerRegistrationform.value.mobile_no,
      email: this.playerRegistrationform.value.email != null ? this.playerRegistrationform.value.email.toString() : null,
      gender_id: this.playerRegistrationform.value.gender_id != null ? this.playerRegistrationform.value.gender_id.toString() : null,
      player_role_id: this.playerRegistrationform.value.player_role_id != null ? this.playerRegistrationform.value.player_role_id.toString() : null,
      batting_style_id: this.playerRegistrationform.value.batting_style_id != null ? this.playerRegistrationform.value.batting_style_id.toString() : null,
      batting_order_id: this.playerRegistrationform.value.batting_order_id != null ? this.playerRegistrationform.value.batting_order_id.toString() : null,
      bowling_style_id: this.playerRegistrationform.value.bowling_style_id != null ? this.playerRegistrationform.value.bowling_style_id.toString() : null,
      bowling_type_id: this.playerRegistrationform.value.bowling_type_id != null ? this.playerRegistrationform.value.bowling_type_id.toString() : null,
      bowling_spec_id: this.playerRegistrationform.value.bowling_spec_id != null ? this.playerRegistrationform.value.bowling_spec_id.toString() : null,
      remarks: this.playerRegistrationform.value.remarks != null ? this.playerRegistrationform.value.remarks.toString() : null,
      jersey_no: this.playerRegistrationform.value.jersey_no != null ? this.playerRegistrationform.value.jersey_no.toString() : null,
      player_id: this.playerRegistrationform.value.player_id != null ? this.playerRegistrationform.value.player_id.toString() : null,
      club_id: this.playerRegistrationform.value.club_id != null ? this.playerRegistrationform.value.club_id.toString() : null,
      scorecard_name: this.playerRegistrationform.value.scorecard_name != null ? this.playerRegistrationform.value.scorecard_name.toString() : null,
      reference_id: this.playerRegistrationform.value.reference_id != null ? this.playerRegistrationform.value.reference_id.toString() : null,
      action_flag: this.Actionflag.Create,
      profile_image: this.filedata ? '' : this.profileImages

    };

    if (this.playerRegistrationform.value.player_id) {
      params.action_flag = this.Actionflag.Update;
      params.player_id = String(this.playerRegistrationform.value.player_id),
        this.apiService.post(this.urlConstant.updateplayer, params).subscribe((res) => {
          if (res.status_code === this.statusConstants.success && res.status) {

            if (res.data !== null && this.filedata != null) {
              this.profileImgAppend(params.player_id);
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
      this.apiService.post(this.urlConstant.addplayer, params).subscribe((res) => {
        if (res.status_code === this.statusConstants.success && res.status) {
          if (res.data !== null && this.filedata != null) {
            this.profileImgAppend(res.data.players[0].player_id);
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
  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

  addCallBack(res: any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
    this.gridLoad();
  }

  resetForm() {
    this.playerRegistrationform.reset();
    this.formSetValue();
    this.addplayerpersonalform.reset();
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
    this.default_img = CricketKeyConstant.default_image_url.players;
    // this.applyFilters();
  }
  showAddForm() {
    this.ShowForm = true;
    this.showCropperModal = false;
  }
  cancelForm() {
    this.ShowForm = false;
    this.personalShowForm = false;
    this.addplayerpersonalform.reset();
    this.disableReadonly = true;

  }

  Editplayer(player: any) {
    this.isEditMode = true;
    this.playerId = player.player_id;
    const params = {
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString(),
      player_id: player.player_id.toString()
    };
    this.visible = false;
    this.apiService.post(this.urlConstant.editplayer, params).subscribe((res) => {
      if (res.status_code === this.statusConstants.success && res.status) {
        const editRecord = res.data.players[0] || {};
        this.playerRegistrationform.reset();
        const bowlingId = editRecord.bowling_type_id ?? 0;
        this.filteredSpecs = this.bowlingspec.filter(
          spec => spec.parent_config_id === Number(bowlingId)
        );
        // Then patch all values
        this.playerRegistrationform.patchValue({
          first_name: editRecord.first_name,
          middle_name: editRecord.middle_name,
          sur_name: editRecord.sur_name,
          display_name: editRecord.display_name,
          nationality_id: editRecord.nationality_id,
          player_dob: editRecord.player_dob ? editRecord.player_dob.split('T')[0] : null,
          mobile_no: editRecord.mobile_no,
          email: editRecord.email,
          gender_id: editRecord.gender_id,
          player_role_id: editRecord.player_role_id,
          batting_style_id: editRecord.batting_style_id,
          batting_order_id: editRecord.batting_order_id,
          bowling_style_id: editRecord.bowling_style_id,
          bowling_type_id: editRecord.bowling_type_id,
          bowling_spec_id: editRecord.bowling_spec_id,
          remarks: editRecord.remarks,
          jersey_no: editRecord.jersey_no,
          player_id: editRecord.player_id,
          club_id: editRecord.club_id,
          scorecard_name: editRecord.scorecard_name,
          reference_id: editRecord.reference_id
        });

        this.showAddForm();

        // Clear file data first
        this.filedata = null;


        if (editRecord.profile_image && editRecord.profile_image.trim() !== '') {
          this.profileImages = editRecord.profile_image + '?' + Math.random();
          this.convertUrlToBase64(this.profileImages);
        } else {

          if (editRecord.gender_name?.toLowerCase() === 'men' || editRecord.gender_name?.toLowerCase() === 'male') {
            this.default_img = this.men_img;
          } else if (editRecord.gender_name?.toLowerCase() === 'women' || editRecord.gender_name?.toLowerCase() === 'female') {
            this.default_img = this.women_img;
            // } else {
            //   this.default_img = CricketKeyConstant.default_image_url.players;
          }
          this.profileImages = null;
        }
      }
    });
  }

  fileEvent(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const maxSizeKB = 500;

    if (this.playerRegistrationform.value.profile_image !== null && this.playerRegistrationform.value.profile_image !== '') {
      this.profileImages = null;
    }

    if (file) {
      const fileSizeKB = file.size / 500;
      if (fileSizeKB > maxSizeKB) {
        this.imageSizeError = 'Max.size is 500KB';
        this.imagePreview = null;
        this.selectedImage = null;
        this.filedata = null;
        this.playerRegistrationform.get('profile_image')?.reset();
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


  saveCroppedImage(): void {
    this.profileImages = this.croppedImage;
    this.imageCropAlter = this.filedata;
    this.filedata = this.base64ToBinary(this.filedata);
    this.showCropperModal = false;
  }

  cancelImg(): void {
    this.showCropperModal = false;
    this.url = this.imageCropAlter;
    this.filedata = this.base64ToBinary(this.imageCropAlter);
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
  cancel() {
    this.filedata = null;
    this.url = null;
    this.profileImages = null;
    this.imageCropAlter = null;
    this.imageBase64 = null;
    this.imageDefault = null;
    this.croppedImage = null



  }
  cropPopOpen() {
    this.showCropperModal = true;
    this.imageBase64 = this.imageDefault;
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


  viewShowDialog() {
    this.visibleDialog = true;
    this.backScreen = "overlay1";
  }
  viewPlayer(player: any) {
    this.selectedplayer = player;
    this.visibleDialog = true;
  }

  onSubmit() {
    if (this.playerRegistrationform.invalid) return;

    const playerData = this.playerRegistrationform.value;

    if (this.isEditing) {
      this.players = Object.assign({}, playerData);
    } else {
      this.players.push(Object.assign({}, playerData));
    }

    this.visible = false;

    this.msgService.add({
      severity: 'success',
      summary: this.isEditing ? 'Player Updated' : 'Player Created',
      detail: `Player ${this.isEditing ? 'updated' : 'created'} successfully`
    });
  }

  Personalupdate() {
    this.submitted = true;
    this.ispersonalupadate = false; // fixed variable name casing
    if (this.addplayerpersonalform.invalid) {
      this.addplayerpersonalform.markAllAsTouched();
      return;
    }

    const params: playerspersonalupdate = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      player_id: String(this.personal_player_id),
      nationality_id: String(this.addplayerpersonalform.value.nationality_id),
      country_of_birth: String(this.addplayerpersonalform.value.country_of_birth),
      residence_country_id: String(this.addplayerpersonalform.value.residence_country_id),
      primary_email_id: this.addplayerpersonalform.value.primary_email_id,
      secondary_email_id: this.addplayerpersonalform.value.secondary_email_id,
      primary_phone: this.addplayerpersonalform.value.primary_phone,
      secondary_phone: this.addplayerpersonalform.value.secondary_phone,
      blood_group_id: this.addplayerpersonalform.value.blood_group_id != null ? this.addplayerpersonalform.value.blood_group_id.toString() : null,
      father_name: this.addplayerpersonalform.value.father_name,
      mother_name: this.addplayerpersonalform.value.mother_name,
      guardian_name: this.addplayerpersonalform.value.guardian_name,
      address_1: this.addplayerpersonalform.value.address_1,
      address_2: this.addplayerpersonalform.value.address_2,
      country_id: String(this.addplayerpersonalform.value.country_id),
      state_id: String(this.addplayerpersonalform.value.state_id),
      city_id: this.addplayerpersonalform.value.city_id != null ? this.addplayerpersonalform.value.city_id.toString() : null,
      post_code: this.addplayerpersonalform.value.post_code,
      emergency_contact: this.addplayerpersonalform.value.emergency_contact,
      emergency_type: this.addplayerpersonalform.value.emergency_type,
      emergency_number: this.addplayerpersonalform.value.emergency_number,
      emergency_email: this.addplayerpersonalform.value.emergency_email,
      twitter_handle: this.addplayerpersonalform.value.twitter_handle,
      instagram_handle: this.addplayerpersonalform.value.instagram_handle,
      facebook_url: this.addplayerpersonalform.value.facebook_url,
      player_height: this.addplayerpersonalform.value.player_height,
      player_weight: this.addplayerpersonalform.value.player_weight,
      medical_conditions: this.addplayerpersonalform.value.medical_conditions,
      allergies: this.addplayerpersonalform.value.allergies,
      medications: this.addplayerpersonalform.value.medications,
      doctor_name: this.addplayerpersonalform.value.doctor_name,
      doctor_phone: this.addplayerpersonalform.value.doctor_phone,
      insurance_provider: this.addplayerpersonalform.value.insurance_provider,
      policy_number: this.addplayerpersonalform.value.policy_number,
      policy_expiry_date: this.addplayerpersonalform.value.policy_expiry_date,
      additional_notes: this.addplayerpersonalform.value.additional_notes,

    };
    console.log(params);
    this.apiService.post(this.urlConstant.playerpersonalupadate, params).subscribe(
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
    return this.isPersonalDataIntialized && !this.disableReadonly !== null && this.addplayerpersonalform.value.true
  }

  EditpersonalPlayers(player: any) {
    this.isEditPersonal = true;
    this.isPersonalDataIntialized = true;
    this.disableReadonly = true;
    this.personalShowForm = true;
    this.personal_player_id = player.player_id;
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      player_id: player.player_id?.toString(),
    };
    this.apiService.post(this.urlConstant.playersPersonalEdit, params).subscribe(
      (res) => {
        if (res.data != null) {
          const editpersonalRecord: playersPersonalEdit = res.data?.players[0] ?? {};
          this.isPersonalDataIntialized = true;
          this.addplayerpersonalform.setValue({
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
            twitter_handle: editpersonalRecord.twitter_handle,
            instagram_handle: editpersonalRecord.instagram_handle,
            facebook_url: editpersonalRecord.facebook_url,
            player_height: editpersonalRecord.player_height,
            player_weight: editpersonalRecord.player_weight,
            medical_conditions: editpersonalRecord.medical_conditions,
            allergies: editpersonalRecord.allergies,
            medications: editpersonalRecord.medications,
            doctor_name: editpersonalRecord.doctor_name,
            doctor_phone: editpersonalRecord.doctor_phone,
            insurance_provider: editpersonalRecord.insurance_provider,
            policy_number: editpersonalRecord.policy_number,
            policy_expiry_date: editpersonalRecord.policy_expiry_date != null ? editpersonalRecord.policy_expiry_date.split('T')[0] : null,
            additional_notes: editpersonalRecord.additional_notes
          });

        } else {
          this.isEditPersonal = false;
          this.isPersonalDataIntialized = false;
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
  getCountries() {
    const params: any = {};
    params.action_flag = this.Actionflag.Country;
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.countryLookups, params).subscribe((res) => {
      this.countriesList = res.data.countries != undefined ? res.data.countries : [];
      this.loading = false;
      this.country_id = this.countriesList[0].country_id;
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
    this.apiService.post(this.urlConstant.playerspersonaldropdown, params).subscribe((res) => {
      const dropdowns = res.data.dropdowns || [];

      this.emergencyTypeList = dropdowns.filter((d: any) => d.config_key === 'emergency_type');
      this.bloodgroup = dropdowns.filter((d: any) => d.config_key === 'blood_group');
      // Pre-fill values if necessary
      // setTimeout(() => {
      //   const teamId = this.addplayerpersonalform.get('official_id')?.value;
      //   if (!teamId) {
      //   }
      // }, 100);
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();
      }
    });
  }

  successToast(data: any) {
    this.toastService.successToast({ message: data.message })
  }
  /* Failed Toast */
  failedToast(data: any) {
    this.toastService.failedToast({ message: data.message })
  }

  status(player_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      player_id: player_id?.toString()
    };
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.gridLoad()) : this.failedToast(res);
      },
      (err: any) => {
        err.status_code === this.statusConstants.refresh &&
          err.error.message === this.statusConstants.refresh_msg
          ? this.apiService.RefreshToken()
          : this.failedToast(err.error);
      }
    );
  }

  StatusConfirm(player_id: number, actionObject: { key: string; label: string }) {
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
        const url = isActivating ? this.urlConstant.activeplayer : this.urlConstant.deactiveplayer;
        this.status(player_id, url);
      },
      reject: () => { }
    });
  }
  filterGlobal() {
    if (this.searchKeyword.length >= 3 || this.searchKeyword.length === 0) {

      this.dt?.filterGlobal(this.searchKeyword, 'contains');
      this.first = 1;
      // this.applyFilters();
      this.gridLoad();
    }
  }
  clear() {
    this.searchKeyword = '';
    this.dt.clear();
    this.gridLoad();
    this.showFilters = false;
  }



  onViewPlayer(playersid: number) {
    const params = {
      player_id: playersid.toString(),
      client_id: this.client_id?.toString(),
      user_id: String(this.user_id)
    };

    this.apiService.post(this.urlConstant.viewgroundPlayers, params).subscribe({
      next: (res) => {
        if (res.status_code === this.statusConstants.success && res.data) {
          this.selectedPlayers = res.data.players;

          this.PlayerData.forEach((val: any) => {
            if (!val.profile_image) {
              if (val.gender === 'Men') {
                val.profile_image = this.men_img;
              } else if (val.gender === 'Women') {
                val.profile_image = this.women_img;
                // } else {
                //   val.profile_image = 'assets/images/player.jpg';
              }
            }
            // val.profile_image = `${val.profile_image}?${Math.random()}`;
          });
          this.viewDialogVisible = true;
        } else {
          this.failedToast(res);
        }
      },
      error: (err) => {
        console.error('Failed to fetch player details', err);
        this.failedToast(err.error);
      }
    });
  }

  getPlayersParts(fullName: string | undefined | null): { name: string } {
    if (!fullName) {
      return { name: '' };
    }

    const match = fullName.match(/^([^(]+)\s*(\(.*\))?$/);
    return {
      name: match?.[1]?.trim() || fullName
    };
  }

  onGenderChange(selectedGenderId: number): void {
    if (!selectedGenderId) {
      this.setDefaultImage(this.profileImages);
      return;
    }
    const selectedGender = this.genderSelect.find(g => g.config_id === selectedGenderId);

    if (selectedGender) {
      const genderName = selectedGender.config_name.toLowerCase();

      if (genderName.includes('male') || genderName.includes('man') || genderName.includes('boy')) {
        this.setDefaultImage(this.profileImages);
      } else if (genderName.includes('female') || genderName.includes('woman') || genderName.includes('girl')) {
        this.setDefaultImage(this.profileImages);
      } else {
        this.setDefaultImage(this.profileImages);
      }
    }
  }

  private setDefaultImage(imageUrl: string): void {
    if (!this.filedata && !this.profileImages) {
      this.previewUrl = imageUrl;
      this.profileImages = imageUrl;
    }
  }

}