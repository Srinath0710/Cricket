

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { CompetitionModel, ScheduleModel } from '../match.center.model';
import { ScrecardPointsComponent } from "../screcard-points/screcard-points.component";
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-match-points',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    RouterModule, ScrecardPointsComponent],
  templateUrl: './match-points.component.html',
  styleUrl: './match-points.component.css'
})


export class MatchPointsComponent {

    ngOnInit(): void {
    this.loadSchedulesFromMock();
  }

  ShowPointsForm: boolean = true;
  pointsForm: FormGroup;

  pointsRows: number = 2;
  pointsFirst: number = 0;

  schedulesList: ScheduleModel[] = [];

  showScorecard = false;
  selectedMatch: any = null;
  competitionId: any;
  matchespoints: any;
  selectedMatchType: any;

  schedulesRaw: any;
  activePage: string='points';

  constructor(private fb: FormBuilder,private apiService:ApiService) {
    this.pointsForm = this.fb.group({});
  }

  changeTab(page: string) {
    this.activePage = page;
  }
  onPointsPageChange(event: any): void {
    this.pointsFirst = event.first;
    this.pointsRows = event.rows;
  }

  closePointsForm(): void {
    this.ShowPointsForm = false;
     this.changeTab('matches');
  }

 openScorecard(match: any) {
  this.selectedMatch = match;
  this.activePage = 'scorecard';

  }
  /*---Points-list filtering based on selected series & matchType-- */
  get filteredPointsMatches(): CompetitionModel[] {
    if (!this.competitionId) return [];
    return this.matchespoints.filter((match: any) =>
      match.competition_id === this.competitionId &&
      (!this.selectedMatchType || match.matchType === this.selectedMatchType)
    );
  }


  get paginatedPointsMatches(): CompetitionModel[] {
    return this.filteredPointsMatches.slice(this.pointsFirst, this.pointsFirst + this.pointsRows);
  }

    private deriveStatusFromResult(result: string | null | undefined): string {
    if (!result) return 'Upcoming';  // result illa → Upcoming
    const lowered = result.toLowerCase();  // small letter ku convert panrom
    if (lowered.includes('won') || lowered.includes('draw')) return 'Completed';  // 'won' illa 'draw' irundha → Completed
    // illati → Live
    return 'Live';
  }
  
  /* Schedules */
  loadSchedulesFromMock(): void {
    this.apiService.getMockData('assets/mock_data/schedules.json').subscribe(data => {
      this.schedulesRaw = data;
      this.schedulesList = this.schedulesRaw.map((s:any) => new ScheduleModel({
        matchId: s.match_id,
        competitionName: s.competition_name,
        teamA: s.team_1_name,
        teamB: s.team_2_name,
        teamASummary: s.team_1_summary,
        teamBSummary: s.team_2_summary,
        venue: s.venue,
        startDate: new Date(s.match_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        endDate: new Date(s.match_end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        result: s.match_result,
        matchType: s.comp_type,
        status: this.deriveStatusFromResult(s.match_result),
        teamFormat: s.team_format,
        gender: s.gender,
        ageCategory: s.age_category
      }));
    });
  }


}




