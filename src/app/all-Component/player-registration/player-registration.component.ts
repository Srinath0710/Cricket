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
import { playeredit, Players, playerupdate, playerspersonalupadate, playersPersonalEdit } from './player-registration.model';
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

  ],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
})
export class PlayerRegistrationComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  submitted: boolean = true;
  PlayerData: any[] = [];
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10; // Default records shown is 10
  totalData: any = 0;
previewUrl: string | ArrayBuffer | null = null;
  filedata: any;
  isEditMode: boolean = false;
  ispersonalupadate: boolean = false;
  isEditPersonal: boolean = false;
 officialId: any;
  searchKeyword: string = '';
  visible: boolean = false;
  isEditing: boolean = false;
  public ShowForm: any = false;
  public personalShowForm: any = false;
  position: 'center' = 'center';
  playerRegistrationform!: FormGroup;
  addplayerpersonalform!: FormGroup;
  backScreen: any;
  // selectedPlayer: any = null;
  visibleDialog: boolean = false;
  players: Players[] = [];
  playerList: any[] = [];
  showFilters: boolean = false;
  selectedplayer: any = null;
  configDataList: player[] = [];
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
  countrydropdownData: any;
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
  // Filter options
  filterStatus: string = '';
  filterPlayerType: string = '';
  form: any;
  personal_player_id: any;
  isPersonalDataIntialized: boolean = false;
  disableReadonly: boolean = true;
  isClientShow: boolean=false;
  enableEditMode() {
    this.disableReadonly = !this.disableReadonly;
  }
  default_img = CricketKeyConstant.default_image_url.players;
  // dropDownConstants= CricketKeyConstant.dropdown_keys;
  conditionConstants = CricketKeyConstant.condition_key;
  statusConstants = CricketKeyConstant.status_code;
  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.Clientdropdown();
    this.Nationalitydropdown();
    this.getCountries();
    this.Natinalitydropdown();
    this.getGlobalData();
    this.playerRegistrationform = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      middle_name: [''],
      sur_name: ['', [Validators.required]],
      display_name: ['', [Validators.required]],
      nationality_id: ['', [Validators.required]],
      player_dob: ['',],
      mobile_no: ['', [Validators.pattern(this.mobileRegex)]],
       email: ['', [
        Validators.required,
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
      club_id: ['', []],
      scorecard_name: ['', []],
      reference_id: ['', []],
    })
    this.addplayerpersonalform = this.fb.group({
      nationality_id: ['', [Validators.required]],
      country_of_birth: ['', [Validators.required]],
      residence_country_id: ['', [Validators.required]],
     primary_email_id: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      secondary_email_id: [''],
      primary_phone:['', [Validators.required, Validators.pattern(this.mobileRegex)]],
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
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  clubsdropdown() {
    const params: any = {
      action_flag: 'dropdown',
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString()
    };
    this.apiService.post(this.urlConstant.teamclubdropdown, params).subscribe(
      (res) => {
        this.configDataList = res.data?.clubs || [];
      },
      (err: any) => {
        if (err.status_code ===this.statusConstants.refresh && err.error.message ) {
          this.apiService.RefreshToken();
          this.failedToast(err.error)
        } else {
          this.configDataList = [];
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
  const cleaned = input.replace(/['"]/g, ''); // remove both ' and "

  // Set value in addplayerpersonalform if control exists
  if (this.addplayerpersonalform?.get(controlName)) {
    this.addplayerpersonalform.get(controlName)?.setValue(cleaned, { emitEvent: false });
  }
  // Else set value in playerRegistrationform if control exists
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
      this.isClientShow=this.clientData.length>1?true:false;
      this.client_id = this.clientData[0].client_id;
      this.gridLoad();

      this.dropdownplayer();
      this.radiobutton();
      
    }, (err) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message) {
        this.apiService.RefreshToken();
      }
    });
  }

  gridLoad() {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.page_no = this.first.toString();
    params.records = this.rows.toString();
    params.search_text = this.searchKeyword.toString(),

      this.apiService.post(this.urlConstant.getplayerlist, params).subscribe((res) => {
        this.PlayerData = res.data.players ?? [];
        this.totalData = this.PlayerData.length != 0 ? res.data.players[0].total_records : 0
        this.clubsdropdown();
        this.PlayerData.forEach((val: any) => {
          val.country_image = `${val.country_image}?${Math.random()}`;
        });
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.PlayerData = [], this.totalData = this.PlayerData.length);

      });
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
    params.action_flag = 'dropdown';
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

  dropdownplayer() {
    const params: any = {};
    params.action_flag = 'dropdown';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.playerdropdown, params).subscribe((res) => {
      this.configDataList = res.data.clubs != undefined ? res.data.clubs : [];
      this.genderSelect = res.data.clubs
        .filter((item: any) => item.config_key == 'gender')
      // console.log(this.genderSelect,res.data.teams);
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message) {
        this.apiService.RefreshToken();
      }
    })
  }

  radiobutton() {
    const params: any = {};
    params.action_flag = 'dropdown';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.playerdropdown, params).subscribe((res) => {
      this.configDataList = res.data.clubs ?? [];
      this.playerrole = res.data.clubs
        .filter((item: any) => item.config_key == 'player_role')

      this.battingstyle = res.data.clubs
        .filter((item: any) => item.config_key == 'batting_style')

      this.battingorder = res.data.clubs
        .filter((item: any) => item.config_key == 'batting_order')

      this.bowlingstyle = res.data.clubs
        .filter((item: any) => item.config_key == 'bowling_style')

      this.bowlingtype = this.configDataList.
        filter((item: any) => item.config_key === 'bowling_type')

      this.bowlingspec = this.configDataList.
        filter((item: any) => item.config_key === 'bowling_spec')

      this.filteredSpecs = [];
      this.formSetValue();
    }); 
  }
  onBowlingTypeChange(selectedBowlingTypeId: number) {
    this.filteredSpecs = this.bowlingspec.filter(
      spec => spec.parent_config_id === selectedBowlingTypeId
    );
    // Reset only if form and control are initialized
    if (this.form?.get('bowling_spec_id')) {
      this.form.get('bowling_spec_id')!.setValue(null);
    }
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
  setDefaultValue(this.bowlingstyle, 'bowling_style_id', 'right');

  const fastBowler = this.bowlingtype.find(type => type.config_name?.toLowerCase().includes('fast'));
  if (fastBowler) {
    const fastBowlerId = fastBowler.config_id;
    this.playerRegistrationform.patchValue({ bowling_type_id: fastBowlerId });
    this.onBowlingTypeChange(fastBowlerId);

    // 🕒 Set default spec after filter
    // setTimeout(() => {
    //   const defaultSpec = this.filteredSpecs[0];
    //   if (defaultSpec) {
    //     this.playerRegistrationform.patchValue({ bowling_spec_id: defaultSpec.config_id });
    //   }
    // }, 0);
  }
}

  duplicateChange() {
    this.submitted = true;
    if (this.playerRegistrationform.invalid) {
      this.playerRegistrationform.markAllAsTouched();
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
        if (
          res.status_code === this.statusConstants.success &&
          res.status &&
          (res.data !== null && res.data.players.length !== 0)
        ) {
          this.showDuplicatePopup(res);
        } else {
          this.addplayerdata(); // call add only if no duplicates
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

    this.duplicatePlayers = response.data.players; // assuming response.data is an array
    this.showDialog();
  }
  showDialog() {
    this.position = 'center';
    this.visible = true;
    // this.addplayerdata();
  }
  hideDialog() {
    this.visible = false;
  }
  editLabel() {
    this.isEditMode = false;

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
      profile_image: this.playerRegistrationform.value.profile_image != null ? this.playerRegistrationform.value.profile_image.toString() : null,
      player_id: this.playerRegistrationform.value.player_id != null ? this.playerRegistrationform.value.player_id.toString() : null,
      // team_represent: this.playerRegistrationform.value.team_represent != null ? this.playerRegistrationform.value.team_represent.toString() : null,
      club_id: this.playerRegistrationform.value.club_id != null ? this.playerRegistrationform.value.club_id.toString() : null,
      scorecard_name: this.playerRegistrationform.value.scorecard_name != null ? this.playerRegistrationform.value.scorecard_name.toString() : null,
      reference_id: this.playerRegistrationform.value.reference_id != null ? this.playerRegistrationform.value.reference_id.toString() : null,
      action_flag: 'create'
    };

    if (this.playerRegistrationform.value.player_id) {
      params.action_flag = 'update';
      this.apiService.post(this.urlConstant.updateplayer, params).subscribe((res) => {
        this.visible = false;
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    } else {

      this.apiService.post(this.urlConstant.addplayer, params).subscribe((res) => {
        this.visible = false;
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
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

  resetForm() {
    this.playerRegistrationform.reset();
       this.formSetValue();  // reload and set defaults
    this.addplayerpersonalform.reset();
    this.submitted = false;
  }
  showAddForm() {
    this.ShowForm = true;
  }

// personalAddShowForm(player: any) {
//   this.resetForm();

//   this.isEditPersonal = false;          
//   this.isPersonalDataIntialized = false; 
//   this.disableReadonly = false;        
//   this.personalShowForm = true;
//   this.personal_player_id = player?.player_id ?? null;
// }

  cancelForm() {
    this.ShowForm = false;
    this.personalShowForm = false;
    this.addplayerpersonalform.reset();
     this.disableReadonly =true; 

  }

  Editplayer(player: any) {
    this.isEditMode = true;
    this.playerId = player.player_id;
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.player_id = player.player_id?.toString();
    this.apiService.post(this.urlConstant.editplayer, params).subscribe((res) => {
      if (res.status_code ==this.statusConstants.success && res.status) {
        const editRecord: playeredit = res.data.players[0] ?? {};
        if (editRecord != null) {
          this.playerRegistrationform.setValue({

            first_name: editRecord.first_name,
            middle_name: editRecord.middle_name,
            sur_name: editRecord.sur_name,
            display_name: editRecord.display_name,
            nationality_id: editRecord.nationality_id,
            player_dob: editRecord.player_dob!=null ?editRecord.player_dob.split('T')[0] :null,
            mobile_no: editRecord.mobile_no,
            email: editRecord.email,
            gender_id: editRecord.gender_id,
            player_role_id: editRecord.player_role_id,
            batting_style_id: editRecord.batting_style_id,
            batting_order_id: editRecord.batting_order_id,
            bowling_style_id: editRecord.bowling_style_id,
            bowling_type_id: editRecord.bowling_type_id,
            bowling_spec_id: editRecord.bowling_spec_id,
            // team_represent: editRecord.team_represent ?? '',
            remarks: editRecord.remarks,
            jersey_no: editRecord.jersey_no,
            profile_image: null,
            player_id: editRecord.player_id,
            club_id: editRecord.club_id,
            scorecard_name: editRecord.scorecard_name,
            reference_id: editRecord.reference_id,
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

    const params: playerspersonalupadate = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      player_id: String(this.personal_player_id),
      nationality_id: String(this.addplayerpersonalform.value.nationality_id),
      country_of_birth: String(this.addplayerpersonalform.value.country_of_birth),
      residence_country_id: String(this.addplayerpersonalform.value.residence_country_id),
      primary_email_id: String(this.addplayerpersonalform.value.primary_email_id),
      secondary_email_id: String(this.addplayerpersonalform.value.secondary_email_id),
      primary_phone: String(this.addplayerpersonalform.value.primary_phone),
      secondary_phone: String(this.addplayerpersonalform.value.secondary_phone),
      blood_group_id: String(this.addplayerpersonalform.value.blood_group_id),
      father_name: this.addplayerpersonalform.value.father_name,
      mother_name: this.addplayerpersonalform.value.mother_name,
      guardian_name: this.addplayerpersonalform.value.guardian_name,
      address_1: this.addplayerpersonalform.value.address_1,
      address_2: this.addplayerpersonalform.value.address_2,
      country_id: String(this.addplayerpersonalform.value.country_id),
      state_id: String(this.addplayerpersonalform.value.state_id),
      city_id: String(this.addplayerpersonalform.value.city_id),
      post_code: String(this.addplayerpersonalform.value.post_code),
      emergency_contact: String(this.addplayerpersonalform.value.emergency_contact),
      emergency_type: String(this.addplayerpersonalform.value.emergency_type),
      emergency_number: String(this.addplayerpersonalform.value.emergency_number),
      emergency_email: String(this.addplayerpersonalform.value.emergency_email),
      twitter_handle: String(this.addplayerpersonalform.value.twitter_handle),
      instagram_handle: String(this.addplayerpersonalform.value.instagram_handle),
      facebook_url: String(this.addplayerpersonalform.value.facebook_url),
      player_height: String(this.addplayerpersonalform.value.player_height),
      player_weight: String(this.addplayerpersonalform.value.player_weight),
      medical_conditions: String(this.addplayerpersonalform.value.medical_conditions),
      allergies: String(this.addplayerpersonalform.value.allergies),
      medications: String(this.addplayerpersonalform.value.medications),
      doctor_name: String(this.addplayerpersonalform.value.doctor_name),
      doctor_phone: String(this.addplayerpersonalform.value.doctor_phone),
      insurance_provider: String(this.addplayerpersonalform.value.insurance_provider),
      policy_number: String(this.addplayerpersonalform.value.policy_number),
policy_expiry_date: this.addplayerpersonalform.value.policy_expiry_date,
      additional_notes: String(this.addplayerpersonalform.value.additional_notes),

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
            policy_expiry_date: editpersonalRecord.policy_expiry_date!=null ?editpersonalRecord.policy_expiry_date.split('T')[0] :null,
            additional_notes: editpersonalRecord.additional_notes
          });

        } else {
            this.isEditPersonal = false;
      this.isPersonalDataIntialized = false;
      // this.addplayerpersonalform.reset();
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
    params.action_flag = 'get_countries';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.countryLookups, params).subscribe((res) => {
        this.countriesList = res.data.countries != undefined ? res.data.countries : [];
        this.loading = false;
        this.country_id = this.countriesList[0].country_id;
        this.gridLoad();
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
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
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
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
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();
        }
    });
}

  getGlobalData() {
    const params: any = {
      action_flag: 'dropdown',
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString(),
    };
    this.apiService.post(this.urlConstant.playerspersonaldropdown, params).subscribe((res) => {
      const dropdowns = res.data?.dropdowns || [];

      this.emergencyTypeList = dropdowns.filter((d: any) => d.config_key === 'emergency_type');
      this.bloodgroup = dropdowns.filter((d: any) => d.config_key === 'blood_group');
      // Pre-fill values if necessary
      setTimeout(() => {
        const teamId = this.addplayerpersonalform.get('official_id')?.value;
        if (!teamId) {
        }
      }, 100);
    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
        this.apiService.RefreshToken();
      }
    });
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

  applyFilters() {
    this.first = 1;
    this.gridLoad();
    this.showFilters = false;
    this.msgService.add({
      severity: 'info',
      summary: 'Filters Applied',
      detail: 'Player list has been filtered'
    });
  }

  // onPageChange(event: any) {
  //   this.first = Math.floor(event.first / event.rows) + 1;
  //   this.rows = event.rows;
  //   this.gridLoad();
  // }

  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });
  }

  failedToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
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
  StatusConfirm(player_id: number, actionObject: { key: string, label: string }) {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this Player?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.conditionConstants.active_status.key === actionObject.key ? this.urlConstant.activeplayer : this.urlConstant.deactiveplayer;
        this.status(player_id, url);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

  filterGlobal() {
    this.dt?.filterGlobal(this.searchKeyword, 'contains');
  }
  clear() {
    this.searchKeyword = '';
    this.dt.clear();
    this.gridLoad();
  }
  // onEnterPress(event: KeyboardEvent): void {
  //   event.preventDefault();
  //   this.filterGlobal();
  // }


}