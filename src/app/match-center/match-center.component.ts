import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { ApiService } from '../services/api.service';

/** --- Match interface for type safety --- */
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

interface compitation {
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
  wicketDesc?: string;
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

@Component({
  selector: 'app-match-center',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownModule, PaginatorModule],
  templateUrl: './match-center.component.html',
  styleUrls: ['./match-center.component.css']
})
export class MatchCenterComponent implements OnInit {

  /**-- Pagination-- */
  rows: number = 6;
  first: number = 0;

  pointsRows: number = 2;
  pointsFirst: number = 0;

  /**-- Filters-- */
  selectedSeries: string | null = null;
  selectedMatchType: string | null = null;
  selectedStatus: string | null = null;
  selectedGender: string | null = null;
  selectedAgeGroup: string | null = null;
  selectedTeamFormat: string | null = null;

  // Dropdown Options
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


  filters = [] as any;
  competitions = [] as any;
  matchSumaruy = [] as any;
  schedules = [] as any;
  scorecard_batting_summary = [] as any;
  scorecard_bowling_summary = [] as any;
  scorecard_fow = [] as any;
  seasons: any = [] as any

  /**-- Match Data-- */
  matchescard: FilterMatch[] = [];
  matchespoints: compitation[] = [];
  matchSummaries: MatchSummary[] = [];
  schedulesList: Schedule[] = [];
  battingSummaries: BattingSummary[] = [];
  bowlingSummaries: BowlingSummary[] = [];
  fallOfWickets: FallOfWicket[] = [];
  Season: Season[] = [];

  /**-- Points Form-- */
  ShowPointsForm: boolean = false;
  pointsForm: FormGroup;

