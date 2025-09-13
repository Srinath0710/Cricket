import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { ApiService } from '../../services/api.service';
import { ScheduleModel, BattingSummaryModel, BowlingSummaryModel, FallOfWicketModel, SeasonModel } from '../match.center.model';
import { OnChanges, SimpleChanges } from '@angular/core';

@Component({

  selector: 'app-screcard-points',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    RouterModule,],
  templateUrl: './screcard-points.component.html',
  styleUrl: './screcard-points.component.css'
})
export class ScrecardPointsComponent {
  @Input() selectedMatch: any;
  scorecardHeader: any = {};
  battingSummariesInnings1: any = [];
  battingSummariesInnings2: any = [];
  battingSummariesInnings3: any = [];
  battingSummariesInnings4: any = [];

  bowlingSummariesInnings1: any = [];
  bowlingSummariesInnings2: any = [];
  bowlingSummariesInnings3: any = [];
  bowlingSummariesInnings4: any = [];
  
  fallOfWicketsInnings1: any = [];
  fallOfWicketsInnings2: any = [];
  fallOfWicketsInnings3: any = [];
  fallOfWicketsInnings4: any = [];

  ngOnInit(): void {
    this.loadScheduleSummarysFromMock();
    this.loadBattingSummariesFromMock();
    this.loadBowlingSummariesFromMock();
    this.loadFallOfWicketsFromMock();
    this.loadSeasonsFromMock();
  }
  /*--- Scorecard UI -- */
  showScorecard = false;
  // selectedMatch: any = null; 
  activeTab = 'scorecard';
  teamAbatting: any[] = [];
  teamBbatting: any[] = [];
  teamAbowling: any[] = [];
  teamBbowling: any[] = [];
  teamAsquad: any[] = [];
  teamBsquad: any[] = [];
  // activeinnings: string = 'one';
  activeinnings: string = 'testfour';
  ScheduleMatchSummary: any
  ScheduleMatchSummaryRaw: any
  battingMatchSummary: any
  battingMatchSummaryRaw: any
  battingSummaries: any;
  battingSummaryRaw: any;
  bowlingSummaryRaw: any;
  bowlingSummaries: any;
  fowRaw: any;
  fallOfWickets: any;
  seasonsRaw: any;
  Season: any;
  activePage: string = 'scorecard';

  constructor(private apiService: ApiService) { }

  /*---Scorecard open/close controls used by template-- */
  openScorecard(match: any): void {
    this.selectedMatch = match;
    this.showScorecard = true;
  }


  closeScorecard(): void {
    this.showScorecard = false;
    this.changeTab('points');

  }



