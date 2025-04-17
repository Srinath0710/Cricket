import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { NgForm } from '@angular/forms';

interface City {
  name: string;
  code: string;
  state: string;
  country?: string;
  status: string;
}

@Component({
  selector: 'app-all-cities',
  imports: [
    CommonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    SidebarModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    DialogModule
  ],
  templateUrl: './all-cities.component.html',
  styleUrls: ['./all-cities.component.css']
})
export class AllCitiesComponent implements OnInit {

  sidebarVisible: boolean = false;
  isEditMode: boolean = false;
  viewMode: boolean = false;
  cities: City[] = [
    { name: 'Fayzabad', code: '', state: 'Badakhshan', country: 'Afghanistan', status: 'Active' },
    { name: 'Qala i Naw', code: '', state: 'Badgis', country: 'Afghanistan', status: 'Active' },
    { name: 'Pul-e-Khumri', code: '', state: 'Baglan', country: 'Afghanistan', status: 'Active' },
    { name: 'Mazar-i-Sharif', code: '', state: 'Balkh', country: 'Afghanistan', status: 'Active' },
  ];
  countries: { label: string; value: string }[] = [];
  states: { label: string; value: string }[] = [];

  currentCity: City = {
    name: '',
    code: '',
    state: '',
    country: '',
    status: ''
  };

  // Define the newSidebarState property
  newSidebarState = {
    country: '',
    stateCode: '',
    stateName: ''
  };

  ngOnInit() {
    this.countries = [
      { label: 'Afghanistan', value: 'Afghanistan' },
      { label: 'India', value: 'India' },
      { label: 'USA', value: 'USA' },
      { label: 'Germany', value: 'Germany' }
    ];
  }

  showAddStateDialog() {
    this.sidebarVisible = true;
    this.isEditMode = false;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach((control: any) => {
        if (control && typeof control.markAsTouched === 'function') {
          control.markAsTouched();
        }
      });
      return;
    }
  
    if (this.isEditMode) {
      const index = this.cities.findIndex(c => c.code === this.currentCity.code);
      if (index !== -1) {
        this.cities[index] = { ...this.currentCity };
      }
    } else {
      this.cities.push({ ...this.currentCity });
    }
  
    this.sidebarVisible = false;
    form.resetForm();
    this.currentCity = {
      name: '',
      code: '',
      state: '',
      country: '',
      status: ''
    };
  }
  onCancel(form: NgForm) {
    this.sidebarVisible = false;
    form.resetForm();
    this.newSidebarState = {
      country: '',
      stateCode: '',
      stateName: ''
    };

    this.isEditMode = false;
  }
  
}
