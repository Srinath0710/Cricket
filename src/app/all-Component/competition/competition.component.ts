import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../services/api.service';
import { URLCONSTANT } from '../../services/url-constant';
import { Compitition } from './competition.model';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.css',
  imports:[
    DropdownModule,
    TagModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    TableModule,
     ButtonModule, 
     InputTextModule,
     DialogModule,
     CalendarModule,
     HttpClientModule

    ],
    providers: [
      { provide: URLCONSTANT }
    ],
})
export class CompetitionComponent {
    searchKeyword: string = '';
    visible: boolean = false;
    isEditing: boolean = false;
    public ShowForm: any = false;
    position:'right'  = 'right';
    formGroup!: FormGroup ;
    backScreen: any
    selectedcompitition: any = null;
    visibleDialog: boolean = false;
    compitition:Compitition[]=[];
    compititionList: any[] = [];
    
    constructor(private fb: FormBuilder,private apiService:ApiService,private httpClient:HttpClient,private urlConstant: URLCONSTANT) {
    
    } 
    ngOnInit(){
   
      this.gridload();
    }
    showDialog() {
      this.isEditing = false;
      this.formGroup.reset();
      this.visible = true;
    }
    
    gridload(){
      this.apiService.get(this.urlConstant.compititionList).subscribe(res => {
        console.log(res);
        this.compititionList = res.data;
      
      });
      error: (err: any) => {
        console.error('Error loading Compitition list:', err);
      }
    }
    
    editCompitition(compitition: any, ) {
      console.log('Editing Compitition:', compitition);
      this.isEditing = true;
      this.formGroup.patchValue({ ...compitition });
      this.visible = true;
    }
    
    viewShowDialog() {
      this.visibleDialog = true
      this.backScreen = "overlay1"
    }
    viewCompitition(compitition:any) {
      this.selectedcompitition = compitition;
      this.visibleDialog = true;
    }
    toggleStatus(compitition: any) {
      compitition.status = compitition.status === 'Active' ? 'InActive' : 'Active';
      console.log(`Compitition status changed to: ${compitition.status}`);
    }
    
    onSubmit() {
      if (this.formGroup.invalid) return;
    
      const compititionData = this.formGroup.value;
    
      if (this.isEditing ) {
        this.compitition = Object.assign({}, compititionData);
        } 
        else {
          this.compitition.push(Object.assign({}, compititionData));
        }
    
      this.visible = false; 
    }
    
    }
    