  /* Schedules */
  loadScheduleSummarysFromMock(): void {
    this.apiService.getMockData('assets/mock_data/schedules.json').subscribe(data => {
      this.ScheduleMatchSummaryRaw = data;
      this.ScheduleMatchSummary = this.battingMatchSummaryRaw.map((s: any) => new ScheduleModel({
        match_id: s.match_id,
        competition_name: s.competition_name,
        team_1_name: s.team_1_name,
        team_2_name: s.team_2_name,
        team_1_summary: s.team_1_summary,
        team_2_summary: s.team_2_summary,
        venue: s.venue,
        match_start_date: new Date(s.match_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        match_end_date: new Date(s.match_end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        // match_result: s.match_result,
        comp_type: s.comp_type,
        // match_result: this.deriveStatusFromResult(s.match_result),
        team_format: s.team_format,
        gender: s.gender,
        age_category: s.age_category
      }));
    });
  }


  /* Batting summaries */
  loadBattingSummariesFromMock(): void {
    this.apiService.getMockData('assets/mock_data/battingSumary.json').subscribe(data => {
      this.battingSummaryRaw = data;
      this.battingSummaries = this.battingSummaryRaw.map((b: any) => new BattingSummaryModel({
        match_id: b.match_id,
        innings_no: b.innings_no,
        batting_team: b.batting_team,
        player_id: b.player_id,
        player_name: b.player_name,
        batting_order: Number(b.batting_order),
        runs: Number(b.runs),
        balls: Number(b.balls),
        bdry_four: Number(b.bdry_four),
        bdry_six: Number(b.bdry_six),
        strike_rate: Number(b.strike_rate),
        wicket_desc: b.wicket_desc || null
      }));


    this.battingSummariesInnings1 = this.battingSummaryRaw.filter((b: any) => b.innings_no === "1");
    this.battingSummariesInnings2 = this.battingSummaryRaw.filter((b: any) => b.innings_no === "2");
    this.battingSummariesInnings3 = this.battingSummaryRaw.filter((b: any) => b.innings_no === "3");
    this.battingSummariesInnings4 = this.battingSummaryRaw.filter((b: any) => b.innings_no === "4");
    });
  }


  /* Bowling summaries */
  loadBowlingSummariesFromMock(): void {
    this.apiService.getMockData('assets/mock_data/bowlingSumary.json').subscribe(data => {
      this.bowlingSummaryRaw = data;
      this.bowlingSummaries = this.bowlingSummaryRaw.map((b: any) => new BowlingSummaryModel({
        match_id: b.match_id,
        innings_no: b.innings_no,
        bowling_team: b.bowling_team,
        player_id: b.player_id,
        player_name: b.player_name,
        bowling_order: Number(b.bowling_order),
        overs: Number(b.overs),
        maidens: Number(b.maidens),
        runs: Number(b.runs),
        wicket: Number(b.wicket),
        economy: Number(b.economy),
        bdry_four: Number(b.bdry_four),
        bdry_six: Number(b.bdry_six),
        dot_balls: Number(b.dot_balls),
        strike_rate: b.strike_rate ? Number(b.strike_rate) : undefined
      }));
    this.bowlingSummariesInnings1 = this.bowlingSummaryRaw.filter((b: any) => b.innings_no === "1");
    this.bowlingSummariesInnings2 = this.bowlingSummaryRaw.filter((b: any) => b.innings_no === "2");
    this.bowlingSummariesInnings3 = this.bowlingSummaryRaw.filter((b: any) => b.innings_no === "3");
    this.bowlingSummariesInnings4 = this.bowlingSummaryRaw.filter((b: any) => b.innings_no === "4");
    });
  }


  /* Fall of wickets */
  loadFallOfWicketsFromMock(): void {
    this.apiService.getMockData('assets/mock_data/scorecardFlow.json').subscribe(data => {
      this.fowRaw = data;
      this.fallOfWickets = this.fowRaw.map((f: any) => new FallOfWicketModel({
        match_id: f.match_id,
        innings_no: f.innings_no,
        batting_team: f.batting_team,
        wicket_no: Number(f.wicket_no),
        team_total: Number(f.team_total),
        over_value: Number(f.over_value),
        player_id: f.player_id,
        player_name: f.player_name,
        wicket_desc: f.wicket_desc
      }));
    this.fallOfWicketsInnings1 = this.fowRaw.filter((b: any) => b.innings_no === "1");
    this.fallOfWicketsInnings2 = this.fowRaw.filter((b: any) => b.innings_no === "2");
    this.fallOfWicketsInnings3 = this.fowRaw.filter((b: any) => b.innings_no === "3");
    this.fallOfWicketsInnings4 = this.fowRaw.filter((b: any) => b.innings_no === "4");
    });
  }

  /* Seasons */
  loadSeasonsFromMock(): void {
    this.apiService.getMockData('assets/mock_data/seasons.json').subscribe(data => {
      this.seasonsRaw = data;
      this.Season = this.seasonsRaw.map((s: any) => new SeasonModel(s));
    });
  }
  changeTab(page: string) {
    this.activePage = page;
  }

ngOnChanges(changes: SimpleChanges) {
  if (changes['selectedMatch'] && this.selectedMatch) {
    this.scorecardHeader = {
      competitionName: this.selectedMatch.competition_name,
      startDate: this.selectedMatch.match_start_date,
      matchType: this.selectedMatch.comp_type,
      venue: this.selectedMatch.venue,
      teamA: this.selectedMatch.team_1_name,
      teamB: this.selectedMatch.team_2_name,

      teamASummary: Array.isArray(this.selectedMatch.team_1_summary) 
        ? this.selectedMatch.team_1_summary.map((x: any) => ({
            runs: x.runs ?? '',
            wickets: x.wickets ?? '',
            overs: x.overs ?? ''
          }))
        : [],

      teamBSummary: Array.isArray(this.selectedMatch.team_2_summary) 
        ? this.selectedMatch.team_2_summary.map((x: any) => ({
            runs: x.runs ?? '',
            wickets: x.wickets ?? '',
            overs: x.overs ?? ''
          }))
        : [],

      result: this.selectedMatch.match_result
    };
  }
}

activeInnings: string = 'A0'; // default

setActiveInnings(team: 'A' | 'B', index: number) {
  this.activeInnings = team + index;
}

}
