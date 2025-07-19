import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ManageDataItem } from '../competition.component';
import { ToastModule } from 'primeng/toast';
import { SpinnerService } from '../../../services/Spinner/spinner.service';
interface Team {
  team_id: number;
  team_name: string;
  // other fields...
}
@Component({
  selector: 'app-comp-player',
  imports: [
    PickListModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TableModule,
    ToastModule
  ],
  templateUrl: './comp-player.component.html',
  styleUrl: './comp-player.component.css',
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
  standalone: true
})

export class CompPlayerComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;
  @Input() CompetitionData: ManageDataItem = { competition_id: 0, name: '', match_type: '', gender: '', age_category: '', start_date: '', end_date: '', tour_type: '', trophy_name: '' };
  @Output() PlayerUpdated = new EventEmitter<void>();
  client_id: number = Number(localStorage.getItem('client_id'));
  default_img = CricketKeyConstant.default_image_url.players;
  teamsDropDown: any;
  initilized: boolean = false;
  selectedTeamData: any;
  selectedTeamId: number | null = null;
  isEditPopupVisible = false;
  public ManagePlayerForm!: FormGroup<any>;
  statusConstants = CricketKeyConstant.status_code;
  squardPlayers: any[] = [];
  filtersquardPlayers: any[] = [];
  selectedPlayer: any = null;
  selectedCount = 0;
  search_filters: string = '';
  targetPlayer: any[] = [];
  sourcePlayer: any[] = [];
  searchText: string = '';
  filteredTeams: any[] = [];
  sourceSearchKeyword: string = '';
  targetSearchKeyword: string = '';
  teamname: any;
  teamsData: Team[] = [];
  squadPlayerList = []
  teamID: any;
  player_id: any;
  user_id: number = Number(localStorage.getItem('user_id'));
  ImportMappingData: any;
  targetProducts: any;
  ImportData: any;
  

  // ... (existing properties)

allPlayersRaw: any[] = []; // To store all players fetched from the API
selectedPlayersRaw: any[] = []; // To store all selected players fetched from the API

// ... (rest of your component)
  constructor(
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private formBuilder: FormBuilder,
    private msgService: MessageService,
    private cricketKeyConstant: CricketKeyConstant,
    private confirmationService: ConfirmationService,
    private spinnerService: SpinnerService
  ) { }
  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.gridLoad();
    this.ManagePlayerForm = this.formBuilder.group({
      player_id: ['', []],
      client_id: ['', []],
      competition_id: ['', []],
      jersey_number: ['', [Validators.required]],
      scorecard_name: ['', [Validators.required]],
      profile_url: ['', []],
      user_id: ['', []],
      team_id: ['', []],
      display_name: ['', []],
      team_name: ['', []]
    });
  }

  // chooseTeam(teamId: any) {
  //   // Only proceed if a different team is selected
  //   if (this.team_id !== teamId) {
  //     this.team_id = teamId;
  //   } else {
  //     this.sourcePlayer = [];
  //     this.targetPlayer = [];
  //   }
  // }