  /**-- Scorecard Variables -- */
  showScorecard = false;
  selectedMatch: any;
  activeTab = 'scorecard';
  teamAbatting = [];
  teamBbatting = [];
  teamAbowling = [];
  teamBbowling = [];
  teamAsquad = [];
  teamBsquad = [];
  activeinnings: string = 'one';
  activeInnings: string = 'testone';
  //fallOfWickets = [];

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.pointsForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadFilterOptions();
    this.initializeMatches();
    this.initializeMatchesPoints();
    this.initializeMatchSummaries();
    this.initializeSchedules();
    this.initializeBattingSummaries();
    this.initializeBowlingSummaries();
    this.initializeFallOfWickets();
    this.initializeSeason();
  }

  /**-- Load Dropdown Options Dynamically --*/
  loadFilterOptions() {
    this.apiService.getMockData('assets/mock_data/filters.json').subscribe(data => {
      this.filters = data;
      this.genders = [{ label: 'All Gender', value: null }, ...this.filters.filter((f: any) => f.config_key === 'gender').map((f: any) => ({ label: f.config_value, value: f.config_value }))];
      this.ageGroups = [{ label: 'All Age Groups', value: null }, ...this.filters.filter((f: any) => f.config_key === 'age_category').map((f: any) => ({ label: f.config_value, value: f.config_value }))];
      this.teamFormats = [{ label: 'All Team Formats', value: null }, ...this.filters.filter((f: any) => f.config_key === 'team_format').map((f: any) => ({ label: f.config_value, value: f.config_value }))];
      this.matchTypes = [{ label: 'All Match Types', value: null }, ...this.filters.filter((f: any) => f.config_key === 'comp_type').map((f: any) => ({ label: f.config_value, value: f.config_value }))];

    });
  }

  /**-- Initialize Match Cards Dynamically from JSON --*/
  private initializeMatches(): void {

    this.apiService.getMockData('assets/mock_data/compitation.json').subscribe(data => {
      this.competitions = data;

      this.matchescard = this.competitions.map((c: any) => ({
        series: c.competition_name,   //  from competition_name
        startDate: new Date(c.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        endDate: new Date(c.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        matchType: c.comp_type,       //  from comp_type
        gender: c.gender,             //  from gender
        ageGroup: c.age_category,     //  from age_category
        status: this.mapStatus(c.status), //  from status
        teamFormat: c.team_format     //  from team_format
      }));

      console.error('Failed to load competitions JSON');

    });
  }

  private initializeMatchSummaries(): void {
    this.apiService.getMockData('assets/mock_data/matchsumary.json').subscribe(data => {
      this.matchSumaruy = data;
      this.matchSummaries = this.matchSumaruy.map((m: any) => ({
        matchId: m.match_id,
        competitionName: m.competition_name,
        teamA: m.team_1_name,
        teamB: m.team_2_name,
        teamASummary: m.team_1_summary,
        teamBSummary: m.team_2_summary,
        venue: m.venue,
        startDate: new Date(m.match_start_date).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric'
        }),
        endDate: new Date(m.match_end_date).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric'
        }),
        result: m.match_result,
        matchType: m.comp_type,
        status: this.mapStatusFromSummary(m.match_result) // 👈 we’ll write this helper
      }));
    });
  }

  private initializeSchedules(): void {

    this.apiService.getMockData('assets/mock_data/schedules.json').subscribe(data => {
      this.schedules = data;
      this.schedulesList = this.schedules.map((s: any) => ({
        matchId: s.match_id,
        competitionName: s.competition_name,
        teamA: s.team_1_name,
        teamB: s.team_2_name,
        teamASummary: s.team_1_summary,
        teamBSummary: s.team_2_summary,
        venue: s.venue,
        startDate: new Date(s.match_start_date).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric'
        }),
        endDate: new Date(s.match_end_date).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric'
        }),
        result: s.match_result,
        matchType: s.comp_type,
        status: this.mapStatusFromSummary(s.match_result),
        teamFormat: s.team_format,
        gender: s.gender,
        ageCategory: s.age_category
      }));
    });
  }

  private initializeBattingSummaries(): void {
    this.apiService.getMockData('assets/mock_data/battingSumary.json').subscribe(data => {
      this.scorecard_batting_summary = data;

      this.battingSummaries = this.scorecard_batting_summary.map((b: any) => ({
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
  private initializeBowlingSummaries(): void {

    this.apiService.getMockData('assets/mock_data/bowlingSumary.json').subscribe(data => {
      this.scorecard_bowling_summary = data;
      this.bowlingSummaries = this.scorecard_bowling_summary.map((b: any) => ({
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
  // 
  private initializeFallOfWickets(): void {

    this.apiService.getMockData('assets/mock_data/scorecardFlow.json').subscribe(data => {
      this.scorecard_fow = data;
      this.fallOfWickets = this.scorecard_fow.map((f: any) => ({
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

  private initializeSeason(): void {
    this.apiService.getMockData('assets/mock_data/sesson.json').subscribe(data => {
      this.seasons = data;
      this.seasons = this.seasons.map((s: any) => ({
        current: s.current,
        season_value: s.season_value,
        season_id: s.season_id
      }));
    });
  }

  private mapStatusFromSummary(result: string): string {
    if (!result) return 'Upcoming';
    if (result.toLowerCase().includes('won') || result.toLowerCase().includes('draw'))
      return 'Completed';
    return 'Live';
  }

  private mapStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'Completed';
      case 'inprogress': return 'Live';
      case 'upcoming': return 'Upcoming';
      default: return 'Upcoming';
    }
  }

  /**-- Initialize Detailed Matches (Optional, you can make dynamic similarly) --*/
  private initializeMatchesPoints(): void {
    this.matchespoints = [];
  }

  /**-- Filtered Matches-- */
  get filteredMatches(): FilterMatch[] {
    return this.matchescard.filter(match =>
      (!this.selectedStatus || match.status === this.selectedStatus) &&
      (!this.selectedGender || match.gender === this.selectedGender) &&
      (!this.selectedAgeGroup || match.ageGroup === this.selectedAgeGroup) &&
      (!this.selectedMatchType || match.matchType === this.selectedMatchType) &&
      (!this.selectedTeamFormat || match.teamFormat === this.selectedTeamFormat)
    );
  }

  get paginatedMatches(): FilterMatch[] {
    return this.filteredMatches.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  get filteredPointsMatches(): compitation[] {
    if (!this.selectedSeries) return [];
    return this.matchespoints.filter(match =>
      match.series === this.selectedSeries &&
      (!this.selectedMatchType || match.matchType === this.selectedMatchType)
    );
  }

  get paginatedPointsMatches(): compitation[] {
    return this.filteredPointsMatches.slice(this.pointsFirst, this.pointsFirst + this.pointsRows);
  }

  onPointsPageChange(event: any): void {
    this.pointsFirst = event.first;
    this.pointsRows = event.rows;
  }

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

  hasPoints(series: string): boolean {
    return this.matchespoints.some(match => match.series === series);
  }

  getMatchTypeCounts(series: string): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    this.matchespoints.filter(match => match.series === series).forEach(match => {
      counts[match.matchType] = counts[match.matchType] ? counts[match.matchType] + 1 : 1;
    });
    return counts;
  }

  get totalData(): number {
    return this.filteredMatches.length;
  }

  /**-- Scorecard Logic --*/
  openScorecard(match: any) {
    this.selectedMatch = match;
    this.showScorecard = true;
  }

  closeScorecard() {
    this.showScorecard = false;
  }
}

