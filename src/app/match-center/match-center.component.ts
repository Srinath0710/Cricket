import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { ApiService } from '../services/api.service';
import { FilterMatchModel } from './match.center.model';
import { CompetitionModel } from './match.center.model';
import { MatchSummaryModel } from './match.center.model';
import { ScheduleModel } from './match.center.model';
import { BattingSummaryModel } from './match.center.model';
import { BowlingSummaryModel } from './match.center.model';
import { FallOfWicketModel } from './match.center.model';
import { SeasonModel } from './match.center.model';
import { MatchPointsComponent } from './match-points/match-points.component';
// import { ScrecardPointsComponent } from './screcard-points/screcard-points.component';
import { RouterModule } from '@angular/router';
/*---Component -- */
@Component({
  selector: 'app-match-center',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    PaginatorModule,
    RouterModule,
    MatchPointsComponent,
  ],
  templateUrl: './match-center.component.html',
  styleUrls: ['./match-center.component.css']
})
export class MatchCenterComponent implements OnInit {

  /*- Pagination config -- */
  rows: number = 6;         // items per page for match cards
  first: number = 0;        // current first index for pagination

  pointsRows: number = 2;   // items per page for points list
  pointsFirst: number = 0;  // first index for points pagination

  /*--- Filter selected values    -- */
  competitionId: number | 0 = 0;
  selectedMatchType: string | null = null;
  selectedStatus: string | null = null;
  selectedGender: string | null = null;
  selectedAgeGroup: string | null = null;
  selectedTeamFormat: string | null = null;

  /*-- Dropdown option arrays -- */
  genders: any[] = [];
  ageGroups: any[] = [];
  matchTypes: any[] = [];
  teamFormats: any[] = [];
  statuses = [
    { label: 'All Status', value: null },
    { label: 'InProgress', value: 'InProgress' },
    { label: 'Upcoming', value: 'Upcoming' },
    { label: 'Completed', value: 'Completed' }
  ];

  /*--- Raw JSON storages (from API/mock)-- */
  filters: any[] = [];
  competitions: any[] = [];
  matchSummaryRaw: any[] = [];
  schedulesRaw: any[] = [];
  battingSummaryRaw: any[] = [];
  bowlingSummaryRaw: any[] = [];
  fowRaw: any[] = [];
  seasonsRaw: any[] = [];

  /*--- Typed/processed lists used by template   -- */
  /* Typed/processed lists */
  matchescard: FilterMatchModel[] = [];
  matchespoints: CompetitionModel[] = [];
  matchSummaries: MatchSummaryModel[] = [];
  schedulesList: ScheduleModel[] = [];
  battingSummaries: BattingSummaryModel[] = [];
  bowlingSummaries: BowlingSummaryModel[] = [];
  fallOfWickets: FallOfWicketModel[] = [];
  Season: SeasonModel[] = [];

