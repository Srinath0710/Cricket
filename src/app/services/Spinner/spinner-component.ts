import {Component, OnInit, ChangeDetectorRef, Injectable} from '@angular/core';
import { SpinnerService } from './spinner.service';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner-component.html',
  styleUrls: ['./spinner-component.css'],
  imports:[CommonModule]
})
@Injectable({
    providedIn: 'root',
})
export class SpinnerComponent implements OnInit {
  datas: any;

  envImagePath = environment.imagePath;


  constructor(private spinnerService: SpinnerService, private cdRef: ChangeDetectorRef) {

  }

//   ngOnInit() {
//   this.spinnerService.getSpinnerObserver().subscribe((status: string) => {
//     this.datas = status === 'start' ? 'on' : 'off';
//     this.cdRef.detectChanges(); // trigger change detection
//   });
// }

    // this.init();
ngOnInit(){
  this.init();
}
  init() {
   this.spinnerService.dataemitterr.subscribe((data)=>{
       this.datas=data;
   });
   }
  
  }

