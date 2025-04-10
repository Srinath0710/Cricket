import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { officials } from './officials.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { URLCONSTANT } from '../../services/url-constant';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SidebarModule } from 'primeng/sidebar';
@Component({
  selector: 'app-officials',
  templateUrl: './officials.component.html',
  styleUrl: './officials.component.css',
  imports: [
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
     HttpClientModule,
     DrawerModule,
     SidebarModule
    ],
     providers: [
      { provide: URLCONSTANT }
    ],
})
export class OfficialsComponent {
    searchKeyword: string = '';
    visible: boolean = false;
    isEditing: boolean = false;
    public ShowForm: any = false;
    position:'right'  = 'right';
    formGroup!: FormGroup ;
    backScreen: any
    selectedOfficial: any = null;
    visibleDialog: boolean = false;
    official:officials[]=[];
    officialList: any[] = [];
    sidebarVisible: boolean = false;
    isEditMode: boolean = false;

    constructor(private fb: FormBuilder,private apiService:ApiService,private httpClient:HttpClient,private urlConstant: URLCONSTANT) {
    
    } 
  
    
    ngOnInit(){
    
      this.gridload();
    }
    showDialog() {
      this.sidebarVisible = true;
      this.isEditMode = false;
    }
    onSidebarHide() {
      this.sidebarVisible = false;
    }
    
    gridload(){
      this.apiService.get(this.urlConstant.officialList).subscribe(res => {
        console.log(res);
        this.officialList = res.data;
      
      });
      error: (err: any) => {
        console.error('Error loading official list:', err);
      }
    }
    
    editofficial(official: any, ) {
      console.log('Editing Official:', official);
      this.isEditing = true;
      this.formGroup.patchValue({ ...official });
      this.visible = true;
    }
    
    viewShowDialog() {
      this.visibleDialog = true
      this.backScreen = "overlay1"
    }
    viewofficial(official:any) {
      this.selectedOfficial = official;
      this.visibleDialog = true;
    }
    toggleStatus(official: any) {
      official.status = official.status === 'Active' ? 'InActive' : 'Active';
      console.log(`Official status changed to: ${official.status}`);
    }
    
    onSubmit() {
      if (this.formGroup.invalid) return;
    
      const officialData = this.formGroup.value;
    
      if (this.isEditing ) {
        this.official = Object.assign({}, officialData);
        } 
        else {
          this.official.push(Object.assign({}, officialData));
        }
    
      this.visible = false; 
    }

    }
    