  /*--- Points form  -- */
   ShowPointsForm: boolean = false;
  pointsForm: FormGroup;
  activePage: string = 'matches';
  isShowPage: boolean = true;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    // create empty reactive form for points UI (fields to be added as per requirements)
    this.pointsForm = this.fb.group({});
  }

  /*---Ngonit-- */
  ngOnInit(): void {
    // Load options & mock data
    this.loadFilterOptionsFromMock();
    this.loadCompetitionsFromMock();
    this.loadMatchSummariesFromMock();

  }
  /* Filters: populate dropdowns */
  loadFilterOptionsFromMock(): void {
    this.apiService.getMockData('assets/mock_data/filters.json').subscribe(data => {
      this.filters = data;
      this.genders = [{ label: 'All Gender', value: null }, ...this.filters.filter(f => f.config_key === 'gender').map(f => ({ label: f.config_value, value: f.config_value }))];
      this.ageGroups = [{ label: 'All Age Groups', value: null }, ...this.filters.filter(f => f.config_key === 'age_category').map(f => ({ label: f.config_value, value: f.config_value }))];
      this.teamFormats = [{ label: 'All Team Formats', value: null }, ...this.filters.filter(f => f.config_key === 'team_format').map(f => ({ label: f.config_value, value: f.config_value }))];
      this.matchTypes = [{ label: 'All Match Types', value: null }, ...this.filters.filter(f => f.config_key === 'comp_type').map(f => ({ label: f.config_value, value: f.config_value }))];
      this.statuses = [{ label: 'All Statuses', value: null }, ...this.filters.filter(f => f.config_key === 'status').map(f => ({ label: f.config_value, value: f.config_value }))];
    });
  }

  /* Competitions */
  loadCompetitionsFromMock(): void {
    this.apiService.getMockData('assets/mock_data/compitation.json').subscribe(data => {
      this.competitions = data;
      this.matchespoints = this.competitions.map(c => new CompetitionModel({
        competition_id: c.competition_id,
        competition_name: c.competition_name,
        start_date: new Date(c.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        end_date: new Date(c.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        comp_type: c.comp_type,
        gender: c.gender,
        age_category: c.age_category,
        status: c.status,
        team_format: c.team_format
      }));
    });
  }

  /* Match summaries */
  loadMatchSummariesFromMock(): void {
    this.apiService.getMockData('assets/mock_data/matchsumary.json').subscribe(data => {
      this.matchSummaryRaw = data;
      this.matchSummaries = this.matchSummaryRaw.map(m => new MatchSummaryModel({
        match_id: m.match_id,
        competition_name: m.competition_name,
        team_1_name: m.team_1_name,
        team_2_name: m.team_2_name,
        team_1_summary: m.team_1_summary,
        team_2_summary: m.team_2_summary,
        venue: m.venue,
        match_start_date: new Date(m.match_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        match_end_date: new Date(m.match_end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        // match_result: m.match_result,
        comp_type: m.comp_type,
        match_result: this.deriveStatusFromResult(m.match_result)
      }));
    });
  }


  // API/JSON la varra status values normalize panra function
  // private normalizeStatus(status: string | null | undefined): string {
  //   if (!status) return 'Upcoming';  // status illa → Upcoming

  //   switch (status.toLowerCase()) {
  //     case 'completed': return 'Completed';   // completed ah irundha
  //     case 'inprogress': return 'inprogress';       // inprogress ah irundha
  //     case 'upcoming': return 'Upcoming';     // upcoming ah irundha
  //     default: return 'Upcoming';             // vera yedhum na Upcoming
  //   }
  // }

  /*---Filtered match-cards computed property (applies all selected filters)-- */
  get filteredMatches(): CompetitionModel[] {
    return this.matchespoints.filter(match =>
      (!this.selectedStatus || match.status === this.selectedStatus) &&
      (!this.selectedGender || match.gender === this.selectedGender) &&
      (!this.selectedAgeGroup || match.age_category === this.selectedAgeGroup) &&
      (!this.selectedMatchType || match.comp_type === this.selectedMatchType) &&
      (!this.selectedTeamFormat || match.team_format === this.selectedTeamFormat)
    );
  }

  /*--- Pagination change handler -- */
  onPageChange(event: any): void {
    // event has { first, rows } from p-paginator
    this.first = event.first;
    this.rows = event.rows;
  }

  get paginatedMatches(): CompetitionModel[] {
    return this.filteredMatches.slice(this.first, this.first + this.rows);
  }

  /*--- Points pagination change handler -- */
  onPointsPageChange(event: any): void {
    this.pointsFirst = event.first;
    this.pointsRows = event.rows;
  }

  changeTab(page: string) {
    this.activePage = page;
  }

  showPointsForm(competitionId: number, matchType?: string): void {
    this.competitionId = competitionId;
    this.selectedMatchType = matchType || null;
    // this.ShowPointsForm = true;
        // console.log('POINSjhfu')
    this.pointsForm.reset();
    this.changeTab('points');
  }

  closePointsForm(event: boolean): void {
  console.log('Parent: hideMatches emitted ->', event);
    // this.ShowPointsForm = event;

  this.selectedMatchType = null;
  this.changeTab('matches');
  // You can also set ShowPointsForm = false if needed
  // this.ShowPointsForm = event;
}

  /*--- Helper to check whether any points data exists for a series-- */
  hasPoints(competitionId: number): boolean {
    return this.matchespoints.some(match => match.competition_id === competitionId);
  }

  /*---Count match types in a series (returns object like { 'T20': 2, 'ODI': 1 })-- */
  // Add this new method inside your MatchCenterComponent class
  getMatchTypeCounts(competitionId: number): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    this.matchSummaryRaw
      .filter(match => match.competition_id === competitionId)
      .forEach(match => {
        const type = match.comp_type;
        counts[type] = (counts[type] || 0) + 1;
      });
    return counts;
  }
  /*---Total number of match cards after filters applied-- */
  get totalData(): number {
    return this.filteredMatches.length;
  }

  // Match result text la irundhu status decide panra function
  private deriveStatusFromResult(result: string | null | undefined): string {
    if (!result) return 'Upcoming';  // result illa → Upcoming
    const lowered = result.toLowerCase();  // small letter ku convert panrom
    if (lowered.includes('won') || lowered.includes('draw')) return 'Completed';  // 'won' illa 'draw' irundha → Completed
    // illati → Live
    return 'inprogress';
  }
}
