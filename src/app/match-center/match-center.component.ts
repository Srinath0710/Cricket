
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';

/** --- Match interface for type safety --- */
interface Match {
  series: string;
  startDate: string;
  endDate: string;
  matchType: string;
  gender: string;
  ageGroup: string;
  status: string;
}

interface MatchDetail {
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


@Component({
  selector: 'app-match-center',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownModule, PaginatorModule],
  templateUrl: './match-center.component.html',
  styleUrls: ['./match-center.component.css']
})
export class MatchCenterComponent implements OnInit {

  /**-- Pagination-- */
  rows: number = 6;  // Cards per page
  first: number = 0; // Index of first item

  /**-- Points Form Pagination-- */
pointsRows: number = 2;  // rows per page for points matches
pointsFirst: number = 0; // index of first item for points matches

  /**-- Filters-- */
  selectedSeries: string | null = null;
  selectedMatchType: string | null = null;
  selectedStatus: string | null = null;
  selectedGender: string | null = null;
  selectedAgeGroup: string | null = null;

  // Filter options
  statuses = [
    { label: 'All Status', value: null },
    { label: 'Live', value: 'Live' },
    { label: 'Upcoming', value: 'Upcoming' },
    { label: 'Completed', value: 'Completed' }
  ];

  genders = [
    { label: 'All Gender', value: null },
    { label: 'Men', value: 'Men' },
    { label: 'Women', value: 'Women' }
  ];

  ageGroups = [
    { label: 'All Age Groups', value: null },
    { label: 'Under 16', value: 'Under 16' },
    { label: 'Under 19', value: 'Under 19' },
    { label: 'Under 22', value: 'Under 22' },
    { label: 'Senior', value: 'Senior' }
  ];

  matchTypes = [
    { label: 'All Match Types', value: null },
    { label: 'Test', value: 'Test' },
    { label: 'ODI', value: 'ODI' },
    { label: 'T20', value: 'T20' },
    { label: 'TNPL', value: 'TNPL' },
    { label: 'IPL', value: 'IPL' }
  ];

  /**-- Match Data-- */
  matchescard: Match[] = [];        // Summary cards
  matchespoints: MatchDetail[] = []; // Detailed matches

