import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { ApiService } from '../services/api.service';

/*--Interfaces (type safety) -- */
interface FilterMatch {
  series: string;
  startDate: string;
  endDate: string;
  matchType: string;
  gender: string;
  ageGroup: string;
  status: string;
  teamFormat?: string;
}

interface Competition {
  series: string;
  dateTime: string;
  stadium: string;
  location: string;
  matchType: string;
  teamA: any;
  teamB: any;
  resultStatus: string;
  type: string; // live/upcoming/result
}

interface MatchSummary {
  matchId: string;
  competitionName: string;
  teamA: string;
  teamB: string;
  teamASummary: string;
  teamBSummary: string;
  venue: string;
  startDate: string;
  endDate: string;
  result: string;
  matchType: string;
  status: string;
}

interface Schedule {
  matchId: string;
  competitionName: string;
  teamA: string;
  teamB: string;
  teamASummary: string;
  teamBSummary: string;
  venue: string;
  startDate: string;
  endDate: string;
  result: string;
  matchType: string;
  status: string;
  teamFormat: string;
  gender: string;
  ageCategory: string;
}

interface BattingSummary {
  matchId: string;
  inningsNo: string;
  battingTeam: string;
  playerId: string;
  playerName: string;
  battingOrder: number;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  wicketDesc?: string | null;
}

interface BowlingSummary {
  matchId: string;
  inningsNo: string;
  bowlingTeam: string;
  playerId: string;
  playerName: string;
  bowlingOrder: number;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  foursConceded: number;
  sixesConceded: number;
  dotBalls: number;
  strikeRate?: number;
}

interface FallOfWicket {
  matchId: string;
  inningsNo: string;
  battingTeam: string;
  wicketNo: number;
  teamTotal: number;
  overValue: number;
  playerId: string;
  playerName: string;
  wicketDesc: string;
}

interface Season {
  current: string;
  season_value: string;
  season_id: string;
}

/*---Component -- */

