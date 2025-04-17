import { Component , OnInit } from '@angular/core';
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



interface State {
  name: string;
  code: string;
  country: string;
  status: string;

}

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [CommonModule, DropdownModule,InputTextModule ,FormsModule,SidebarModule ,TableModule,ButtonModule,BadgeModule,DialogModule ],
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit { 
   sidebarVisible: boolean = false;
  states: State[] = [
    { name: 'Badakhshan', code: '', country: 'Afghanistan', status: 'Active' },
    { name: 'Badgis', code: '', country: 'Afghanistan', status: 'Active' },
    { name: 'Baglan', code: '', country: 'Afghanistan', status: 'Active' },
    { name: 'Balkh', code: '', country: 'Afghanistan', status: 'Active' },
  ];
  
  newSidebarState: any = {    
    country: '',
    stateCode: '',
    stateName: ''
    
  };
  
  cities: City[] = [];
  selectedState: any;
  selectedCity: City | undefined;
  viewMode: boolean = false;
  displayModal: boolean = false;
  isEditMode: boolean = false;
  getEmptyCountry(): State {
    return {
      name: '',
      code: '',
      country: '',  
      status: 'Active'
    };
}


  ngOnInit() {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
  }
  countries = [
    { name: 'Afghanistan' },
    { name: 'India' },
    { name: 'USA' },
    { name: 'Australia' }
  ];
  
  openSidebar() {
    this.sidebarVisible = true;
  }
  
 
  closeSidebar() {
    this.sidebarVisible = false;
     this.resetForm();
  }
  saveState() {
    if (this.newSidebarState.country && this.newSidebarState.stateCode && this.newSidebarState.stateName) {
      const newState: State = {
        country: this.newSidebarState.country,
        code: this.newSidebarState.stateCode,
        name: this.newSidebarState.stateName,
        status: 'Active' 
      };
      this.states.push(newState);
      this.closeSidebar();
    } else {
      alert('Please fill all fields!');
    }
  }

  
  resetForm() {
    this.newSidebarState = {
      country: '',
      stateCode: '',  
      stateName: ''
    };
  }



 

  

  newState: State = { name: '', code: '', country: '', status: 'Active' };

  
  showAddStateDialog() {
    this.sidebarVisible = true;
    this.isEditMode = false;
  
  }
  

  addState(addAnother: boolean = false) {
    if (this.newSidebarState.stateName && this.newSidebarState.country) {
      this.states.push({
        name: this.newSidebarState.stateName,
        code: this.newSidebarState.stateCode,
        country: this.newSidebarState.country,
        status: 'Active'
      });
      if (!addAnother) {
        this.sidebarVisible = false;
      } else {
        this.newSidebarState = { country: '', stateCode: '', stateName: '' }; 
      }
    } else {
      this.displayModal = false;

    }
  }
  saveEditedState() {
    // if (this.newSidebarState.country && this.newSidebarState.stateCode && this.newSidebarState.stateName) {
    //   this.selectedState.name = this.newSidebarState.stateName;
    //   this.selectedState.code = this.newSidebarState.stateCode;
    //   this.selectedState.country = this.newSidebarState.country;
    //   this.closeSidebar(); 
    // } else {
    //   alert('Please fill all fields!');
    // }
  }
  

 
  toggleStatus(state: State) {
    state.status = state.status === 'Active' ? 'Inactive' : 'Active';
  }
  

 
  deleteState(index: number) {
    if (confirm('Are you sure you want to delete this state?')) {
      this.states.splice(index, 1);
    }
  }
  clearForm() {
    this.newState= this.getEmptyCountry();
  }


 
  viewState(state: State) {
    alert(`State: ${state.name}\nCode: ${state.code}\nCountry: ${state.country}\nStatus: ${state.status}`);
  }
  editCountry(state: State) {
    // this.selectedState = state;
    // this.isEditMode = true;
    // this.sidebarVisible = true;
    // this.newSidebarState = {
    //   country: state.country,
    //   stateCode: state.code,
    //   stateName: state.name
    // };
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
  
    const newState: State = {
      name: this.newSidebarState.stateName,
      code: this.newSidebarState.stateCode,
      country: this.newSidebarState.country,
      status: 'Active'
    };
  
    if (this.isEditMode) {
      const index = this.states.findIndex(s => s.code === this.selectedState.code);
      if (index !== -1) {
        this.states[index] = { ...newState };
      }
    } else {
      this.states.push(newState);
    }
  
    this.sidebarVisible = false;
  
    this.newSidebarState = {
      country: '',
      stateCode: '',
      stateName: ''
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

