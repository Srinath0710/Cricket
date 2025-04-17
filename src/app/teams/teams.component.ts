import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';

interface Team {
  teamName: string;
  ageGroup: string;
  format: string;
  country: string;
  status: string;
}

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    FormsModule,
    DropdownModule,
    FileUploadModule,
    InputTextModule,
    SidebarModule
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {
  teams: Team[] = [
    {
      teamName: 'India U19',
      ageGroup: 'U-19',
      format: 'ODI',
      country: 'India',
      status: 'Active'
    },
    {
      teamName: 'Australia Seniors',
      ageGroup: 'Senior',
      format: 'Test',
      country: 'Australia',
      status: 'Inactive'
    },
    {
      teamName: 'England T20',
      ageGroup: 'Senior',
      format: 'T20',
      country: 'England',
      status: 'Active'
    }
  ];

  ageGroups = [
    { label: 'U-16', value: 'U-16' },
    { label: 'U-19', value: 'U-19' },
    { label: 'Senior', value: 'Senior' }
  ];

  formats = [
    { label: 'T20', value: 'T20' },
    { label: 'ODI', value: 'ODI' },
    { label: 'Test', value: 'Test' }
  ];

  countries = [
    { label: 'India', value: 'India' },
    { label: 'Australia', value: 'Australia' },
    { label: 'England', value: 'England' },
    { label: 'South Africa', value: 'South Africa' },
    { label: 'New Zealand', value: 'New Zealand' }
  ];

  countriesList = this.countries;

  displayModal = false;
  isEditMode = false;
  viewMode = false;
  imagePreview: string | null = null;
  selectedTeam: Team | null = null;
  newTeams: Team = this.getEmptyTeam();
nameRef: any;

  getEmptyTeam(): Team {
    return {
      teamName: '',
      ageGroup: '',
      format: '',
      country: '',
      status: 'Active'
    };
  }

  showAddTeamDialog(): void {
    this.isEditMode = false;
    this.viewMode = false;
    this.displayModal = true;
  }
  addTeams(addAnother: boolean = false): void {
    if (this.validateForm()) {
      if (this.isEditMode) {
        const index = this.teams.findIndex(t => t.teamName === this.selectedTeam?.teamName);
        if (index !== -1) {
          this.teams[index] = { ...this.newTeams };
        }
      } else {
        this.teams.push({ ...this.newTeams });
      }

      if (addAnother) {
        
        this.displayModal = true;
        this.cancelForm();
       // this.showAddTeamDialog();
      } else {
        this.displayModal = false;
      }
    }
  }

  validateForm(): boolean {
    const t = this.newTeams;
    if (!t.teamName || !t.ageGroup || !t.format || !t.country) {
      return false;

    }
    return true;
  }

  clearForm(): void {
    this.newTeams = this.getEmptyTeam();
    this.imagePreview = null;
  }
  
  cancelForm(): void {
    this.displayModal = false;
    this.clearForm();
  }

  toggleStatus(team: Team): void {
    team.status = team.status === 'Active' ? 'Inactive' : 'Active';
  }

  editTeams(team: Team): void {
    this.isEditMode = true;
    this.viewMode = false;
    this.selectedTeam = team;
    this.newTeams = { ...team };
    this.displayModal = true;
  }

  viewTeams(team: Team): void {
    this.isEditMode = false;
    this.viewMode = true;
    this.selectedTeam = team;
    this.displayModal = true;
  }

  deleteTeams(index: number): void {
    if (confirm('Are you sure you want to delete this team?')) {
      this.teams.splice(index, 1);
    }
  }
}