  /**-- Points Form-- */
  ShowPointsForm: boolean = false;
  pointsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the reactive form
    this.pointsForm = this.fb.group({});
  }
  /**-- OnInit-- */
  ngOnInit(): void {
    this.initializeMatches();      // Load sample data
    this.initializeMatchesPoints();
  }

  /**-- Initialize Match Cards-- */
  private initializeMatches(): void {
    /** Sample data set panrathu */
    this.matchescard = [
      { series: 'India Tour of England 2025', startDate: '02.Aug.2025', endDate: '02.Aug.2025', matchType: 'Test', gender: 'Men', ageGroup: 'Senior', status: 'Live' },
      { series: 'India Mens U19 Tour of England 2025', startDate: '02.Aug.2025', endDate: '02.Aug.2025', matchType: 'ODI', gender: 'Men', ageGroup: 'Under 19', status: 'Upcoming' },
      { series: 'India Women Tour of England 2025', startDate: '02.Aug.2025', endDate: '02.Aug.2025', matchType: 'Test', gender: 'Women', ageGroup: 'Senior', status: 'Completed' },
      { series: 'India A Women Tour of Australia 2025', startDate: '02.Aug.2025', endDate: '02.Aug.2025', matchType: 'ODI', gender: 'Women', ageGroup: 'Senior', status: 'Completed' },
      { series: 'India vs Australia T20 Series 2025', startDate: '02.Aug.2025', endDate: '02.Aug.2025', matchType: 'T20', gender: 'Men', ageGroup: 'Senior', status: 'Live' },
      { series: 'TNPL 2025 Finals', startDate: '02.Aug.2025', endDate: '02.Aug.2025', matchType: 'TNPL', gender: 'Men', ageGroup: 'Senior', status: 'Upcoming' },
      { series: 'IPL 2025 Opening Match', startDate: '02.Aug.2025', endDate: '02.Aug.2025', matchType: 'IPL', gender: 'Men', ageGroup: 'Senior', status: 'Completed' },
      { series: 'India Women T20 Challenge 2025', startDate: '02.Aug.2025', endDate: '02.Aug.2025', matchType: 'T20', gender: 'Women', ageGroup: 'Senior', status: 'Upcoming' },
      { series: 'India U16 Tour of Sri Lanka 2025', startDate: '02.Aug.2025', endDate: '02.Aug.2025', matchType: 'ODI', gender: 'Men', ageGroup: 'Under 16', status: 'Live' },
      { series: 'India U22 Women T20 Series 2025', startDate: '02.Aug.2025', endDate: '02.Aug.2025', matchType: 'T20', gender: 'Women', ageGroup: 'Under 22', status: 'Upcoming' }
    ];
  }

  /**-- Initialize Detailed Matches-- */
  private initializeMatchesPoints(): void {
    this.matchespoints = [
      // Live / Upcoming / Completed match objects here
      // Example object:
      {
        series: 'India Women Tour of England 2025',
        dateTime: "10:00 AM, 24-Aug",
        stadium: "MCG",
        location: "Melbourne, Australia",
        matchType: "Test",
        teamA: {
          name: "AUS",
          innings: ["143/7 (50)", "210/9d (70)"],
          logo: "assets/aus.png"
        },
        teamB: {
          name: "ENG",
          innings: ["173/2 (60)", "150/5 (45)"],
          logo: "assets/eng.png"
        },
        resultStatus: "Match scheduled",
        type: "Completed"
      },

      {
        series: 'India Women Tour of England 2025',
        dateTime: "10:00 AM, 24-Aug",
        stadium: "MCG",
        location: "Melbourne, Australia",
        matchType: "Test",
        teamA: {
          name: "AUS",
          innings: ["143/7 (50)", "210/9d (70)"],
          logo: "assets/aus.png"
        },
        teamB: {
          name: "ENG",
          innings: ["173/2 (60)", "150/5 (45)"],
          logo: "assets/eng.png"
        },
        resultStatus: "Match scheduled",
        type: "Completed"
      },

      {
        series: 'India Women Tour of England 2025',
        dateTime: "10:00 AM, 24-Aug",
        stadium: "MCG",
        location: "Melbourne, Australia",
        matchType: "Test",
        teamA: {
          name: "AUS",
          innings: ["143/7 (50)", "210/9d (70)"],
          logo: "assets/aus.png"
        },
        teamB: {
          name: "ENG",
          innings: ["173/2 (60)", "150/5 (45)"],
          logo: "assets/eng.png"
        },
        resultStatus: "Match scheduled",
        type: "Completed"
      },

      {
        series: 'India Women Tour of England 2025',
        dateTime: "10:00 AM, 24-Aug",
        stadium: "MCG",
        location: "Melbourne, Australia",
        matchType: "Test",
        teamA: {
          name: "AUS",
          innings: ["143/7 (50)", "210/9d (70)"],
          logo: "assets/aus.png"
        },
        teamB: {
          name: "ENG",
          innings: ["173/2 (60)", "150/5 (45)"],
          logo: "assets/eng.png"
        },
        resultStatus: "Match scheduled",
        type: "Completed"
      },

      {
        series: 'India Women Tour of England 2025',
        dateTime: "10:00 AM, 24-Aug",
        stadium: "MCG",
        location: "Melbourne, Australia",
        matchType: "Test",
        teamA: {
          name: "AUS",
          innings: ["143/7 (50)", "210/9d (70)"],
          logo: "assets/aus.png"
        },
        teamB: {
          name: "ENG",
          innings: ["173/2 (60)", "150/5 (45)"],
          logo: "assets/eng.png"
        },
        resultStatus: "Match scheduled",
        type: "Completed"
      },




      //-- Upcoming Matches (6)--

      {
        series: 'India Mens U19 Tour of England 2025',
        dateTime: "07:00 PM, 23-Aug",
        stadium: "Eden Gardens",
        location: "Kolkata, India",
        matchType: "T20",
        teamA: { name: "KKR", score: "Yet to Bat", logo: "assets/kkr.png" },
        teamB: { name: "RCB", score: "Yet to Bat", logo: "assets/rcb.png" },
        resultStatus: "Match Start at 07:00 PM, 23-Aug",
        type: "upcoming"
      },
      {
        series: 'India Mens U19 Tour of England 2025',
        dateTime: "02:30 PM, 21-Aug",
        stadium: "Greenfield Stadium",
        location: "Kerala, India",
        matchType: "T20",
        teamA: { name: "Sailors", score: "Yet to Bat", logo: "assets/sailors.png" },
        teamB: { name: "Globstars", score: "Yet to Bat", logo: "assets/globstars.png" },
        resultStatus: "Match Start at 02:30 PM, 21-Aug",
        type: "upcoming"
      },
      {
        series: 'India Mens U19 Tour of England 2025',
        dateTime: "07:00 PM, 22-Aug",
        stadium: "SCG",
        location: "Sydney, Australia",
        matchType: "T20",
        teamA: { name: "Sydney Sixers", score: "Yet to Bat", logo: "assets/sixers.png" },
        teamB: { name: "Melbourne Stars", score: "Yet to Bat", logo: "assets/stars.png" },
        resultStatus: "Match Start at 07:00 PM, 22-Aug",
        type: "upcoming"
      },
      {
        series: 'TNPL 2025 Finals',
        dateTime: "07:30 PM, 31-Aug",
        stadium: "Feroz Shah Kotla",
        location: "Delhi, India",
        matchType: "TNPL",
        teamA: { name: "Delhi Capitals", score: "Yet to Bat", logo: "assets/delhi.png" },
        teamB: { name: "Mumbai Indians", score: "Yet to Bat", logo: "assets/mumbai.png" },
        resultStatus: "Match Start at 07:30 PM, 23-Aug",
        type: "upcoming"
      },
      {
        series: 'India Women T20 Challenge 2025',
        dateTime: "06:00 PM, 31-Aug",
        stadium: "Wankhede",
        location: "Mumbai, India",
        matchType: "T20",
        teamA: { name: "India Womens", score: "Yet to Bat", logo: "assets/mumbai.png" },
        teamB: { name: "England Womes", score: "Yet to Bat", logo: "assets/csk.png" },
        resultStatus: "Match Start at 06:00 PM, 31-Aug",
        type: "upcoming"
      },
      {
        series: 'India U22 Women T20 Series 2025',
        dateTime: "09:00 PM, 1-sep",
        stadium: "Cape Town Stadium",
        location: "Cape Town, South Africa",
        matchType: "T20",
        teamA: { name: "India U22 Womes", score: "Yet to Bat", logo: "assets/capetown.png" },
        teamB: { name: "South Africa U22 Womes", score: "Yet to Bat", logo: "assets/jozi.png" },
        resultStatus: "Match Start at 09:00 PM, 1-sep",
        type: "upcoming"
      },



      //-- Live Matches (4)--
      {
        series: 'India Tour of England 2025',
        dateTime: "03:30 PM, 23-Aug",
        stadium: "County Ground",
        location: "Hove, England",
        matchType: "ODI",
        teamA: { name: "Sussex", score: "190/6 (20)", logo: "assets/sussex.png" },
        teamB: { name: "Hampshire", score: "150/3 (15)", logo: "assets/hampshire.png" },
        resultStatus: "Hampshire needs 41 runs in 30 balls",
        type: "live"
      },
      {
        series: 'India Tour of England 2025',
        dateTime: "03:15 PM, 22-Aug",
        stadium: "Chamundi Stadium",
        location: "Mysore, India",
        matchType: "T20",
        teamA: { name: "Dragons", score: "173/7 (20)", logo: "assets/dragons.png" },
        teamB: { name: "Mysore", score: "52/3 (6.1)", logo: "assets/mysore.png" },
        resultStatus: "Mysore needs 122 runs in 83 balls",
        type: "live"
      },


      {
        series: 'India vs Australia T20 Series 2025',
        dateTime: "12:30 PM, 23-Aug",
        stadium: "Oval",
        location: "London, England",
        matchType: "ODI",
        teamA: { name: "London Spirit", score: "120/4 (15)", logo: "assets/london.png" },
        teamB: { name: "Oval Invincibles", score: "90/3 (12)", logo: "assets/oval.png" },
        resultStatus: "Oval needs 122 runs in 60 balls",
        type: "live"
      },

      {
        series: 'India Tour of England 2025',
        dateTime: "03:00 PM, 21-Aug",
        stadium: "Ekana Stadium",
        location: "Lucknow, India",
        matchType: "T20",
        teamA: { name: "Noida", score: "185/10 (20)", logo: "assets/noida.png" },
        teamB: { name: "Kashi", score: "173/6 (19)", logo: "assets/kashi.png" },
        resultStatus: "Kashi needs 13 runs in 6 balls",
        type: "live"
      },

      //-- Result Matches (2)--

      {
        series: 'India A Women Tour of Australia 2025',
        dateTime: "11:00 AM, 23-Aug",
        stadium: "Abu Dhabi Stadium",
        location: "UAE",
        matchType: "T20",
        teamA: { name: "Team Abu Dhabi", score: "145/9 (20)", logo: "assets/abudhabi.png" },
        teamB: { name: "Sharjah Warriors", score: "150/5 (19)", logo: "assets/sharjah.png" },
        resultStatus: "Sharjah Warriors won by 5 wickets",
        type: "result"
      },
      {
        series: 'IPL 2025 Opening Match',
        dateTime: "10:00 AM, 24-Aug",
        stadium: "MCG",
        location: "Melbourne, Australia",
        matchType: "IPL",
        teamA: { name: "CSK", score: "250/7 (20)", logo: "assets/aus.png" },
        teamB: { name: "RCB", score: "200/10 (18)", logo: "assets/eng.png" },
        resultStatus: "CSK won by 50 runs",
        type: "Completed"
      },


    ];

  }

  /**-- Filtered Matches-- */
  get filteredMatches(): Match[] {
    /** Filters apply pannuthu summary cards */
    return this.matchescard.filter(match =>
      (!this.selectedStatus || match.status === this.selectedStatus) &&
      (!this.selectedGender || match.gender === this.selectedGender) &&
      (!this.selectedAgeGroup || match.ageGroup === this.selectedAgeGroup) &&
      (!this.selectedMatchType || match.matchType === this.selectedMatchType)
    );
  }

  /**-- Paginated Matches Card-- */
  get paginatedMatches(): Match[] {
    return this.filteredMatches.slice(this.first, this.first + this.rows);
  }



  /**-- Pagination Event-- */
  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  /**-- Paginated Points-- */
  get paginatedPointsMatches(): MatchDetail[] {
  return this.filteredPointsMatches.slice(this.pointsFirst, this.pointsFirst + this.pointsRows);
}
  /**-- Paginated Event points-- */
