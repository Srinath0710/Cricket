import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { MatchSummaryModel } from '../match.center.model';
import { ScrecardPointsComponent } from "../screcard-points/screcard-points.component";
import { ApiService } from '../../services/api.service';

interface InningsData {
  runs: string;
  overs: string;
}

@Component({
  selector: 'app-match-points',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    RouterModule,
    ScrecardPointsComponent
  ],
  templateUrl: './match-points.component.html',
  styleUrl: './match-points.component.css'
})
export class MatchPointsComponent implements OnChanges,OnInit {

  @Input() competitionId: number | 0 = 0;
  @Input() selectedMatchType: string | null = null;
  @Output() hideMatches= new EventEmitter<boolean>();

  // ShowPointsForm: boolean = true;
  pointsForm: FormGroup;

  pointsRows: number = 5;
  pointsFirst: number = 0;

  schedulesList: MatchSummaryModel[] = [];
  filteredSchedulesList: MatchSummaryModel[] = [];

  showScorecard = false;
  selectedMatch: any = null;
  schedulesRaw: any;
  activePage: string = 'points';

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.pointsForm = this.fb.group({});
  }
  ngOnInit(){
    console.log(this.activePage)
          this.loadMatchSummarysFromMock();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['competitionId'] || changes['selectedMatchType']) {
      this.loadMatchSummarysFromMock();
    }
  }

  loadMatchSummarysFromMock(): void {
    this.apiService.getMockData('assets/mock_data/schedules.json').subscribe(data => {
      this.schedulesRaw = data;

      this.schedulesList = this.schedulesRaw.map((s: any) => new MatchSummaryModel({
        match_id: s.match_id,
        competition_name: s.competition_name,
        team_1_name: s.team_1_name,
        team_2_name: s.team_2_name,

        // preprocess summaries
        team_1_summary: this.parseSummary(s.team_1_summary),
        team_2_summary: this.parseSummary(s.team_2_summary),

        venue: s.venue,
        match_start_date: new Date(s.match_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        match_end_date: new Date(s.match_end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        comp_type: s.comp_type,

        // Keep the original result string
        match_result: s.match_result,

        team_format: s.team_format,
        gender: s.gender,
        age_category: s.age_category,
        competition_id: s.competition_id
      }));

      this.applyFilters();
    });
  }

  /**
   * Convert summary string like:
   *   "373/5 (55.2) & 465/10 (55.2)"
   * into array of { runs, overs }
   */
  private parseSummary(summary: string | null): InningsData[] | null {
    if (!summary) return null;

    // If already array from API
    if (Array.isArray(summary)) return summary;

    return summary.split("&").map((x: string) => {
      const parts = x.trim().split("(");
      const runs = parts[0].trim();
      const overs = parts[1] ? parts[1].replace(")", "").trim() : "";
      return { runs, overs };
    });
  }

  applyFilters(): void {
    this.filteredSchedulesList = this.schedulesList.filter(match =>
      match.competition_id === this.competitionId &&
      (!this.selectedMatchType || match.comp_type === this.selectedMatchType)
    );
  }

  onPointsPageChange(event: any): void {
    this.pointsFirst = event.first;
    this.pointsRows = event.rows;
  }

  get paginatedPointsMatches(): MatchSummaryModel[] {
    return this.filteredSchedulesList.slice(this.pointsFirst, this.pointsFirst + this.pointsRows);
  }

  private deriveStatusFromResult(result: string | null | undefined): string {
    if (!result) return 'Upcoming';
    const lowered = result.toLowerCase();
    if (lowered.includes('won') || lowered.includes('draw')) return 'Completed';
    return 'Live';
  }
closePointsForm(): void {
    this.hideMatches.emit(false); // send value to parent
  }

  changeTab(page: string) {
    this.activePage = page;
  }

openScorecard(match: any) {
  this.selectedMatch = match;
  this.activePage = 'scorecard';
}
getInningsSequence(match: any) {
  const sequence: { team: number, runs: string, overs: string }[] = [];

  if (match.team_1_summary) {
    match.team_1_summary.forEach((inn: any, i: number) => {
      sequence.push({ team: 1, runs: inn.runs, overs: inn.overs });
    });
  }

  if (match.team_2_summary) {
    match.team_2_summary.forEach((inn: any, i: number) => {
      sequence.push({ team: 2, runs: inn.runs, overs: inn.overs });
    });
  }

  return sequence;
}

}
