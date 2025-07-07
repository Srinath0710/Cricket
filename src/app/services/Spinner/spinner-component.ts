import { Component, OnInit, ChangeDetectorRef, Injectable } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner-component.html',
  styleUrls: ['./spinner-component.css'],
  imports: [CommonModule]
})
@Injectable({
  providedIn: 'root',
})
export class SpinnerComponent implements OnInit {
  datas: any;

  envImagePath = environment.imagePath;


  constructor(private spinnerService: SpinnerService, private cdRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.init();
  }
  init() {
    this.spinnerService.dataemitterr.subscribe((data) => {
      if (data == 'on') {
        this.datas = data;

      }
      else {
        setTimeout(() => {
          this.datas = data;
        }, 300)
      }
    });
  }

}

