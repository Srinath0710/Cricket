import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-player-analysis',
  imports: [
    FormsModule,
    MultiSelectModule,
    CommonModule,
    CheckboxModule,
    ToggleSwitch,TableModule,DialogModule,ConfirmDialogModule
  ],
  templateUrl: './player-analysis.component.html',
  styleUrl: './player-analysis.component.css'
})
export class PlayerAnalysisComponent {
  showFilters: boolean = false;
  checked: boolean = false;
  size: any = false;
  viewDialogVisible: boolean = false;
  selectedGroup: string = '';

categories = [
  { name: 'ODI', value: 'odi' },
  { name: 'T20', value: 't20' },
  { name: 'Test', value: 'test' }
];

regions = [
  { name: 'Asia', selected: false },
  { name: 'Europe', selected: false },
  { name: 'America', selected: false }
];

countries = [
  { name: 'India', selected: false },
  { name: 'Australia', selected: false },
  { name: 'England', selected: false }
];

  formats = [
    { name: 'Test', code: 'TEST' },
    { name: 'ODI', code: 'ODI' },
    { name: 'T20', code: 'T20' }
  ];
  selectedFormats: any[] = [];

  years = [
    { name: '2024', code: '2024' },
    { name: '2023', code: '2023' },
    { name: '2022', code: '2022' },
    { name: '2021', code: '2021' },
    { name: '2020', code: '2020' },
    { name: '2019', code: '2019' },
    { name: '2018', code: '2018' },
    { name: '2017', code: '2017' },
    { name: '2016', code: '2016' },
    { name: '2015', code: '2015' },
  ];
  competition = [
  { name: 'Icc Champions Trophy', value: 'icc_champions_trophy' },
  { name: 'T20 World Cup', value: 't20_world_cup' },
  { name: 'Test Championship', value: 'test_championship' },
  { name: 'Asia Cup', value: 'asia_cup' },
  { name: 'World Cup', value: 'world_cup' },
  { name: 'Champions Trophy', value: 'champions_trophy' }
];
BattingTeams = [
  { name: 'India', value: 'India' },
  { name: 'Australia', value: 'Australia' },
  { name: 'England', value: 'England' },
  { name: 'South Africa', value: 'South Africa' },
  { name: 'New Zealand', value: 'New Zealand' } ,
  { name: 'Pakistan', value: 'Pakistan' },
  { name: 'Sri Lanka', value: 'Sri Lanka' },
  { name: 'West Indies', value: 'West Indies' },
  { name: 'Bangladesh', value: 'Bangladesh' }
];
BattingStyles = [
  { name: 'Right Hand Bat', value: 'RHB' },
  { name: 'Left Hand Bat', value: 'LHB' },
];
Batters = [
  { name: 'Virat Kohli', value: 'Virat Kohli' },
  { name: 'Rohit Sharma', value: 'Rohit Sharma' },
  { name: 'Steve Smith', value: 'Steve Smith' },
  { name: 'Joe Root', value: 'Joe Root' },
  { name: 'Kane Williamson', value: 'Kane Williamson' },
  { name: 'Babar Azam', value: 'Babar Azam' },
  { name: 'Mushfiqur Rahim', value: 'Mushfiqur Rahim' },
  { name: 'Shakib Al Hasan', value: 'Shakib Al Hasan' },
  { name: 'Quinton de Kock', value: 'Quinton de Kock' },
  { name: 'David Warner', value: 'David Warner' },
  { name: 'AB de Villiers', value: 'AB de Villiers' }
];
Grounds = [
  { name: 'Eden Gardens', value: 'Eden Gardens' },
  { name: 'Lord\'s', value: 'Lord\'s' },
  { name: 'Melbourne Cricket Ground', value: 'Melbourne Cricket Ground' },
  { name: 'Wankhede Stadium', value: 'Wankhede Stadium' },
  { name: 'Sydney Cricket Ground', value: 'Sydney Cricket Ground' },
  { name: 'Old Trafford', value: 'Old Trafford' },
  { name: 'The Oval', value: 'The Oval' },
  { name: 'Newlands', value: 'Newlands' },
  { name: 'Galle International Stadium', value: 'Galle International Stadium' }
];
  ApplyFilters() {
    console.log("Filters Applied");
  }
  ResetFilters() {
    console.log("Filters Reset");
  }

tableData = [
  { batter: 'Raina', innings: 'First', runs: '1213', average: '89', strikeRate: '127', centuries: '5/10' },
  { batter: 'Dhoni', innings: 'Second', runs: '7847', average: '97', strikeRate: '146', centuries: '3/8' },
  { batter: 'Rohit', innings: 'First', runs: '1212', average: '90', strikeRate: '122', centuries: '2/5' },
  { batter: 'Kohli', innings: 'Second', runs: '2131', average: '89', strikeRate: '132', centuries: '1/3' },
  { batter: 'Chen', innings: 'First', runs: '9545', average: '90', strikeRate: '231', centuries: '4/6 '}
];



}
