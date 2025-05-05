import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';  
import { PaginatorModule } from 'primeng/paginator';
import { PlayerConstants } from '../constants/player.constant';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Players } from './player-registration.model';
import { ApiService } from '../../services/api.service';
import { URLCONSTANT } from '../../services/url-constant';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-player-registration',
  templateUrl: './player-registration.component.html',
  styleUrl: './player-registration.component.css',
  imports:[
    DropdownModule,
    TagModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    CalendarModule,
    HttpClientModule,
    PaginatorModule,
    TooltipModule
  ],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
})
export class PlayerRegistrationComponent {
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  submitted: boolean = true;
  PlayerData: any[] = [];
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10; // Default records shown is 10
  totalData: any = 0;
  
  searchKeyword: string = '';
  visible: boolean = false;
  isEditing: boolean = false;
  public ShowForm: any = false;
  position:'right'  = 'right';
  formGroup!: FormGroup;
  backScreen: any;
  selectedPlayer: any = null;
  visibleDialog: boolean = false;
  players: Players[] = [];
  playerList: any[] = [];
  showFilters: boolean = false;
  
  // Filter options
  filterStatus: string = '';
  filterPlayerType: string = '';

  constructor(
    private formBuilder: FormBuilder, 
    private apiService: ApiService, 
    private urlConstant: URLCONSTANT, 
    private msgService: MessageService,
    private confirmationService: ConfirmationService,
    public cricketKeyConstant: CricketKeyConstant
  ) {}
  
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      dob: [null],
      nationality: [''],
      batStyle: ['', Validators.required],
      bowlSpec: ['', Validators.required],
      status: ['Active'],
    });
    
    this.gridLoad();
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  resetForm() {
    this.formGroup.reset();
    this.submitted = false;
  }

  showAddForm() {
    this.ShowForm = true;
  }

  gridLoad() {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = '1';//this.client_id?.toString();
    params.page_no = this.first.toString();
    params.records = this.rows.toString();
    
    
    if (this.filterStatus) {
      params.status = this.filterStatus;
    }
    if (this.filterPlayerType) {
      params.player_type = this.filterPlayerType;
    }
    
    this.apiService.post(this.urlConstant.getplayerlist, params).subscribe(
      (res) => {
        this.PlayerData = res.data.players ?? [];
        this.totalData = res.data.total_records || 50;
        
        this.PlayerData.forEach((val: any) => {
          val.profile_img = `${val.profile_img}?${Math.random()}`;
        });
      }, 
      (err: any) => {
        if (err.status === this.cricketKeyConstant.status_code.refresh && 
            err.error.message === this.cricketKeyConstant.status_code.refresh_msg) {
          this.apiService.RefreshToken();
        } else {
          this.PlayerData = [];
          this.totalData = this.PlayerData.length;
          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load players'
          });
        }
      }
    );
  }

  editPlayer(player: any) {
    console.log('Editing Player:', player);
    this.isEditing = true;
    this.formGroup.patchValue({ ...player });
    this.visible = true;
  }

  viewShowDialog() {
    this.visibleDialog = true;
    this.backScreen = "overlay1";
  }
  
  viewPlayer(player: any) {
    this.selectedPlayer = player;
    this.visibleDialog = true;
  }
  
  toggleStatus(player: any) {
    player.status = player.status === 'Active' ? 'InActive' : 'Active';
    console.log(`Player status changed to: ${player.status}`);
    
    this.msgService.add({
      severity: 'success',
      summary: 'Status Updated',
      detail: `Player status changed to ${player.status}`
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) return;

    const playerData = this.formGroup.value;

    if (this.isEditing) {
      this.players = Object.assign({}, playerData);
    } else {
      this.players.push(Object.assign({}, playerData));
    }

    this.visible = false;
    
    this.msgService.add({
      severity: 'success',
      summary: this.isEditing ? 'Player Updated' : 'Player Created',
      detail: `Player ${this.isEditing ? 'updated' : 'created'} successfully`
    });
  }
  
  applyFilters() {
    
    this.first = 1;
    
    
    this.gridLoad();
    
    
    this.showFilters = false;
    
    this.msgService.add({
      severity: 'info',
      summary: 'Filters Applied',
      detail: 'Player list has been filtered'
    });
  }
  
  onPageChange(event: any) {
    this.first = Math.floor(event.first / event.rows) + 1;
    this.rows = event.rows;
    this.gridLoad();
  }
}