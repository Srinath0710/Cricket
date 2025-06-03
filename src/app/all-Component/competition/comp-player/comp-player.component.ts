import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ManageDataItem } from '../competition.component';

@Component({
  selector: 'app-comp-player',
  imports: [
    PickListModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TableModule
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
  client_id: number = Number(localStorage.getItem('client_id'));
  default_img: any = 'assets/images/default-player.png';
  sourcePlayer!: [];
  targetPlayer!: [];
  teamsDropDown: any;
  initilized: boolean = false;
  selectedTeamData: any;
  selectedTeamId: number | null = null;

  team_id: any;
  user_id: number = Number(localStorage.getItem('user_id'));
  constructor(
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private messageService: MessageService,
    private cricketKeyConstant: CricketKeyConstant,
    private confirmationService: ConfirmationService
  ) { }
  ngOnInit() {

    this.gridLoad();
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
      console.log(res, this.team_id);
      this.teamsDropDown = res.data.teams ?? [];
      setTimeout(() => {
        const allItems = res.data.all_players.filter((item: any) => item.team_id == this.team_id);
        const mappedIds = res.data.selected_players.filter((item: any) => item.team_id == this.team_id).map((value: any) => value.player_id);
        this.sourcePlayer = allItems.filter((item: any) => !mappedIds.includes(item.player_id));
        this.targetPlayer = res.data.selected_players.filter((item: any) => item.team_id == this.team_id);
        console.log(this.sourcePlayer, this.targetPlayer, mappedIds)
      }, 100)

    }, (err: any) => {

    })
  }

  updateplayer() {
    const params: any = {};
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.team_id = this.team_id?.toString();
    params.player_list = this.targetPlayer.map((p: any) => p.player_id).join(',');

    this.apiService.post(this.urlConstant.compplayerupdate, params).subscribe(
      (res: any) => {
        this.gridLoad();
      },
      (err: any) => {

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
      item.highlighted = true; // Add highlight
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
  
}
