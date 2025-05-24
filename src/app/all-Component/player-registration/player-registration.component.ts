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
import { PlayerConstants } from '../constants/player.constant';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { playeredit, Players, playerupdate } from './player-registration.model';
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
import { Dialog } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';





interface player {
  parent_config_id: number;
  config_id: number;
  config_name: string;
  config_key: string;
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
  
  isEditMode: boolean = false;
  filedata: any;
  searchKeyword: string = '';
  visible: boolean = false;
  isEditing: boolean = false; 
  public ShowForm: any = false;
  position: 'center' = 'center';
  playerRegistrationform!: FormGroup;
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
  // position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'center';






  // Filter options
  filterStatus: string = '';
  filterPlayerType: string = '';
  form: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
    private confirmationService: ConfirmationService,
    public cricketKeyConstant: CricketKeyConstant,

  ) { }

  ngOnInit() {
     this.Clientdropdown();
    this.playerRegistrationform = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      middle_name: [''],
      sur_name: [''],
      display_name: ['', [Validators.required]],
      nationality_id: ['', [Validators.required]],
      player_dob: ['',],
      mobile_no: [''],
      email: [''],
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
      team_represent: [''],
      player_id: [''],
      club_id:['',[]],
      scorecard_name:['',[]],
      reference_id:['',[]],






    });


    this.Nationalitydropdown();
    

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
        console.log("All clubs:", this.configDataList);
      },
      (err: any) => {
        if (err.status === 401 && err.error.message === "Expired") {
          this.apiService.RefreshToken();
        } else {
          this.configDataList = [];
          console.error("Error fetching clubs dropdown:", err);
        }
      }
    );
  }


  Clientdropdown() {
    const params: any = {
      user_id: this.user_id?.toString()
    };
    this.apiService.post(this.urlConstant.groundUserClient, params).subscribe((res) => {
      this.clientData = res.data ?? [];
      this.client_id = this.clientData[0].client_id;
      console.log(this.client_id);
      this.gridLoad();
    
      this.dropdownplayer();
      this.radiobutton();


    }, (err) => {
      if (err.status === 401 && err.error.message === 'Token expired') {
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
      err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : (this.PlayerData = [], this.totalData = this.PlayerData.length);

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
      if (err.status === 401 && err.error.message === "Expired") {
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
      if (err.status === 401 && err.error.message === "Expired") {  
        this.apiService.RefreshToken();

      }
    })
  }

  radiobutton() {
    console.log('hi');
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
  // Find the "Fast bowler" item in bowlingtype list
  const fastBowler = this.bowlingtype.find(
    (type: any) => type.config_name.toLowerCase().includes('fast')
  );

  if (fastBowler) {
    const fastBowlerId = fastBowler.config_id;

    // Patch the value to the form
    this.playerRegistrationform.patchValue({
      bowling_type_id: fastBowlerId
    });

    // Trigger the spec filter
    this.onBowlingTypeChange(fastBowlerId);
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
          res.status_code === this.cricketKeyConstant.status_code.success &&
          res.status &&
          (res.data !== null && res.data.players.length !== 0)
        ) {
          this.showDuplicatePopup(res);
        } else {
          //  this.addplayerdata(); // call add only if no duplicates
        }
      },
      (err: any) => {
        err.status === this.cricketKeyConstant.status_code.refresh &&
          err.error.message === this.cricketKeyConstant.status_code.refresh_msg
          ? this.apiService.RefreshToken()
          : this.failedToast(err);
      }
    );
  }

  showDuplicatePopup(response: any) {

    this.duplicatePlayers = response.data.players; // assuming response.data is an array
    this.showDialog();

    console.log(response);
  }
  showDialog() {
    this.position = 'center';
    this.visible = true;
    // this.addplayerdata();
  }
  hideDialog() {
    this.visible = false;
  }
editLabel(){
   this.isEditMode =false;

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
      mobile_no: this.playerRegistrationform.value.mobile_no != null ? this.playerRegistrationform.value.mobile_no.toString() : null,
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
      team_represent: this.playerRegistrationform.value.team_represent != null ? this.playerRegistrationform.value.team_represent.toString() : null,
      club_id: this.playerRegistrationform.value.club_id != null ? this.playerRegistrationform.value.club_id.toString() : null,
      scorecard_name: this.playerRegistrationform.value.scorecard_name != null ? this.playerRegistrationform.value.scorecard_name.toString() : null,
      reference_id: this.playerRegistrationform.value.reference_id != null ? this.playerRegistrationform.value.reference_id.toString() : null,
      action_flag: 'create'

    };


    if (this.playerRegistrationform.value.player_id) {
      params.action_flag = 'update';
      this.apiService.post(this.urlConstant.updateplayer, params).subscribe((res) => {
         this.visible = false;
        res.status_code === this.cricketKeyConstant.status_code.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    } else {

      this.apiService.post(this.urlConstant.addplayer, params).subscribe((res) => {
         this.visible = false;
        res.status_code === this.cricketKeyConstant.status_code.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
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
    this.submitted = false;
  }

  showAddForm() {
    this.ShowForm = true;
  }
  cancelForm() {
    this.ShowForm = false;
  }

  Editplayer(player: any) {
    this.isEditMode = true;
    this.playerId = player.player_id;
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.player_id = player.player_id?.toString();
    this.apiService.post(this.urlConstant.editplayer, params).subscribe((res) => {
      console.log(res);
      if (res.status_code == 200) {
        const editRecord: playeredit = res.data.players[0] ?? {};
        if (editRecord != null) {
          this.playerRegistrationform.setValue({

            first_name: editRecord.first_name,
            middle_name: editRecord.middle_name,
            sur_name: editRecord.sur_name,
            display_name: editRecord.display_name,
            nationality_id: editRecord.nationality_id,
            player_dob: editRecord.player_dob,
            mobile_no: editRecord.mobile_no,
            email: editRecord.email,
            gender_id: editRecord.gender_id,
            player_role_id: editRecord.player_role_id,
            batting_style_id: editRecord.batting_style_id,
            batting_order_id: editRecord.batting_order_id,
            bowling_style_id: editRecord.bowling_style_id,
            bowling_type_id: editRecord.bowling_type_id,
            bowling_spec_id: editRecord.bowling_spec_id,
            team_represent: editRecord.team_represent ?? '',
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
      err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
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
        res.status_code === this.cricketKeyConstant.status_code.success && res.status ? (this.successToast(res), this.gridLoad()) : this.failedToast(res);
      },
      (err: any) => {
        error: (err: any) => {
          console.error('Error loading Player list:', err);
        }
      });
  }

  StatusConfirm(player_id: number, actionObject: { key: string, label: string }) {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this Player?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.cricketKeyConstant.condition_key.active_status.key === actionObject.key ? this.urlConstant.activeplayer : this.urlConstant.deactiveplayer;
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