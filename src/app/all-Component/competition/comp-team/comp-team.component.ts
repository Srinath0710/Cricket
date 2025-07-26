import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManageDataItem } from '../competition.component';
import { ToastModule } from 'primeng/toast';
import { SpinnerService } from '../../../services/Spinner/spinner.service';
import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-comp-team',
  imports: [PickListModule,
    CommonModule, FormsModule, ReactiveFormsModule, ToastModule,
    TableModule, TooltipModule

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
  [x: string]: any;
  @ViewChild('dt1') dt1: Table | undefined;
 @ViewChild('dt2') dt2: Table  | undefined;
  @Input() CompetitionData: ManageDataItem = { competition_id: 0, name: '', match_type: '', gender: '', age_category: '', start_date: '', end_date: '', tour_type: '', trophy_name: '' };
  @Output() TeamUpdate = new EventEmitter<void>();
  client_id: number = Number(localStorage.getItem('client_id'));
  user_id: number = Number(localStorage.getItem('user_id'));
  team_id: any;
  public compTeamsList = [];
  public ManageTeamsForm!: FormGroup;
  isEditPopupVisible = false;
  selectedTeam: any = null;
  default_img = CricketKeyConstant.default_image_url.teamimage;
  statusConstants = CricketKeyConstant.status_code;
  teams: any[] = []
  popUpTeamList: any[] = [];
  targetTeams: any[] = [];
  sourceTeams: any[] = [];
  searchText: string = '';
  filteredTeams: any[] = [];
 sourceSearchKeyword: string = '';
  targetSearchKeyword: string = '';

  constructor(
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private formBuilder: FormBuilder,
    private msgService: MessageService,
    private cricketKeyConstant: CricketKeyConstant,
    private confirmationService: ConfirmationService,
    private spinnerService: SpinnerService,
  ) { }
  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');
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
    this.spinnerService.raiseDataEmitterEvent('on');
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
        this.spinnerService.raiseDataEmitterEvent('off');
      },

      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.spinnerService.raiseDataEmitterEvent('off'), this.sourceTeams = [], this.targetTeams = []);
      });
  }

  popUpTeamsData() {
    this.spinnerService.raiseDataEmitterEvent('on');
    setTimeout(() => {
      this.popUpTeamList = this.sourceTeams;
      this.spinnerService.raiseDataEmitterEvent('off');

    }, 100)
  }
  // filterTeams() {
  //   const search = this.searchText.toLowerCase();
  //   this.filteredTeams = this.teams.filter(team =>
  //     team.team_name.toLowerCase().includes(search)
  //   );
  // }

  // clearSearch() {
  //   this.searchText = '';
  //   this.filteredTeams = [...this.teams];
  // }

  AddTeam() {
    const params: any = {}
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.team_list = this.targetTeams.map((p: any) => p.team_id).join(',').toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    this.apiService.post(this.urlConstant.compTeamadd, params).subscribe((res: any) => {
      this.TeamUpdate.emit();
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
  onMoveToTarget(event: any) {
    event.items.forEach((item: any) => {
      item.highlighted = true;
    });
  }

  moveToSource(team: any) {
    this.targetTeams = this.targetTeams.filter((t: any) => t.team_id !== team.team_id);
    this.sourceTeams.push(team);
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
  moveToTarget(team: any) {
    this.sourceTeams = this.sourceTeams.filter(t => t !== team);
    this.targetTeams.push(team);
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
