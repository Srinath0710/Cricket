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
import { Tooltip } from 'primeng/tooltip';
import { ToastService } from '../../../services/toast.service';
import { Dialog } from "primeng/dialog";
interface Team {
  team_id: number;
  team_name: string;
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
    ToastModule,
    Tooltip,
    Dialog
  ],
  templateUrl: './comp-player.component.html',
  styleUrl: './comp-player.component.css',
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService },
    { provide: ToastService },
  ],
  standalone: true
})

export class CompPlayerComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;
  @Input() CompetitionData: ManageDataItem = { competition_id: 0, name: '', match_type: '', gender: '', age_category: '', start_date: '', end_date: '', tour_type: '', trophy_name: '', client_id: 0 };
  @Output() PlayerUpdated = new EventEmitter<void>();
  client_id: number = 0;
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
  rows: number = 10;
  totalData: any = 0;
  pageData: number = 0;
  first: number = 0;
  groundData = []
  allPlayersRaw: any[] = [];
  selectedPlayersRaw: any[] = [];
  showFilters: boolean = false;
  selectedPlayers: any[] = [];
  viewDialogVisible: boolean = false;
  PlayerData: any[] = [];

  searchKeyword: string = '';
  filterStatus: string = '';
  filterPlayerType: string = '';
  filterGenderType: string = '';
  filterBatType: string = '';
  filterBowlType: string = '';
  filterClubType: string = '';
  filterBattingOrder: string = '';
  filterBowlStyle: string = '';

  showSourceFilters: boolean = false;
  showTargetFilters: boolean = false;

  // default_img = CricketKeyConstant.default_image_url.players;
  men_img = CricketKeyConstant.default_image_url.menimg;
  women_img = CricketKeyConstant.default_image_url.womenimg;


  constructor(
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private formBuilder: FormBuilder,
    private msgService: MessageService,
    private cricketKeyConstant: CricketKeyConstant,
    private confirmationService: ConfirmationService,
    private spinnerService: SpinnerService,
    private toastService: ToastService

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
      display_name: [''],
      team_name: ['', []]
    });
  }
  chooseTeam(team_id: any) {
    if (this.teamID === team_id) {
      return;
    }

    this.teamID = team_id;
    this.spinnerService.raiseDataEmitterEvent('on');
    this.filterPlayersByTeam(this.teamID);
    this.spinnerService.raiseDataEmitterEvent('off');
  }

  gridLoad(applyFilters: boolean = false) {
    this.spinnerService.raiseDataEmitterEvent('on');
    const params: any = {};
    params.client_id = this.CompetitionData.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.search_text = this.sourceSearchKeyword.toString(),
      params.page_no = this.first.toString(),
      params.records = this.rows.toString()

    if (applyFilters) {
      if (this.filterStatus) {
        params.status = this.filterStatus;
      }
      if (this.filterPlayerType) {
        params.player_type = this.filterPlayerType;
      }
      if (this.filterGenderType) {
        params.gender_type = this.filterGenderType;
      }
      if (this.filterBatType) {
        params.bat_type = this.filterBatType;
      }
      if (this.filterBowlType) {
        params.bowl_type = this.filterBowlType;
      }
      if (this.filterClubType) {
        params.club_type = this.filterClubType;
      }
      if (this.filterBattingOrder) {
        params.batting_order = this.filterBattingOrder;
      }
      if (this.filterBowlStyle) {
        params.bowl_style = this.filterBowlStyle;
      }
    }

    this.apiService.post(this.urlConstant.compplayerlist, params).subscribe(
      (res: any) => {
        this.teamsDropDown = res.data.teams ?? [];
        this.teamsData = res.data.teams != undefined ? res.data.teams : [];
        this.allPlayersRaw = res.data.all_players ?? [];
        this.selectedPlayersRaw = res.data.selected_players ?? [];
        this.totalData = res.data.all_players[0].total_records
        if (this.teamsData.length > 0) {
          this.teamID = this.teamsData[0].team_id;
        }
        this.filterPlayersByTeam(this.teamID);
        this.spinnerService.raiseDataEmitterEvent('off');
      },
      (err: any) => {
        this.spinnerService.raiseDataEmitterEvent('off');
        this.sourcePlayer = [];
        this.targetPlayer = []
        this.failedToast(err.error);
      }
    );
  }
  filterPlayersByTeam(teamId: number) {
    if (!teamId) {
      this.sourcePlayer = this.allPlayersRaw;
      this.targetPlayer = [];
      return;
    }
    const allItemsForTeam = this.allPlayersRaw
    const selectedPlayersForTeam = this.selectedPlayersRaw.filter(
      (item: any) => item.team_id == teamId
    );
    const selectedPlayerIdsForTeam = new Set(this.selectedPlayersRaw.map((players: any) => players.player_id));
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
  }
  public singleFilterFunction(arrayFilter: Array<any>, filterKey: string, byFilterValue: any) {
    return arrayFilter.filter((data: any) => data[filterKey] == byFilterValue)
  }
  addplayer() {
    const params: any = {};
    params.client_id = this.CompetitionData.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.team_id = this.teamID?.toString();
    params.player_id = this.player_id?.toString();
    params.player_list = this.targetPlayer.map((players: any) => players.player_id).join(',');
    this.apiService.post(this.urlConstant.compplayeradd, params).subscribe(
      (res: any) => {
        // this.PlayerUpdated.emit();
        this.gridLoad();
        this.successToast(res);
      },
      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message
          === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() :
          this.failedToast(err.error);

      });
  }

  successToast(data: any) {
    this.toastService.successToast({ message: data.message })
  }
  /* Failed Toast */
  failedToast(data: any) {
    this.toastService.failedToast({ message: data.message })
  }
  updateplayer(): void {
    if (!this.selectedPlayer) {
      console.error('No team selected for update!');
      return;
    }
    const params: any = {
      client_id: this.CompetitionData.client_id.toString(),
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
        if (
          err.status_code === this.statusConstants.refresh &&
          err.error.message === this.statusConstants.refresh_msg
        ) {
          this.apiService.RefreshToken();
        }
        this.spinnerService.raiseDataEmitterEvent('off');
        this.failedToast(err.error);
      })
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
      display_name: player.player_name || player.display_name,
    });
    this.isEditPopupVisible = true;
  }

  closeEditPopup() {
    this.isEditPopupVisible = false;
    this.selectedPlayer = null;
  }
  moveToSource(player: any) {
    this.targetPlayer = this.targetPlayer.filter((t: any) => t.player_id !== player.player_id);
    player.display_name = player.player_name || player.display_name;
    this.sourcePlayer.push(player);
    this.updateCounts();
  }

  TeamInTarget(player: any): boolean {
    return this.targetPlayer?.some((t: any) => t.team_id === player.team_id);
  }
  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

  moveToTarget(player: any) {
    this.sourcePlayer = this.sourcePlayer.filter(t => t !== player);
    player.player_name = player.player_name || player.display_name;
    this.targetPlayer.push(player);
    this.updateCounts();
  }

  updateCounts() {
    this.totalData = this.sourcePlayer.length + this.targetPlayer.length;
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
  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.gridLoad();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    // this.showFilters = false;
  }
  applyFilters() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.first = 1;
    this.gridLoad();
    this.showFilters = false;
    this.msgService.add({
      severity: 'info',
      summary: 'Filters Applied',
      data: { image: 'assets/images/default-logo.png' },
      detail: 'Player list has been filtered'
    });
  }

  clearFilters() {
    this.filterStatus = '';
    this.filterPlayerType = '';
    this.filterGenderType = '';
    this.filterBatType = '';
    this.filterBowlType = '';
    this.searchKeyword = '';
    this.first = 1;
    // this.gridLoad();
    // this.msgService.add({
    //   severity: 'info',
    //   summary: 'Filters Cleared',
    //   data: { image: 'assets/images/default-logo.png' },
    //   detail: 'Filters has been Cleared'
    // });
  }

  CancelFilters() {
    this.showSourceFilters = false;
    this.showTargetFilters = false;
  }

  toggleSourceFilters() {
    this.showSourceFilters = !this.showSourceFilters;
    this.showTargetFilters = false; // Close the other filter
  }

  toggleTargetFilters() {
    this.showTargetFilters = !this.showTargetFilters;
    this.showSourceFilters = false; // Close the other filter
  }

  onViewPlayer(playersid: number) {
    const params = {
      player_id: playersid.toString(),
      client_id: this.CompetitionData.client_id?.toString(),
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

  //   get visibleRecords(): number {
  //   return this.PlayerData?.length || 0;
  // }


}
