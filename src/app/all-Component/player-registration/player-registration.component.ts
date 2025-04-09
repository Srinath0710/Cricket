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
import { PlayerConstants } from '../constants/player.constant';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Players } from './player-registration.model';
import { ApiService } from '../../services/api.service';
import { URLCONSTANT } from '../../services/url-constant';

@Component({
  selector: 'app-player-registration',
  templateUrl: './player-registration.component.html',
  styleUrl: './player-registration.component.css',
  imports:[DropdownModule,
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


export class PlayerRegistrationComponent {
// players: FormGroup<any> | undefined;
searchKeyword: string = '';
visible: boolean = false;
isEditing: boolean = false;
public ShowForm: any = false;
position:'right'  = 'right';
formGroup!: FormGroup ;
backScreen: any
selectedPlayer: any = null;
visibleDialog: boolean = false;
players:Players[]=[];
playerList: any[] = [];
constructor(private fb: FormBuilder,private apiService:ApiService,private httpClient:HttpClient,private urlConstant: URLCONSTANT) {

} 
ngOnInit(){
  this.formGroup = this.fb.group({
    name: ['', Validators.required],
    dob: [null],
    nationality: [''],
    batStyle: ['', Validators.required],
    bowlSpec: ['', Validators.required],
    status: ['Active'],
    
  });
  this.gridload();
}
showDialog() {
  this.isEditing = false;
  this.formGroup.reset();
  this.visible = true;
}

gridload(){
  this.apiService.get(this.urlConstant.playerList).subscribe(res => {
    console.log(res);
    this.playerList = res.data;
  
  });
  error: (err: any) => {
    console.error('Error loading player list:', err);
  }
}

editPlayer(player: any, ) {
  console.log('Editing Player:', player);
  this.isEditing = true;
  this.formGroup.patchValue({ ...player });
  this.visible = true;
}

viewShowDialog() {
  this.visibleDialog = true
  this.backScreen = "overlay1"
}
viewPlayer(player:any) {
  this.selectedPlayer = player;
  this.visibleDialog = true;
}
toggleStatus(player: any) {
  player.status = player.status === 'Active' ? 'InActive' : 'Active';
  console.log(`Player status changed to: ${player.status}`);
}

onSubmit() {
  if (this.formGroup.invalid) return;

  const playerData = this.formGroup.value;

  if (this.isEditing ) {
    this.players = Object.assign({}, playerData);
    } 
    else {
      this.players.push(Object.assign({}, playerData));
    }

  this.visible = false; 
}

}