@Component({
  selector: 'app-match-center',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownModule, PaginatorModule],
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

  selectedSeries: string | null = null;
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
    { label: 'Live', value: 'Live' },
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

  /*--- Typed/processed lists used by template   *-- */

  matchescard: FilterMatch[] = [];
  matchespoints: Competition[] = [];
  matchSummaries: MatchSummary[] = [];
  schedulesList: Schedule[] = [];
  battingSummaries: BattingSummary[] = [];
  bowlingSummaries: BowlingSummary[] = [];
  fallOfWickets: FallOfWicket[] = [];
  Season: Season[] = [];

  /*--- Points form  -- */
  ShowPointsForm: boolean = false;
  pointsForm: FormGroup;

  /*--- Scorecard UI -- */
  showScorecard = false;
  selectedMatch: any = null;
  activeTab = 'scorecard';
  teamAbatting: any[] = [];
  teamBbatting: any[] = [];
  teamAbowling: any[] = [];
  teamBbowling: any[] = [];
  teamAsquad: any[] = [];
  teamBsquad: any[] = [];
  activeinnings: string = 'one';
  activeInnings: string = 'testone';

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    // create empty reactive form for points UI (fields to be added as per requirements)
    this.pointsForm = this.fb.group({});
  }

  /*---Ngonit-- */
  ngOnInit(): void {
    // Load options & mock data
    this.loadFilterOptionsFromMock();
    this.loadCompetitionsFromMock();
    this.loadMatchesPointsFromMock();
    this.loadMatchSummariesFromMock();
    this.loadSchedulesFromMock();
    this.loadBattingSummariesFromMock();
    this.loadBowlingSummariesFromMock();
    this.loadFallOfWicketsFromMock();
    this.loadSeasonsFromMock();
  }

  /*---Filters: read filters.json and populate dropdowns -- */
  loadFilterOptionsFromMock(): void {
    this.apiService.getMockData('assets/mock_data/filters.json').subscribe(data => {
      this.filters = data;
      // Build the dropdown arrays with "All" item as first element
      this.genders = [{ label: 'All Gender', value: null }, ...this.filters.filter((f: any) => f.config_key === 'gender').map((f: any) => ({ label: f.config_value, value: f.config_value }))];
      this.ageGroups = [{ label: 'All Age Groups', value: null }, ...this.filters.filter((f: any) => f.config_key === 'age_category').map((f: any) => ({ label: f.config_value, value: f.config_value }))];
      this.teamFormats = [{ label: 'All Team Formats', value: null }, ...this.filters.filter((f: any) => f.config_key === 'team_format').map((f: any) => ({ label: f.config_value, value: f.config_value }))];
      this.matchTypes = [{ label: 'All Match Types', value: null }, ...this.filters.filter((f: any) => f.config_key === 'comp_type').map((f: any) => ({ label: f.config_value, value: f.config_value }))];
    });
  }

  /*---Competitions: map competition JSON to match cards used in UI-- */
  loadCompetitionsFromMock(): void {
    this.apiService.getMockData('assets/mock_data/compitation.json').subscribe(data => {
      this.competitions = data;
      this.matchescard = this.competitions.map((c: any) => ({
        series: c.competition_name,
        startDate: new Date(c.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        endDate: new Date(c.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        matchType: c.comp_type,
        gender: c.gender,
        ageGroup: c.age_category,
        status: this.normalizeStatus(c.status),
        teamFormat: c.team_format
      }));
    });
  }

  /*---
   *  Matches points list: load more detailed competition entries (for points view)-- */
  loadMatchesPointsFromMock(): void {
    this.apiService.getMockData('assets/mock_data/compitation.json').subscribe(data => {
      this.matchespoints = data.map((c: any) => ({
        series: c.competition_name,
        dateTime: new Date(c.start_date).toLocaleString('en-GB'),
        stadium: c.stadium || '',
        location: c.location || '',
        matchType: c.comp_type,
        teamA: c.teamA || null,
        teamB: c.teamB || null,
        resultStatus: c.resultStatus || '',
        type: this.normalizeStatus(c.status)
      }));
    });
  }

  /*---
   *  Match summaries: map matchsummary mock into typed objects-- */
  loadMatchSummariesFromMock(): void {
    this.apiService.getMockData('assets/mock_data/matchsumary.json').subscribe(data => {
      this.matchSummaryRaw = data;
      this.matchSummaries = this.matchSummaryRaw.map((m: any) => ({
        matchId: m.match_id,
        competitionName: m.competition_name,
        teamA: m.team_1_name,
        teamB: m.team_2_name,
        teamASummary: m.team_1_summary,
        teamBSummary: m.team_2_summary,
        venue: m.venue,
        startDate: new Date(m.match_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        endDate: new Date(m.match_end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        result: m.match_result,
        matchType: m.comp_type,
        status: this.deriveStatusFromResult(m.match_result)
      }));
    });
  }

  /*---Schedules: map schedules JSON to typed Schedule objects -- */
  loadSchedulesFromMock(): void {
    this.apiService.getMockData('assets/mock_data/schedules.json').subscribe(data => {
      this.schedulesRaw = data;
      this.schedulesList = this.schedulesRaw.map((s: any) => ({
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

  /*--- Batting summaries: typed list used for scorecards-- */
  loadBattingSummariesFromMock(): void {
    this.apiService.getMockData('assets/mock_data/battingSumary.json').subscribe(data => {
      this.battingSummaryRaw = data;
      this.battingSummaries = this.battingSummaryRaw.map((b: any) => ({
        matchId: b.match_id,
        inningsNo: b.innings_no,
        battingTeam: b.batting_team,
        playerId: b.player_id,
        playerName: b.player_name,
        battingOrder: Number(b.batting_order),
        runs: Number(b.runs),
        balls: Number(b.balls),
        fours: Number(b.bdry_four),
        sixes: Number(b.bdry_six),
        strikeRate: Number(b.strike_rate),
        wicketDesc: b.wicket_desc || null
      }));
    });
  }

  /*--Bowling summaries: typed list used for scorecards*/
  loadBowlingSummariesFromMock(): void {
    this.apiService.getMockData('assets/mock_data/bowlingSumary.json').subscribe(data => {
      this.bowlingSummaryRaw = data;
      this.bowlingSummaries = this.bowlingSummaryRaw.map((b: any) => ({
        matchId: b.match_id,
        inningsNo: b.innings_no,
        bowlingTeam: b.bowling_team,
        playerId: b.player_id,
        playerName: b.player_name,
        bowlingOrder: Number(b.bowling_order),
        overs: Number(b.overs),
        maidens: Number(b.maidens),
        runs: Number(b.runs),
        wickets: Number(b.wicket),
        economy: Number(b.economy),
        foursConceded: Number(b.bdry_four),
        sixesConceded: Number(b.bdry_six),
        dotBalls: Number(b.dot_balls),
        strikeRate: b.strike_rate ? Number(b.strike_rate) : undefined
      }));
    });
  }

  /*--- Fall of wickets list-- */
  loadFallOfWicketsFromMock(): void {
    this.apiService.getMockData('assets/mock_data/scorecardFlow.json').subscribe(data => {
      this.fowRaw = data;
      this.fallOfWickets = this.fowRaw.map((f: any) => ({
        matchId: f.match_id,
        inningsNo: f.innings_no,
        battingTeam: f.batting_team,
        wicketNo: Number(f.wicket_no),
        teamTotal: Number(f.team_total),
        overValue: Number(f.over_value),
        playerId: f.player_id,
        playerName: f.player_name,
        wicketDesc: f.wicket_desc
      }));
    });
  }

  /*---Seasons: load seasons JSON- */
  loadSeasonsFromMock(): void {
    this.apiService.getMockData('assets/mock_data/sesson.json').subscribe(data => {
      this.seasonsRaw = data;
      this.Season = this.seasonsRaw.map((s: any) => ({
        current: s.current,
        season_value: s.season_value,
        season_id: s.season_id
      }));
    });
  }
  // Match result text la irundhu status decide panra function
  private deriveStatusFromResult(result: string | null | undefined): string {
    if (!result) return 'Upcoming';  // result illa → Upcoming
    const lowered = result.toLowerCase();  // small letter ku convert panrom
    if (lowered.includes('won') || lowered.includes('draw')) return 'Completed';  // 'won' illa 'draw' irundha → Completed
    // illati → Live
    return 'Live';
  }

  // API/JSON la varra status values normalize panra function
  private normalizeStatus(status: string | null | undefined): string {
    if (!status) return 'Upcoming';  // status illa → Upcoming

    switch (status.toLowerCase()) {
      case 'completed': return 'Completed';   // completed ah irundha
      case 'inprogress': return 'Live';       // inprogress ah irundha
      case 'upcoming': return 'Upcoming';     // upcoming ah irundha
      default: return 'Upcoming';             // vera yedhum na Upcoming
    }
  }

  /*---Filtered match-cards computed property (applies all selected filters)-- */
  get filteredMatches(): FilterMatch[] {
    return this.matchescard.filter(match =>
      (!this.selectedStatus || match.status === this.selectedStatus) &&
      (!this.selectedGender || match.gender === this.selectedGender) &&
      (!this.selectedAgeGroup || match.ageGroup === this.selectedAgeGroup) &&
      (!this.selectedMatchType || match.matchType === this.selectedMatchType) &&
      (!this.selectedTeamFormat || match.teamFormat === this.selectedTeamFormat)
    );
  }

  /*---Pagination slice for match cards- */
  get paginatedMatches(): FilterMatch[] {
    return this.filteredMatches.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any): void {
    // event has { first, rows } from p-paginator
    this.first = event.first;
    this.rows = event.rows;
  }

  /*---Points-list filtering based on selected series & matchType-- */
  get filteredPointsMatches(): Competition[] {
    if (!this.selectedSeries) return [];
    return this.matchespoints.filter(match =>
      match.series === this.selectedSeries &&
      (!this.selectedMatchType || match.matchType === this.selectedMatchType)
    );
  }

  get paginatedPointsMatches(): Competition[] {
    return this.filteredPointsMatches.slice(this.pointsFirst, this.pointsFirst + this.pointsRows);
  }

  onPointsPageChange(event: any): void {
    this.pointsFirst = event.first;
    this.pointsRows = event.rows;
  }

  /*--Points form open/closeopens the points UI for a series*/

  showPointsForm(series: string, matchType?: string): void {
    this.selectedSeries = series;
    this.selectedMatchType = matchType || null;
    this.ShowPointsForm = true;
    this.pointsForm.reset();
  }

  closePointsForm(): void {
    this.ShowPointsForm = false;
    this.selectedMatchType = null;
  }

  /*--- Helper to check whether any points data exists for a series-- */
  hasPoints(series: string): boolean {
    return this.matchespoints.some(match => match.series === series);
  }

  /*---Count match types in a series (returns object like { 'T20': 2, 'ODI': 1 })-- */
  getMatchTypeCounts(series: string): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    this.matchespoints.filter(match => match.series === series).forEach(match => {
      counts[match.matchType] = counts[match.matchType] ? counts[match.matchType] + 1 : 1;
    });
    return counts;
  }

  /*---Total number of match cards after filters applied-- */
  get totalData(): number {
    return this.filteredMatches.length;
  }

  /*---Scorecard open/close controls used by template-- */
  openScorecard(match: any): void {
    this.selectedMatch = match;
    this.showScorecard = true;
  }

  closeScorecard(): void {
    this.showScorecard = false;
  }
}