onPointsPageChange(event: any): void {
  this.pointsFirst = event.first;
  this.pointsRows = event.rows;
}


  /**-- Points Form Logic-- */
  showPointsForm(series: string, matchType?: string): void {
    this.selectedSeries = series;
    this.selectedMatchType = matchType || null;
    this.ShowPointsForm = true;
    this.resetPointsForm();
  }

  resetPointsForm(): void {
    /** Form close panruthu, matchType reset panruthu */
    this.pointsForm.reset();
  }

  closePointsForm(): void {
    /** Form close panruthu, matchType reset panruthu */
    this.ShowPointsForm = false;
    this.selectedMatchType = null;
  }
  /**-- Check if points available-- */
  hasPoints(series: string): boolean {
    return this.matchespoints.some(match => match.series === series);
  }

  get filteredPointsMatches(): MatchDetail[] {
    /**-- Filtered Points Matches-- */
    if (!this.selectedSeries) return [];
    return this.matchespoints.filter(match =>
      match.series === this.selectedSeries &&
      (!this.selectedMatchType || match.matchType === this.selectedMatchType)
    );
  }

  /**-- Get Match Type Counts-- */
  getMatchTypeCounts(series: string): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    this.matchespoints
      .filter(match => match.series === series)
      .forEach(match => {
        counts[match.matchType] = counts[match.matchType] ? counts[match.matchType] + 1 : 1;
      });
    return counts;
  }

  /**-- Total Filtered Cards Count-- */
  get totalData(): number {
    return this.filteredMatches.length;
  }








