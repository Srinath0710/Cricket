import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ManageDataItem } from '../competition.component';
import { ToastModule } from 'primeng/toast';


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
  @Input() CompetitionData: ManageDataItem = { competition_id: 0, name: '', match_type: '', gender: '', age_category: '', start_date: '', end_date: '' };
  @Output() PlayerUpdated = new EventEmitter<void>();
  client_id: number = Number(localStorage.getItem('client_id'));
  default_img= CricketKeyConstant.default_image_url.players;
  sourcePlayer!: [];
  targetPlayer!: any[];
  teamsDropDown: any;
  initilized: boolean = false;
  selectedTeamData: any;
  selectedTeamId: number | null = null;
  isEditPopupVisible = false;
  public ManagePlayerForm!: FormGroup<any>;
  statusConstants= CricketKeyConstant.status_code;

  selectedPlayer: any = null;

  team_id: any;
  player_id: any;
  user_id: number = Number(localStorage.getItem('user_id'));
  ImportMappingData: any;
  targetProducts: any;
  ImportData: any;
  constructor(
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private formBuilder: FormBuilder,
    private msgService: MessageService,
    private cricketKeyConstant: CricketKeyConstant,
    private confirmationService: ConfirmationService
  ) { }
  ngOnInit() {

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

  chooseTeam(teamId: any) {
    this.team_id = teamId;
  }

  gridLoad() {
    const params: any = {}
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    this.apiService.post(this.urlConstant.compplayerlist, params).subscribe((res: any) => {
      this.teamsDropDown = res.data.teams ?? [];
      
      setTimeout(() => {
        //     if (this.teamsDropDown.length > 0) {
        //   this.team_id = this.teamsDropDown[0].team_id;
        // }
        const allItems = res.data.all_players.filter((item: any) => item.team_id == this.team_id);
        const mappedIds = res.data.selected_players.filter((item: any) => item.team_id == this.team_id).map((value: any) => value.player_id);
        this.sourcePlayer = allItems.filter((item: any) => !mappedIds.includes(item.player_id));
        this.targetPlayer = res.data.selected_players.filter((item: any) => item.team_id == this.team_id);
        console.log(this.sourcePlayer, this.targetPlayer, mappedIds)
      }, 100)

    }, (err: any) => {

    })
  }

  addplayer() {
    const params: any = {};
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.team_id = this.team_id?.toString();
    params.player_id = this.player_id?.toString();
    params.player_list = this.targetPlayer.map((p: any) => p.player_id).join(',');

    this.apiService.post(this.urlConstant.compplayeradd, params).subscribe(
      (res: any) => {
        this.PlayerUpdated.emit();
      },
      (err: any) => {
          err.status_code === this.statusConstants.refresh && err.error.message
           === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() :
            this.failedToast(err.error);

      });
  }

     /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }

  updateplayer(): void {
    if (!this.selectedPlayer) {
      console.error('No team selected for update!');
      return;
    }

    const params: any = {
      client_id: this.client_id.toString(),
      user_id: this.user_id.toString(),
      team_id: this.team_id?.toString(),
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

  selectTeam(id: number) {
    this.selectedTeamId = id;
    this.team_id = id;
    this.gridLoad();
  }
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
      item.highlighted = false; // Remove highlight
    });
  }
  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
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

}
