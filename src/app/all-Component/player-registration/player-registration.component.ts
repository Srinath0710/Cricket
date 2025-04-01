import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';

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
    ]
})


export class PlayerRegistrationComponent {
// players: FormGroup<any> | undefined;
associationForm: FormGroup;
searchKeyword: string = '';
visible: boolean = false;

public ShowForm: any = false;



formGroup: FormGroup | undefined;


constructor(private fb: FormBuilder) {
  this.associationForm = this.fb.group({
    association: ['', Validators.required]
  });
}
ngOnInit(){

}


showDialog() {
  this.visible = true;
}
gridload(){

}
players = [
  { name: 'Virat', dob: '1995-06-15', nationality: 'IND', batStyle: 'Right-hand', bowlSpec: 'Fast', regNo: '12345', mobile: '98343210', extRefId: 'A1B2C3', status: 'Active' },
  { name: 'Dhoni', dob: '1998-08-20', nationality: 'IND', batStyle: 'Left-hand', bowlSpec: 'Spin', regNo: '67890', mobile: '987653211', extRefId: 'D4E5F6', status: 'Inactive' },
  { name: 'Raina', dob: '1998-08-20', nationality: 'IND', batStyle: 'Left-hand', bowlSpec: 'Spin', regNo: '67890', mobile: '987653211', extRefId: 'D4E5F6', status: 'Inactive' },
  { name: 'Smith', dob: '1998-08-20', nationality: 'IND', batStyle: 'Left-hand', bowlSpec: 'Spin', regNo: '67890', mobile: '987653211', extRefId: 'D4E5F6', status: 'Inactive' },
  { name: 'Dhoni', dob: '1998-08-20', nationality: 'IND', batStyle: 'Left-hand', bowlSpec: 'Spin', regNo: '67890', mobile: '987653211', extRefId: 'D4E5F6', status: 'Inactive' },
];

editPlayer(player: any) {
  console.log('Edit Player:', player);
}
viewPlayer(player: any) {
  console.log('Viewing Player:', player);
}
toggleStatus(player: any) {
  player.status = player.status === 'Active' ? 'Inactive' : 'Active';
  console.log(`Player status changed to: ${player.status}`);
}
// filterGlobal($event:any, stringVal:any) {
//   this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
// }

}