// Scorecard form logic 
showScorecard = false; 
selectedMatch: any; 
openScorecard(match: any) {
  this.selectedMatch = match;
  this.showScorecard = true;
}

closeScorecard() {
  this.showScorecard = false;
}
 activeTab = 'scorecard'; // default tab

  teamAbatting = [
    { player: 'Rohit Sharma', runs: 85, balls: 70, fours: 8, sixes: 3,  sR:121.42 },
    { player: 'Virat Kohli', runs: 120, balls: 95, fours: 10, sixes: 2, sR:126.31 },
    { player: 'KL Rahul', runs: 60, balls: 50, fours: 5, sixes: 1, sR:120.00 },
    { player: 'Suryakumar Yadav', runs: 45, balls: 30, fours: 4, sixes: 2, sR:150.00 },
    { player: 'Hardik Pandya', runs: 30, balls: 20, fours: 2, sixes: 1, sR:150.00 },
    { player: 'Dinesh Karthik', runs: 25, balls: 15, fours: 3, sixes: 0, sR:166.67 },
    { player: 'Rishabh Pant', runs: 15, balls: 10, fours: 1, sixes: 1, sR:150.00 },
    { player: 'Shikhar Dhawan', runs: 10, balls: 8, fours: 1, sixes: 0 ,sR:125.00 },
    { player: 'Yuzvendra Chahal', runs: 5, balls: 5, fours: 0, sixes: 0, sR:100.00 },
    { player: 'Bhuvneshwar Kumar', runs: 0, balls: 2, fours: 0, sixes: 0, sR:0.00 },
  ];
  teamBbatting = [
    { player: 'David Warner', runs: 75, balls: 60, fours: 7, sixes: 2, sR:125.00 },
    { player: 'Steve Smith', runs: 95, balls: 80, fours: 9, sixes: 1, sR:118.75 },
    { player: 'Marnus Labuschagne', runs: 50, balls: 40, fours: 6, sixes: 0, sR:125.00 },
    { player: 'Glenn Maxwell', runs: 40, balls: 25, fours: 4, sixes: 2, sR:160.00 },
    { player: 'Aaron Finch', runs: 35, balls: 20, fours: 3, sixes: 1, sR:175.00 },
    { player: 'Marcus Stoinis', runs: 20, balls: 15, fours: 2, sixes: 0, sR:133.33 },
    { player: 'Alex Carey', runs: 15, balls: 10, fours: 1, sixes: 1, sR:150.00 },
    { player: 'Pat Cummins', runs: 10, balls: 8, fours: 1, sixes: 0, sR:125.00 },
    { player: 'Mitchell Starc', runs: 5, balls: 5, fours: 0, sixes: 0, sR:100.00 },
    { player: 'Josh Hazlewood', runs: 0, balls: 2, fours: 0, sixes: 0, sR:0.00 },
  ];

  teamAbowling = [
    { player: 'Jasprit Bumrah', overs: 10, maidens:1, runs: 45, wickets: 3, econ:4.5 },
    { player: 'Ravindra Jadeja', overs: 8, maidens:0, runs: 40, wickets: 2, econ:5.0 },
    { player: 'Mohammed Shami', overs: 10, maidens:1, runs: 50, wickets: 1, econ:5.0 },
    { player: 'Kuldeep Yadav', overs: 10, maidens:0, runs: 60, wickets: 0, econ:6.0 },
    { player: 'Hardik Pandya', overs: 4, maidens:1, runs: 30, wickets: 1, econ:7.5 },
  ];
  teamBbowling = [
    { player: 'Pat Cummins', overs: 10, maidens:2, runs: 40, wickets: 4, econ:4.0 },
    { player: 'Mitchell Starc', overs: 10, maidens:1, runs: 50, wickets: 2, econ:5.0 },
    { player: 'Josh Hazlewood', overs: 10, maidens:0, runs: 55, wickets: 1, econ:5.5 },
    { player: 'Adam Zampa', overs: 10, maidens:0, runs: 65, wickets: 0, econ:6.5 },
    { player: 'Glenn Maxwell', overs: 4, maidens:0, runs: 35, wickets: 1, econ:8.75 },
  ];

  teamAsquad = ['Rohit Sharma', 'Virat Kohli', 'KL Rahul', 'Jasprit Bumrah', 'Ravindra Jadeja',
  'Suryakumar Yadav', 'Dinesh Karthik', 'Rishabh Pant', 'Shikhar Dhawan', 'Yuzvendra Chahal', 'Bhuvneshwar Kumar'
  ];

  teamBsquad = ['David Warner', 'Steve Smith', 'Marnus Labuschagne', 'Glenn Maxwell', 'Aaron Finch',
  'Marcus Stoinis', 'Alex Carey', 'Pat Cummins', 'Mitchell Starc', 'Josh Hazlewood'
  ];

 activeinnings: string = 'one';   // default to team A


// fall of wickets

fallOfWickets = [
  { player:'Rohit Sharma -',over:' 5.3',score:'30/1' },
  { player:'Virat Kohli -',over:' 10.1',score:'90/2' },
  { player:'KL Rahul -',over:' 15.4',score:'140/3' },
  { player:'Suryakumar Yadav -',over:' 19.5',score:'190/4' },
    
];


matchDetails = {
  tournament: 'INDIA IN ENGLAND TEST SERIES 2025',
  toss: 'England Won The Toss And Elected To Field',
  venue: 'Kennington Oval, London',
  onFieldUmpires: ['Ahsan Raza', 'Kumar Dharmasena'],
  thirdUmpire: 'Rod Tucker',
  referee: 'Jeff Crowe',
  playerOfTheMatch: 'Mohammed Siraj (India)',
  playerOfTheSeries: 'Shubman Gill And Harry Brook'
};


}