chooseTeam(team_id: any) {
  if (this.teamID === team_id) {
    return; 
  }

  this.teamID = team_id;
  this.spinnerService.raiseDataEmitterEvent('on'); 
  this.filterPlayersByTeam(this.teamID);
  this.spinnerService.raiseDataEmitterEvent('off');
}

  gridLoad() {
  this.spinnerService.raiseDataEmitterEvent('on');
  const params: any = {};
  params.client_id = this.client_id.toString();
  params.user_id = this.user_id.toString();
  params.competition_id = this.CompetitionData.competition_id.toString();

  this.apiService.post(this.urlConstant.compplayerlist, params).subscribe(
    (res: any) => {
      this.teamsDropDown = res.data.teams ?? [];
      this.teamsData = res.data.teams != undefined ? res.data.teams : [];
      this.allPlayersRaw = res.data.all_players ?? [];
      this.selectedPlayersRaw = res.data.selected_players ?? [];
      if ( this.teamsData.length > 0) {
        this.teamID = this.teamsData[0].team_id;
      }
      this.filterPlayersByTeam(this.teamID);

      this.spinnerService.raiseDataEmitterEvent('off');

      console.log('All Items Raw:', this.allPlayersRaw); 
      console.log('Selected Players Raw:', this.selectedPlayersRaw); 
    },
    (err: any) => {
      console.error('Error loading player list:', err);
      this.spinnerService.raiseDataEmitterEvent('off');
      this.sourcePlayer = [];
      this.targetPlayer = [];
    }
  );
}
filterPlayersByTeam(teamId: number) {
  if (!teamId) {
    this.sourcePlayer = [];
    this.targetPlayer = [];
    return;
  }

  const allItemsForTeam = this.allPlayersRaw.filter(
    (item: any) => item.team_id == teamId
  );
  const selectedPlayersForTeam = this.selectedPlayersRaw.filter(
    (item: any) => item.team_id == teamId
  );

  const selectedPlayerIdsForTeam = new Set(selectedPlayersForTeam.map((players: any) => players.player_id));
  this.sourcePlayer = allItemsForTeam.filter(
    (item: any) => !selectedPlayerIdsForTeam.has(item.player_id)
  );
  this.targetPlayer = selectedPlayersForTeam;

  const selectedTeam = this.teamsData.find(team => team.team_id === teamId);
  this.teamname = selectedTeam ? selectedTeam.team_name : '';
  this.sourceSearchKeyword = '';
  this.targetSearchKeyword = '';
  if (this.dt1) this.dt1.filterGlobal('', 'contains');
  if (this.dt2) this.dt2.filterGlobal('', 'contains');

  console.log('Source Players (filtered):', this.sourcePlayer);
  console.log('Target Players (filtered):', this.targetPlayer);
}
  public singleFilterFunction(arrayFilter: Array<any>, filterKey: string, byFilterValue: any) {
    return arrayFilter.filter((data: any) => data[filterKey] == byFilterValue)
  }
  addplayer() {
    const params: any = {};
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.team_id = this.teamID?.toString();
    params.player_id = this.player_id?.toString();
    params.player_list = this.targetPlayer.map((players: any) => players.player_id).join(',');
    this.apiService.post(this.urlConstant.compplayeradd, params).subscribe(
      (res: any) => {
        this.PlayerUpdated.emit();
        this.successToast(res);
      },
      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message
          === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() :
          this.failedToast(err.error);

      });
  }

  successToast(data: any) {

    this.msgService.add({
      severity: 'success',
      summary: 'Success',
      detail: data.message,
      data: { image: 'assets/images/default-logo.png' },
    });
  }
  /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({
      data: { image: 'assets/images/default-logo.png' },
      severity: 'error',
      summary: 'Error',
      detail: data.message
    });
  }
  updateplayer(): void {
    if (!this.selectedPlayer) {
      console.error('No team selected for update!');
      return;
    }

    const params: any = {
      client_id: this.client_id.toString(),
      user_id: this.user_id.toString(),
      team_id: this.teamID?.toString(),
      competition_id: this.CompetitionData.competition_id.toString(),
      player_id: this.selectedPlayer.player_id?.toString(),
      scorecard_name: this.ManagePlayerForm.get('scorecard_name')?.value || '',
      jersey_number: this.ManagePlayerForm.get('jersey_number')?.value || '',
    };

    params.player_list = this.targetPlayer.map((p: any) => p.player_id).join(',').toString();
    this.apiService.post(this.urlConstant.compplayerupdate, params).subscribe(
      (res: any) => {
        this.gridLoad();
        this.closeEditPopup();
      },
      (err: any) => {
        console.error('Error updating player:', err);
      }
    );
  }

  // selectTeam(id: number) {
  //   this.selectedTeamId = id;
  //   this.team_id = id;
  //   this.gridLoad();
  // }
  onMoveToTarget(event: any) {
    event.items.forEach((item: any) => {
      item.highlighted = true;
    });
  }

  onMoveAllToTarget(event: any) {
    const highlightedIds = new Set(event.items.map((squard: any) => squard.player_id));

    this.targetPlayer = this.targetPlayer.map((player: any) => {
      if (highlightedIds.has(player.player_id)) {
        return { ...player, highlighted: true };
      }
      return player;
    });
  }

  onMoveToSource(event: any) {
    event.items.forEach((item: any) => {
      item.highlighted = false;
    });
  }

  showEditPopup(player: any) {
    this.selectedPlayer = player;
    this.ManagePlayerForm.patchValue({
      player_id: player.player_id || '',
      team_id: player.team_id || '',
      scorecard_name: player.scorecard_name || '',
      jersey_number: player.jersey_number || '',
      profile_url: player.profile_url || '',
      team_name: player.team_name || '',
      display_name: player.display_name || ''

    });
    this.isEditPopupVisible = true;
  }

  closeEditPopup() {
    this.isEditPopupVisible = false;
    this.selectedPlayer = null;
  }
  TeamInTarget(player: any): boolean {
    return this.targetPlayer?.some((p: any) => p.player_id === player.player_id);
  }




  moveToSource(player: any) {
    this.targetPlayer = this.targetPlayer.filter((t: any) => t.player_id !== player.player_id);
    this.sourcePlayer.push(player);
  }

  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

  moveToTarget(player: any) {
    this.sourcePlayer = this.sourcePlayer.filter(t => t !== player);
    this.targetPlayer.push(player);
  }

  filterGlobalSource($event: any, stringVal: string) {
    this.dt1?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  filterGlobalTarget($event: any, stringVal: string) {
    this.dt2?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  clearSource(table: Table) {
    table.clear();
    this.sourceSearchKeyword = '';
  }

  clearTarget(table: Table) {
    table.clear();
    this.targetSearchKeyword = '';
  }

}
