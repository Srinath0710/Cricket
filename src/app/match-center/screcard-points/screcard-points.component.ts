import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { ApiService } from '../../services/api.service';
import { BattingSummaryModel, BowlingSummaryModel, FallOfWicketModel, SeasonModel } from '../match.center.model';

@Component({
  
  selector: 'app-screcard-points',
  standalone:true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    RouterModule,],
  templateUrl: './screcard-points.component.html',
  styleUrl: './screcard-points.component.css'
})
export class ScrecardPointsComponent {
@Input() selectedMatch: any;


ngOnInit(): void {
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
  activeinnings: string = 'one';
  activeInnings: string = 'testfour';
  battingSummaries: any;
  battingSummaryRaw: any;
  bowlingSummaryRaw: any;
  bowlingSummaries: any;
  fowRaw: any;
  fallOfWickets: any;
  seasonsRaw: any;
  Season: any;
activePage: string ='scorecard';

constructor(private apiService:ApiService){}
  
 /*---Scorecard open/close controls used by template-- */
openScorecard(match: any): void {
  this.selectedMatch = match;
  this.showScorecard = true;
}


  closeScorecard(): void {
    this.showScorecard = false;
  }
  /* Batting summaries */
    loadBattingSummariesFromMock(): void {
      this.apiService.getMockData('assets/mock_data/battingSumary.json').subscribe(data => {
        this.battingSummaryRaw = data;
        this.battingSummaries = this.battingSummaryRaw.map((b:any) => new BattingSummaryModel({
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
  
    /* Bowling summaries */
    loadBowlingSummariesFromMock(): void {
      this.apiService.getMockData('assets/mock_data/bowlingSumary.json').subscribe(data => {
        this.bowlingSummaryRaw = data;
        this.bowlingSummaries = this.bowlingSummaryRaw.map((b:any) => new BowlingSummaryModel({
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
  
    /* Fall of wickets */
    loadFallOfWicketsFromMock(): void {
      this.apiService.getMockData('assets/mock_data/fow.json').subscribe(data => {
        this.fowRaw = data;
        this.fallOfWickets = this.fowRaw.map((f:any) => new FallOfWicketModel({
          matchId: f.match_id,
          inningsNo: f.innings_no,
          battingTeam: f.batting_team,
          wicketNo: Number(f.wicket_no),
          teamTotal: Number(f.team_total),
          overValue: Number(f.over),
          playerId: f.player_id,
          playerName: f.player_name,
          wicketDesc: f.wicket_desc
        }));
      });
    }
  
    /* Seasons */
    loadSeasonsFromMock(): void {
      this.apiService.getMockData('assets/mock_data/seasons.json').subscribe(data => {
        this.seasonsRaw = data;
        this.Season = this.seasonsRaw.map((s:any) => new SeasonModel(s));
      });
    }
  changeTab(page:string){
    this.activePage=page;
  }

}


