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
import { ToastService } from '../../../services/toast.service';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-comp-team',
  imports: [
    PickListModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    TooltipModule,
    DialogModule

  ],
  templateUrl: './comp-team.component.html',
  styleUrl: './comp-team.component.css',
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService },
    { provide: ToastService },
  ],
  standalone: true

})
export class CompTeamComponent implements OnInit {
  [x: string]: any;
  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;
  @Input() CompetitionData: ManageDataItem = { competition_id: 0, name: '', match_type: '', gender: '', age_category: '', start_date: '', end_date: '', tour_type: '', trophy_name: '', client_id: 0 };
  @Output() TeamUpdate = new EventEmitter<void>();
  client_id: number = 0;
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
  selectedTeams: any = [];
  viewDialogVisible: boolean = false;
  rows: number = 10;
  totalData: any = 0;
  pageData: number = 0;
  first: number = 0;

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
    params.client_id = this.CompetitionData.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.search_text = this.sourceSearchKeyword.toString(),
      params.records = this.rows.toString();
    params.page_no = (Math.floor(this.first / this.rows) + 1).toString();
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
        this.totalData = res.data.all_teams[0]
        this.spinnerService.raiseDataEmitterEvent('off');
      },

      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.spinnerService.raiseDataEmitterEvent('off'), this.sourceTeams = [], this.targetTeams = []);
      });
      this.spinnerService.raiseDataEmitterEvent('off');
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
    params.client_id = this.CompetitionData.client_id.toString();
    params.user_id = this.user_id.toString();
    params.team_list = this.targetTeams.map((p: any) => p.team_id).join(',').toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    this.apiService.post(this.urlConstant.compTeamadd, params).subscribe((res: any) => {
      // this.TeamUpdate.emit();
      this.gridLoad();
      this.successToast(res);
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

  updateTeam(): void {
    if (!this.selectedTeam) {
      console.error('No team selected for update!');
      return;
    }
    const params: any = {
      client_id: this.CompetitionData.client_id.toString(),
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

  successToast(data: any) {
    this.toastService.successToast({ message: data.message })
  }
  /* Failed Toast */
  failedToast(data: any) {
    this.toastService.failedToast({ message: data.message })
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
  onViewteam(teamsid: number) {
    const params = {
      team_id: teamsid.toString(),
      client_id: this.CompetitionData.client_id?.toString(),
      user_id: String(this.user_id)
    };

    this.apiService.post(this.urlConstant.viewgroundTeams, params).subscribe({
      next: (res) => {
        if (res.status_code && res.data) {
          this.selectedTeams = res.data.teams;
          this.selectedTeams.forEach((teams: any) => {
            teams.profile_img = teams.profile_img + '?' + Math.random();
          });
          this.viewDialogVisible = true;
        }
      },
      error: (err) => {
        console.error('Failed to fetch ground details', err);
      }
    });
  }
  getTeamNameParts(fullName: string): { name: string, category: string } {
    const match = fullName.match(/^([^(]+)\s*(\(.*\))?$/);
    return {
      name: match?.[1]?.trim() || '',
      category: match?.[2] || ''
    };
  }
  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.gridLoad();
  }
}
