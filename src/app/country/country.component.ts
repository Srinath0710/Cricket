import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';

interface Country {
  name: string;
  code?: string;
  status: string;
  region?: string;
  timezone?: string;
  capital?: string;
  iso2?: string;
  phoneCode?: string;
  subregion?: string;
  image?: string;
}

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    FileUploadModule,
    InputTextModule
  ],
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent {
  countries: Country[] = [
    { name: 'Afghanistan', code: 'AF', status: 'Active' },
    { name: 'Albania', code: 'AL', status: 'Active' },
    { name: 'Algeria', code: 'DZ', status: 'Active' }
  ];

  regions = [
    { label: 'Africa', value: 'Africa' },
    { label: 'Americas', value: 'Americas' },
    { label: 'Asia', value: 'Asia' },
    { label: 'Europe', value: 'Europe' },
    { label: 'Oceania', value: 'Oceania' }
  ];

  timezones = [
    { label: 'UTC-12:00', value: 'UTC-12:00' },
    { label: 'UTC-11:00', value: 'UTC-11:00' },
    { label: 'UTC-10:00', value: 'UTC-10:00' }
  ];

  displayModal: boolean = false;
  viewMode: boolean = false;
  imagePreview: string | null = null;
  selectedCountry: Country | null = null;
  newCountry: Country = this.getEmptyCountry();
  dialogWidth: string = '50vw';
  isEditMode: boolean = false;

  getEmptyCountry(): Country {
    return {
      name: '',
      code: '',
      status: 'Active',
      region: '',
      timezone: '',
      capital: '',
      iso2: '',
      phoneCode: '',
      subregion: ''
    };
  }

  showAddCountryDialog() {
    this.clearForm();
    this.isEditMode = false;
    this.displayModal = true;
  }

  onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addCountry(addAnother: boolean = false) {
    if (this.validateForm()) {
      this.newCountry.code = this.newCountry.iso2;
      this.countries.push({ ...this.newCountry });
      if (addAnother) {
        this.clearForm();
      } else {
        this.displayModal = false;
      }
    }
  }

  validateForm(): boolean {
    const c = this.newCountry;
    if (!c.name || !c.region || !c.timezone || !c.capital || !c.iso2 || !c.phoneCode || !c.subregion) {
      alert('Please fill all required fields');
      return false;
    }
    if (c.iso2.length !== 2) {
      alert('ISO Code 2 must be exactly 2 characters');
      return false;
    }
    return true;
  }

  clearForm() {
    this.newCountry = this.getEmptyCountry();
    this.imagePreview = null;
  }

  toggleStatus(country: Country): void {
    country.status = country.status === 'Active' ? 'Inactive' : 'Active';
  }

  deleteCountry(index: number) {
    if (confirm('Are you sure you want to delete this country?')) {
      this.countries.splice(index, 1);
    }
  }

  editCountry(country: Country) {
    this.isEditMode = true; 
    this.newCountry = { ...country };
    this.imagePreview = country.image || null;
    this.displayModal = true;
  }
}
