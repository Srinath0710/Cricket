import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManageDataItem } from '../competition.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-comp-team',
  imports: [PickListModule, CommonModule, FormsModule, ReactiveFormsModule, ToastModule
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
  @Input() CompetitionData: ManageDataItem = { competition_id: 0, name: '', match_type: '', gender: '', age_category: '', start_date: '', end_date: '' };
  client_id: number = Number(localStorage.getItem('client_id'));
  sourceTeams!: [];
  targetTeams!: [];
  user_id: number = Number(localStorage.getItem('user_id'));
  team_id: any;
  public compTeamsList = [];
  public ManageTeamsForm!: FormGroup;
  isEditPopupVisible = false;
  selectedTeam: any = null;
  default_img = CricketKeyConstant.default_image_url.teamimage;
  statusConstants = CricketKeyConstant.status_code;
  teams: any[] = []
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
    this.ManageTeamsForm = this.formBuilder.group({
      team_name: [''],
      team_id: ['', [Validators.required]],
      ground_list: ['', []],
      client_id: ['', [Validators.required]],
      competition_id: ['', [Validators.required]],
      sponser_name: ['', [Validators.required]],
      scorecard_name: ['', [Validators.required]],
      profile_url: [''],
    })
  }

  gridLoad() {
    const params: any = {};
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    this.apiService.post(this.urlConstant.compTeamsList, params).subscribe(
      (res: any) => {
        const allItems = res.data.all_teams.map((val: any) => ({
          ...val,
          scorecard: ''
        }));
        const mappedIds = res.data.selected_teams.map((value: any) => value.team_id);
        this.sourceTeams = allItems.filter((item: any) => !mappedIds.includes(item.team_id));
        this.targetTeams = res.data.selected_teams.map((val: any) => ({
          ...val,
          scorecard: val.team_name || ''
        }));

      },

      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.sourceTeams = [], this.targetTeams = []);
      });


  }
  AddTeam() {
    const params: any = {}
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.team_list = this.targetTeams.map((p: any) => p.team_id).join(',').toString();
    params.competition_id = this.CompetitionData.competition_id.toString();


    this.apiService.post(this.urlConstant.compTeamadd, params).subscribe((res: any) => {
      this.gridLoad();
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });
  }
  updateTeam(): void {
    if (!this.selectedTeam) {
      console.error('No team selected for update!');
      return;
    }

    const params: any = {
      client_id: this.client_id.toString(),
      user_id: this.user_id.toString(),
      competition_id: this.CompetitionData.competition_id.toString(),
      team_id: this.selectedTeam.team_id?.toString(),
      scorecard_name: this.ManageTeamsForm.get('scorecard_name')?.value || '',
      sponser_name: this.ManageTeamsForm.get('sponser_name')?.value || '',
    };
    this.apiService.post(this.urlConstant.compTeamsUpdate, params).subscribe(
      (res: any) => {
        this.closeEditPopup();
      },
      (err: any) => {
        console.error('Error updating team:', err);
      }
    );
  }
  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

  }

  /* Failed Toast */
  failedToast(data: any) {
    console.log(data)
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }
  onMoveToTarget(event: any) {
    event.items.forEach((item: any) => {
      item.highlighted = true;
    });
  }

  onMoveToSource(event: any) {
    event.items.forEach((item: any) => {
      item.highlighted = false;
    });
  }

  /* For Edit button hidden in target teams*/
  TeamInTarget(teams: any): boolean {
    return this.targetTeams?.some((t: any) => t.team_id === teams.team_id);
  }
  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }


  showEditPopup(team: any) {
    this.isEditPopupVisible = true;
    this.selectedTeam = team;
    this.ManageTeamsForm.patchValue({
      scorecard_name: team.scorecard_name || '',
      sponser_name: team.sponser_name || '',
      team_id: team.team_id || '',
      team_name: team.team_name || '',
    });
  }

  closeEditPopup() {
    this.isEditPopupVisible = false;
    this.selectedTeam = null;
  }
}
