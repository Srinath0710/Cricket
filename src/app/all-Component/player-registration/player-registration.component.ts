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

    ]
})


export class PlayerRegistrationComponent {
// players: FormGroup<any> | undefined;
searchKeyword: string = '';
visible: boolean = false;
isEditing: boolean = false;
public ShowForm: any = false;
position:'right'  = 'right';
formGroup!: FormGroup ;

constructor(private fb: FormBuilder) {

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
  // this.loadPlayers();
}
showDialog() {
  this.isEditing = false;
  this.formGroup.reset();
  this.visible = true;
}

gridload(){
}

// loadPlayers() {
//   this.http.get<any[]>('assets/data/players.json').subscribe({
//     next: (data) => {
//       console.log('Loaded player data:', data);
//       this.players = data;
//     },
//     error: (err) => {
//       console.error('Failed to load JSON:', err);
//     }
//   });
// }

players = [
  { name: 'Virat Kholi', dob: '1995-06-15', nationality: 'IND', batStyle: 'Righthand', bowlSpec: 'Fast',BowlSpe:'medium',Bowls:'fast',Bowl:'spin',Bowl1:'spin',Bowl2:'spin',Bowl3:'spin',Bowl4:'spin',Bowl5:'spin', status: 'Active',imageUrl: 'assets/virat.png' },
  { name: 'Dhoni', dob: '1998-08-10', nationality: 'IND', batStyle: 'Lefthand', bowlSpec: 'Spin', BowlSpe:'medium',Bowls:'fast',Bowl:'spin',Bowl1:'spin',Bowl2:'spin',Bowl3:'spin',Bowl4:'spin',Bowl5:'spin', status: 'Active' },
  { name: 'Raina', dob: '1998-08-20', nationality: 'IND', batStyle: 'Lefthand', bowlSpec: 'Spin', Bowlspe:'medium',Bowls:'fast',Bowl:'spin',Bowl1:'spin',Bowl2:'spin',Bowl3:'spin',Bowl4:'spin',Bowl5:'spin', status: 'Inactive' },
  { name: 'Smith', dob: '1998-08-20', nationality: 'IND', batStyle: 'Lefthand', bowlSpec: 'Spin', BowlSpe:'medium',Bowls:'fast',Bowl:'spin',Bowl1:'spin',Bowl2:'spin',Bowl3:'spin',Bowl4:'spin',Bowl5:'spin', status: 'Inactive' },
  { name: 'Dhoni', dob: '1998-08-20', nationality: 'IND', batStyle: 'Lefthand', bowlSpec: 'Spin', BowlSpe:'medium',Bowls:'fast',Bowl:'spin',Bowl1:'spin',Bowl2:'spin',Bowl3:'spin',Bowl4:'spin',Bowl5:'spin', status: 'Active' },
  { name: 'Dhoni', dob: '1998-08-20', nationality: 'IND', batStyle: 'Lefthand', bowlSpec: 'Spin', BowlSpe:'medium',Bowls:'fast',Bowl:'spin',Bowl1:'spin',Bowl2:'spin',Bowl3:'spin',Bowl4:'spin',Bowl5:'spin', status: 'Active' },
  { name: 'Dhoni', dob: '1998-08-20', nationality: 'IND', batStyle: 'Lefthand', bowlSpec: 'Spin', BowlSpe:'medium',Bowls:'fast',Bowl:'spin',Bowl1:'spin',Bowl2:'spin',Bowl3:'spin',Bowl4:'spin',Bowl5:'spin', status: 'Active' },
];

editPlayer(player: any, ) {
  console.log('Editing Player:', player);
  this.isEditing = true;
  this.formGroup.patchValue({ ...player });
  this.visible = true;
}

  
viewPlayer(player: any) {
  console.log('Viewing Player:', player);
}
toggleStatus(player: any) {
  player.status = player.status === 'Active' ? 'Inactive' : 'Active';
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
