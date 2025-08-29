
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

interface Match {
  series: string;
  // startDate: string;
  // endDate: string;
  matchType: string;
  gender: string;
  ageGroup: string;
  status: string;
}

@Component({
  selector: 'app-match-center',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './match-center.component.html',
  styleUrls: ['./match-center.component.css']
})
export class MatchCenterComponent {
  selectedSeries: string | null = null; // new property
  // Filters
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

  selectedStatus: string | null = null;
  selectedGender: string | null = null;
  selectedAgeGroup: string | null = null;
  selectedMatchType: string | null = null;

  matchescard: Match[] = [
    { series: 'India Tour of England 2025', matchType: 'Test', gender: 'Men', ageGroup: 'Senior', status: 'Live' },
    { series: 'India Mens U19 Tour of England 2025', matchType: 'ODI', gender: 'Men', ageGroup: 'Under 19', status: 'Upcoming' },
    { series: 'India Women Tour of England 2025', matchType: 'Test', gender: 'Women', ageGroup: 'Senior', status: 'Upcoming' },
    { series: 'India A Women Tour of Australia 2025', matchType: 'ODI', gender: 'Women', ageGroup: 'Senior', status: 'Completed' },
    { series: 'India vs Australia T20 Series 2025', matchType: 'T20', gender: 'Men', ageGroup: 'Senior', status: 'Live' },
    { series: 'TNPL 2025 Finals', matchType: 'TNPL', gender: 'Men', ageGroup: 'Senior', status: 'Upcoming' },
    { series: 'IPL 2025 Opening Match', matchType: 'IPL', gender: 'Men', ageGroup: 'Senior', status: 'Completed' },
    { series: 'India Women T20 Challenge 2025', matchType: 'T20', gender: 'Women', ageGroup: 'Senior', status: 'Upcoming' },
    { series: 'India U16 Tour of Sri Lanka 2025', matchType: 'ODI', gender: 'Men', ageGroup: 'Under 16', status: 'Live' },
    { series: 'India U22 Women T20 Series 2025', matchType: 'T20', gender: 'Women', ageGroup: 'Under 22', status: 'Upcoming' }
  ];
  // Filtered matchescard
  get filteredMatches() {
    return this.matchescard.filter(matchescard =>
      (!this.selectedStatus || matchescard.status === this.selectedStatus) &&
      (!this.selectedGender || matchescard.gender === this.selectedGender) &&
      (!this.selectedAgeGroup || matchescard.ageGroup === this.selectedAgeGroup) &&
      (!this.selectedMatchType || matchescard.matchType === this.selectedMatchType)
    );
  }
  getMatchTypeCounts(series: string) {
    const counts: { [key: string]: number } = {};
    this.matchespoints
      .filter(match => match.series === series)
      .forEach(match => {
        const type = match.matchType;
        counts[type] = counts[type] ? counts[type] + 1 : 1;
      });
    return counts;
  }


  matchespoints = [

    
    

    {
      series: 'India Women Tour of England 2025',
      dateTime: "10:00 AM, 24-Aug",
      stadium: "MCG",
      location: "Melbourne, Australia",
      matchType: "Test",
      teamA: { name: "AUS", score: "143/7 (16)", logo: "assets/aus.png" },
      teamB: { name: "ENG", score: "173/2 (11)", logo: "assets/eng.png" },
      resultStatus: "Match scheduled",
      type: "upcoming"
    },

    {
      series: 'India Women Tour of England 2025',
      dateTime: "10:00 AM, 24-Aug",
      stadium: "MCG",
      location: "Melbourne, Australia",
      matchType: "Test",
      teamA: { name: "AUS", score: "113/7 (10)", logo: "assets/aus.png" },
      teamB: { name: "ENG", score: "133/9 (8)", logo: "assets/eng.png" },
      resultStatus: "Match scheduled",
      type: "upcoming"
    },

    {
      series: 'India Women Tour of England 2025',
      dateTime: "10:00 AM, 24-Aug",
      stadium: "MCG",
      location: "Melbourne, Australia",
      matchType: "Test",
      teamA: { name: "AUS", score: "183/3 (6.2)", logo: "assets/aus.png" },
      teamB: { name: "ENG", score: "173/1 (9.5)", logo: "assets/eng.png" },
      resultStatus: "Match scheduled",
      type: "upcoming"
    },

    {
      series: 'India Women Tour of England 2025',
      dateTime: "10:00 AM, 24-Aug",
      stadium: "MCG",
      location: "Melbourne, Australia",
      matchType: "Test",
      teamA: { name: "AUS", score: "137/5 (9.1)", logo: "assets/aus.png" },
      teamB: { name: "ENG", score: "193/3 (2.6)", logo: "assets/eng.png" },
      resultStatus: "Match scheduled",
      type: "upcoming"
    },

    {
      series: 'India Women Tour of England 2025',
      dateTime: "10:00 AM, 24-Aug",
      stadium: "MCG",
      location: "Melbourne, Australia",
      matchType: "Test",
      teamA: { name: "AUS", score: "123/0 (9.5)", logo: "assets/aus.png" },
      teamB: { name: "ENG", score: "143/1 (18.5)", logo: "assets/eng.png" },
      resultStatus: "Match scheduled",
      type: "upcoming"
    },



    
    // ---------------- Upcoming Matches (6) ----------------
  
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
   


    // ---------------- Live Matches (4) ----------------
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

    // ---------------- Result Matches (2) ----------------
    
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

  // Points form logic
  public ShowPointsForm: boolean = false;
  pointsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.pointsForm = this.fb.group({

    });
  }

  showPointsForm(series: string, matchType?: string) {
    this.selectedSeries = series; this.selectedMatchType = matchType || null; 
    this.selectedSeries = series;
    this.selectedMatchType = matchType || null;
    this.ShowPointsForm = true;
    this.resetPointsForm();
  }



  resetPointsForm() {
    this.pointsForm.reset();
  }

  closePointsForm() {
    this.ShowPointsForm = false;
    this.selectedMatchType = null; // reset filter
  }

hasPoints(series: string): boolean {
  // Check if there is any points data for this series
  return this.matchespoints.some(match => match.series === series);
}

  get filteredPointsMatches() {
    if (!this.selectedSeries) return [];
    return this.matchespoints.filter(match =>
      match.series === this.selectedSeries &&
      (!this.selectedMatchType || match.matchType === this.selectedMatchType)
    );
  }


}
