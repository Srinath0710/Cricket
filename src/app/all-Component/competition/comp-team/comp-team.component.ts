import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageDataItem } from '../competition.component';
@Component({
  selector: 'app-comp-team',
  imports: [PickListModule, CommonModule, FormsModule, ReactiveFormsModule,
  ],
  templateUrl: './comp-team.component.html',
  styleUrl: './comp-team.component.css',
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
  standalone: true

})
export class CompTeamComponent implements OnInit {
  @Input() CompetitionData: ManageDataItem={ competition_id: 0,name:'',match_type:'',gender:'',age_category:'',start_date:'',end_date:'' };
  client_id: number = Number(localStorage.getItem('client_id'));
  sourceTeams!: [];

  targetTeams!: [];
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

  gridLoad() {
    const params: any = {}
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    this.apiService.post(this.urlConstant.compTeamsList, params).subscribe((res: any) => {
      console.log(res);
      const allItems =res.data.all_teams;
      const mappedIds = res.data.selected_teams.map((value: any) => value.team_id);
      this.sourceTeams = allItems.filter((item: any) => !mappedIds.includes(item.team_id));
      this.targetTeams = res.data.selected_teams
    console.log(this.sourceTeams,this.targetTeams,mappedIds)
    }, (err: any) => {

    })
  }
  upateTeams() {
    const params: any = {}
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.team_list = this.targetTeams.map((p: any) => p.team_id).join(',').toString();
    params.competition_id = this.CompetitionData.competition_id.toString();


    this.apiService.post(this.urlConstant.compTeamsUpdate, params).subscribe((res: any) => {
      this.gridLoad();
    }, (err: any) => {

    })
  }
}
